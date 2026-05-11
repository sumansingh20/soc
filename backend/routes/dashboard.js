import { Router } from 'express';
import logger from '../utils/logger.js';
import { Progress, Course, Lab, Quiz, Note, Resource } from '../models/index.js';
import { courses as fallbackCourses, labs as fallbackLabs, quizzes as fallbackQuizzes, notes as fallbackNotes, resources as fallbackResources, days } from '../data/socContent.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [progress, courses, labs, quizzes, notes, resources] = await Promise.all([
      Progress.findOne({ userId: req.user.id }).lean(),
      Course.find({ published: true }).sort({ order: 1 }).lean(),
      Lab.find({ published: true }).sort({ createdAt: -1 }).lean(),
      Quiz.find({ published: true }).sort({ createdAt: -1 }).lean(),
      Note.find({ published: true }).sort({ createdAt: -1 }).lean(),
      Resource.find({ published: true }).sort({ createdAt: -1 }).lean(),
    ]);

    const courseSource = courses.length ? courses : fallbackCourses;
    const labSource = labs.length ? labs : fallbackLabs;
    const quizSource = quizzes.length ? quizzes : fallbackQuizzes;
    const noteSource = notes.length ? notes : fallbackNotes;
    const resourceSource = resources.length ? resources : fallbackResources;
    const lessonCount = days.length || courseSource.length || 1;
    const completedLessons = progress?.lessonIdsCompleted?.length || 0;
    const completedLabs = progress?.labSlugsCompleted?.length || 0;
    const quizAttempts = progress?.quizAttempts || [];
    const latestAttempt = quizAttempts[0] || null;

    res.json({
      dashboard: {
        stats: {
          coursesEnrolled: courseSource.length,
          avgProgress: Math.round((completedLessons / lessonCount) * 100) || 0,
          completedCourses: completedLessons,
          completedLabs,
          quizScoreAverage: quizAttempts.length
            ? Math.round(quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / quizAttempts.length)
            : 0,
        },
        courses: courseSource,
        labs: labSource,
        quizzes: quizSource,
        notes: noteSource,
        resources: resourceSource,
        recentActivity: {
          latestQuizAttempt: latestAttempt,
          downloads: progress?.noteDownloads || [],
          commands: progress?.commandPractices || [],
        },
        dailyTasks: progress?.dailyTasks?.length
          ? progress.dailyTasks
          : days.slice(0, 4).map((day, index) => ({
              daySlug: day.slug,
              title: `${day.dayLabel}: ${day.practiceTasks?.[0] || day.title}`,
              completed: index < completedLessons,
            })),
        notifications: progress?.notifications || [
          {
            title: 'Welcome to HackShield SOC',
            message: 'Start with Day 1, download your notes, and complete one lab.',
            type: 'info',
            read: false,
          },
        ],
      },
    });
  } catch (error) {
    logger.error('Get dashboard error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard' });
  }
});

export default router;
