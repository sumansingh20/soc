import { Router } from 'express';
import logger from '../utils/logger.js';
import authenticate from '../middleware/authenticate.js';
import { EvidencePack } from '../models/index.js';

const router = Router();

router.get('/:packSlug', authenticate, async (req, res) => {
  try {
    const pack = await EvidencePack.findOne({ slug: req.params.packSlug, published: true }).lean();
    if (!pack) return res.status(404).json({ message: 'Evidence pack not found' });
    res.json({ evidencePack: pack });
  } catch (error) {
    logger.error('Get evidence pack error:', error);
    res.status(500).json({ message: 'Failed to fetch evidence pack' });
  }
});

export default router;

