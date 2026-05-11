import { Router } from 'express';
import logger from '../utils/logger.js';
import { Course, Lesson } from '../models/index.js';
import { courses as fallbackCourses, days } from '../data/socContent.js';

const router = Router();

const serializeCourse = (course) => ({
  id: course._id ? String(course._id) : course.slug,
  slug: course.slug,
  title: course.title,
  description: course.description,
  category: course.category || 'SOC Training',
  difficulty: course.difficulty,
  order: course.order,
  durationHours: course.durationHours || 0,
  objectives: course.objectives || [],
  lessonSlugs: course.lessonSlugs || [],
});

router.get('/', async (_req, res) => {
  try {
    const courses = await Course.find({ published: true }).sort({ order: 1 }).lean();

    if (!courses.length) {
      return res.json({ courses: fallbackCourses });
    }

    res.json({
      courses: courses.map(serializeCourse),
    });
  } catch (error) {
    logger.error('Get courses error:', error);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug }).lean();

    if (!course) {
      const fallback = fallbackCourses.find((item) => item.slug === req.params.slug);
      if (!fallback) {
        return res.status(404).json({ message: 'Course not found' });
      }

      const lesson = days.find((item) => item.courseSlug === fallback.slug);
      return res.json({ course: serializeCourse(fallback), lessons: lesson ? [lesson] : [] });
    }

    const lessons = await Lesson.find({ courseSlug: course.slug, published: true }).sort({ createdAt: 1 }).lean();

    res.json({
      course: serializeCourse(course),
      lessons,
    });
  } catch (error) {
    logger.error('Get course error:', error);
    res.status(500).json({ message: 'Failed to fetch course' });
  }
});

export default router;
