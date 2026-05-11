import { Router } from 'express';
import logger from '../utils/logger.js';
import { Course, Lesson, Lab, Note, Command, Resource } from '../models/index.js';
import {
  courses as fallbackCourses,
  days as fallbackDays,
  labs as fallbackLabs,
  notes as fallbackNotes,
  commands as fallbackCommands,
  resources as fallbackResources,
} from '../data/socContent.js';

const router = Router();

router.get('/roadmap', async (req, res) => {
  try {
    const courses = await Course.find({ published: true }).sort({ order: 1, createdAt: 1 });
    const source = courses.length ? courses : fallbackCourses;

    const grouped = {
      beginner: source.filter((course) => course.difficulty === 'beginner'),
      intermediate: source.filter((course) => course.difficulty === 'intermediate'),
      advanced: source.filter((course) => course.difficulty === 'advanced'),
    };

    res.json({ roadmap: grouped });
  } catch (error) {
    logger.error('Get roadmap error:', error);
    res.status(500).json({ message: 'Failed to fetch roadmap' });
  }
});

router.get('/days', async (req, res) => {
  try {
    const lessons = await Lesson.find({ published: true }).sort({ dayNumber: 1 }).lean();
    const source = lessons.length ? lessons : fallbackDays;

    const days = source.map((lesson) => ({
      slug: lesson.slug,
      day: lesson.day || lesson.dayLabel,
      dayLabel: lesson.dayLabel,
      dayNumber: lesson.dayNumber,
      title: lesson.title,
      summary: lesson.summary,
      courseSlug: lesson.courseSlug,
      notes: lesson.notes,
      commands: lesson.commands,
      labs: lesson.labs,
      quizSlug: lesson.quizSlug,
      downloadSlug: lesson.downloadSlug,
    }));

    res.json({ days });
  } catch (error) {
    logger.error('Get day plans error:', error);
    res.status(500).json({ message: 'Failed to fetch day plans' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const query = String(req.query.q || '').trim();

    if (!query) {
      return res.json({ results: [] });
    }

    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    const [courses, lessons, labs, notes, commands, resources] = await Promise.all([
      Course.find({ $or: [{ title: regex }, { description: regex }] }).limit(8),
      Lesson.find({ $or: [{ title: regex }, { summary: regex }, { dayLabel: regex }] }).limit(8),
      Lab.find({ $or: [{ title: regex }, { description: regex }, { scenario: regex }] }).limit(8),
      Note.find({ $or: [{ title: regex }, { summary: regex }] }).limit(8),
      Command.find({ $or: [{ name: regex }, { description: regex }] }).limit(8),
      Resource.find({ $or: [{ title: regex }, { description: regex }, { category: regex }] }).limit(8),
    ]);

    const dbResults = [
      ...courses.map((item) => ({ type: 'course', title: item.title, slug: item.slug, description: item.description, url: `/courses/${item.slug}` })),
      ...lessons.map((item) => ({ type: 'lesson', title: item.title, slug: item.slug, description: item.summary, url: '/day-wise' })),
      ...labs.map((item) => ({ type: 'lab', title: item.title, slug: item.slug, description: item.description, url: `/labs/${item.slug}` })),
      ...notes.map((item) => ({ type: 'note', title: item.title, slug: item.slug, description: item.summary, url: `/resources` })),
      ...commands.map((item) => ({ type: 'command', title: item.name, slug: item.slug, description: item.description, url: '/commands' })),
      ...resources.map((item) => ({ type: 'resource', title: item.title, slug: item.slug, description: item.description, url: item.url || '/resources' })),
    ];

    const fallbackResults = [
      ...fallbackCourses.map((item) => ({ type: 'course', title: item.title, slug: item.slug, description: item.description, url: `/courses/${item.slug}` })),
      ...fallbackDays.map((item) => ({ type: 'lesson', title: item.title, slug: item.slug, description: item.summary, url: '/day-wise' })),
      ...fallbackLabs.map((item) => ({ type: 'lab', title: item.title, slug: item.slug, description: item.description, url: `/labs/${item.slug}` })),
      ...fallbackNotes.map((item) => ({ type: 'note', title: item.title, slug: item.slug, description: item.summary, url: '/resources' })),
      ...fallbackCommands.map((item) => ({ type: 'command', title: item.name, slug: item.slug, description: item.description, url: '/commands' })),
      ...fallbackResources.map((item) => ({ type: 'resource', title: item.title, slug: item.slug, description: item.description, url: item.url || '/resources' })),
    ].filter((item) => `${item.title} ${item.description} ${item.type}`.toLowerCase().includes(query.toLowerCase()));

    const results = dbResults.length ? dbResults : fallbackResults.slice(0, 24);

    res.json({ results });
  } catch (error) {
    logger.error('Search content error:', error);
    res.status(500).json({ message: 'Failed to search content' });
  }
});

export default router;
