import { Router } from 'express';
import logger from '../utils/logger.js';
import { Progress, Course } from '../models/index.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const progress = await Progress.findOne({ userId: req.user.id }).lean();
    const courses = await Course.find({ published: true }).lean();
    const completed = progress?.lessonIdsCompleted?.length || 0;
    const eligible = completed >= Math.max(1, Math.ceil(courses.length / 2));

    res.json({
      certificates: eligible
        ? [
            {
              id: `${req.user.id}-soc-fundamentals`,
              title: 'SOC Fundamentals',
              certificateCode: `SOC-${String(req.user.id).slice(-6).toUpperCase()}`,
              courseTitle: 'SOC Training Path',
              isValid: true,
              issueDate: new Date().toISOString(),
            },
          ]
        : [],
    });
  } catch (error) {
    logger.error('Get certificates error:', error);
    res.status(500).json({ message: 'Failed to fetch certificates' });
  }
});

router.get('/verify/:code', async (req, res) => {
  try {
    const valid = req.params.code.startsWith('SOC-');
    res.json({ valid, code: req.params.code });
  } catch (error) {
    logger.error('Verify certificate error:', error);
    res.status(500).json({ message: 'Failed to verify certificate' });
  }
});

export default router;