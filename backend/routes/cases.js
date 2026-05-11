import { Router } from 'express';
import logger from '../utils/logger.js';
import authenticate from '../middleware/authenticate.js';
import { CaseStudy } from '../models/index.js';

const router = Router();

router.get('/:slug', authenticate, async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findOne({ slug: req.params.slug, published: true }).lean();
    if (!caseStudy) return res.status(404).json({ message: 'Case study not found' });
    res.json({ caseStudy });
  } catch (error) {
    logger.error('Get case study error:', error);
    res.status(500).json({ message: 'Failed to fetch case study' });
  }
});

export default router;

