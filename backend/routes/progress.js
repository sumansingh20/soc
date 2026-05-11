import { Router } from 'express';
import logger from '../utils/logger.js';
import { Progress } from '../models/index.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const progress = await Progress.findOne({ userId: req.user.id }).lean();

    res.json({
      progress: progress || {
        lessonIdsCompleted: [],
        labSlugsCompleted: [],
        quizAttempts: [],
        noteDownloads: [],
        commandPractices: [],
      },
    });
  } catch (error) {
    logger.error('Get progress error:', error);
    res.status(500).json({ message: 'Failed to fetch progress' });
  }
});

router.post('/complete', async (req, res) => {
  try {
    const { type, slug } = req.body;
    if (!type || !slug) {
      return res.status(400).json({ message: 'type and slug are required' });
    }

    const update = type === 'lab' ? { $addToSet: { labSlugsCompleted: slug } } : { $addToSet: { lessonIdsCompleted: slug } };
    const progress = await Progress.findOneAndUpdate({ userId: req.user.id }, update, { upsert: true, new: true });

    res.json({ message: 'Progress updated', progress });
  } catch (error) {
    logger.error('Update progress error:', error);
    res.status(500).json({ message: 'Failed to update progress' });
  }
});

router.post('/update', async (req, res) => {
  try {
    const { type = 'lesson', slug, completed = true, courseSlug, progressPercentage } = req.body;
    if (!slug && !courseSlug) {
      return res.status(400).json({ message: 'slug or courseSlug is required' });
    }

    const update = {};
    if (slug && completed && type === 'lab') update.$addToSet = { labSlugsCompleted: slug };
    if (slug && completed && type === 'lesson') update.$addToSet = { lessonIdsCompleted: slug };
    if (courseSlug) {
      update.$set = {
        courseProgress: [
          {
            courseSlug,
            progressPercentage: Number(progressPercentage ?? 0),
            status: Number(progressPercentage ?? 0) >= 100 ? 'completed' : 'in_progress',
            lastAccessedAt: new Date(),
          },
        ],
      };
    }

    const progress = await Progress.findOneAndUpdate({ userId: req.user.id }, update, { upsert: true, new: true });
    res.json({ message: 'Progress updated', progress });
  } catch (error) {
    logger.error('Update progress error:', error);
    res.status(500).json({ message: 'Failed to update progress' });
  }
});

router.post('/download', async (req, res) => {
  try {
    const { noteSlug } = req.body;
    if (!noteSlug) {
      return res.status(400).json({ message: 'noteSlug is required' });
    }

    const progress = await Progress.findOneAndUpdate(
      { userId: req.user.id },
      { $push: { noteDownloads: { noteSlug, downloadedAt: new Date() } } },
      { upsert: true, new: true }
    );

    res.json({ message: 'Download tracked', progress });
  } catch (error) {
    logger.error('Track download error:', error);
    res.status(500).json({ message: 'Failed to track download' });
  }
});

export default router;
