import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';
import logger from '../utils/logger.js';
import { Lesson } from '../models/index.js';
import { days as fallbackLessons } from '../data/socContent.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const filters = {};

    if (req.query.courseSlug) {
      filters.courseSlug = req.query.courseSlug;
    }

    if (req.query.published !== undefined) {
      filters.published = req.query.published === 'true';
    }

    const lessons = await Lesson.find(filters).sort({ dayNumber: 1, createdAt: 1 }).lean();
    const source = lessons.length
      ? lessons
      : fallbackLessons.filter((lesson) => !req.query.courseSlug || lesson.courseSlug === req.query.courseSlug);
    res.json({ lessons: source, count: source.length });
  } catch (error) {
    logger.error('Get lessons error:', error);
    res.status(500).json({ message: 'Failed to fetch lessons' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const lesson = await Lesson.findOne({ slug: req.params.slug }).lean();
    const fallback = fallbackLessons.find((item) => item.slug === req.params.slug);

    if (!lesson && !fallback) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json({ lesson: lesson || fallback });
  } catch (error) {
    logger.error('Get lesson error:', error);
    res.status(500).json({ message: 'Failed to fetch lesson' });
  }
});

router.post('/', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const lesson = await Lesson.create(req.body);
    res.status(201).json({ message: 'Lesson created successfully', lesson });
  } catch (error) {
    logger.error('Create lesson error:', error);
    res.status(500).json({ message: 'Failed to create lesson' });
  }
});

router.put('/:id', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json({ message: 'Lesson updated successfully', lesson });
  } catch (error) {
    logger.error('Update lesson error:', error);
    res.status(500).json({ message: 'Failed to update lesson' });
  }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    logger.error('Delete lesson error:', error);
    res.status(500).json({ message: 'Failed to delete lesson' });
  }
});

export default router;
