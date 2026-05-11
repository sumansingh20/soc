import { Router } from 'express';
import authorize from '../middleware/authorize.js';
import logger from '../utils/logger.js';
import { User, Course, Lesson, Lab, Quiz, Note, Command, Resource, Progress } from '../models/index.js';
import { courses, days, notes, commands, labs, quizzes, resources } from '../data/socContent.js';

const router = Router();

const collections = {
  courses: Course,
  lessons: Lesson,
  labs: Lab,
  quizzes: Quiz,
  notes: Note,
  commands: Command,
  resources: Resource,
};

router.get('/users', authorize('admin'), async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    res.json({
      users: users.map((user) => ({
        id: String(user._id),
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      })),
    });
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

router.get('/analytics', authorize('admin'), async (_req, res) => {
  try {
    const [users, courses, labsCount, quizzesCount, notesCount, resourcesCount, progressCount] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Lab.countDocuments(),
      Quiz.countDocuments(),
      Note.countDocuments(),
      Resource.countDocuments(),
      Progress.countDocuments(),
    ]);

    res.json({
      analytics: {
        totalUsers: users,
        totalCourses: courses,
        totalLabs: labsCount,
        totalQuizzes: quizzesCount,
        totalNotes: notesCount,
        totalResources: resourcesCount,
        totalProgressRecords: progressCount,
      },
    });
  } catch (error) {
    logger.error('Get analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

router.post('/users/:userId/suspend', authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, { status: 'suspended' }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User suspended',
      user: {
        id: String(user._id),
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    logger.error('Suspend user error:', error);
    res.status(500).json({ message: 'Failed to suspend user' });
  }
});

router.get('/content/:type', authorize('admin'), async (req, res) => {
  try {
    const model = collections[req.params.type];
    if (!model) {
      return res.status(400).json({ message: 'Unsupported content type' });
    }

    const items = await model.find().sort({ createdAt: -1 }).lean();
    res.json({ items });
  } catch (error) {
    logger.error('Get content error:', error);
    res.status(500).json({ message: 'Failed to fetch content' });
  }
});

router.post('/content/:type', authorize('admin'), async (req, res) => {
  try {
    const model = collections[req.params.type];
    if (!model) {
      return res.status(400).json({ message: 'Unsupported content type' });
    }

    const item = await model.create(req.body);
    res.status(201).json({ item });
  } catch (error) {
    logger.error('Create content error:', error);
    res.status(500).json({ message: 'Failed to create content' });
  }
});

router.put('/content/:type/:id', authorize('admin'), async (req, res) => {
  try {
    const model = collections[req.params.type];
    if (!model) {
      return res.status(400).json({ message: 'Unsupported content type' });
    }

    const item = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ item });
  } catch (error) {
    logger.error('Update content error:', error);
    res.status(500).json({ message: 'Failed to update content' });
  }
});

router.delete('/content/:type/:id', authorize('admin'), async (req, res) => {
  try {
    const model = collections[req.params.type];
    if (!model) {
      return res.status(400).json({ message: 'Unsupported content type' });
    }

    await model.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (error) {
    logger.error('Delete content error:', error);
    res.status(500).json({ message: 'Failed to delete content' });
  }
});

router.post('/seed-fallback', authorize('admin'), async (_req, res) => {
  try {
    for (const course of courses) {
      await Course.updateOne({ slug: course.slug }, { $set: course }, { upsert: true });
    }

    for (const item of days) {
      await Lesson.updateOne(
        { slug: item.slug },
        {
          $set: {
            slug: item.slug,
            courseSlug: item.courseSlug,
            dayNumber: item.dayNumber,
            dayLabel: item.dayLabel,
            title: item.title,
            summary: item.summary,
            notes: item.notes,
            commands: item.commands,
            labs: item.labs,
            quizSlug: item.quizSlug,
            downloadSlug: item.downloadSlug,
            published: true,
          },
        },
        { upsert: true }
      );
    }

    for (const item of notes) await Note.updateOne({ slug: item.slug }, { $setOnInsert: item }, { upsert: true });
    for (const item of commands) await Command.updateOne({ slug: item.slug }, { $setOnInsert: item }, { upsert: true });
    for (const item of labs) await Lab.updateOne({ slug: item.slug }, { $setOnInsert: item }, { upsert: true });
    for (const item of quizzes) await Quiz.updateOne({ slug: item.slug }, { $setOnInsert: item }, { upsert: true });
    for (const item of resources) await Resource.updateOne({ slug: item.slug }, { $setOnInsert: item }, { upsert: true });

    res.json({ message: 'Fallback content seeded' });
  } catch (error) {
    logger.error('Seed content error:', error);
    res.status(500).json({ message: 'Failed to seed content' });
  }
});

export default router;
