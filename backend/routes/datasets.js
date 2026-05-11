import { Router } from 'express';
import logger from '../utils/logger.js';
import authenticate from '../middleware/authenticate.js';
import { Dataset } from '../models/index.js';

const router = Router();

router.get('/:slug', authenticate, async (req, res) => {
  try {
    const dataset = await Dataset.findOne({ slug: req.params.slug, published: true }).lean();
    if (!dataset) return res.status(404).json({ message: 'Dataset not found' });

    // Avoid sending huge payload unless requested.
    const includePayload = String(req.query.includePayload ?? 'false') === 'true';

    const { payload, ...rest } = dataset;
    res.json({ dataset: includePayload ? dataset : rest });
  } catch (error) {
    logger.error('Get dataset error:', error);
    res.status(500).json({ message: 'Failed to fetch dataset' });
  }
});

export default router;

