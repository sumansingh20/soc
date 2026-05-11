import { Router } from 'express';
import logger from '../utils/logger.js';
import authenticate from '../middleware/authenticate.js';
import { DashboardBoard, DashboardWidget } from '../models/index.js';

const router = Router();

router.get('/:slug', authenticate, async (req, res) => {
  try {
    const board = await DashboardBoard.findOne({ slug: req.params.slug, published: true }).lean();
    if (!board) return res.status(404).json({ message: 'Dashboard board not found' });

    const widgetSlugs = (board.widgetOrder || []).map((w) => w.widgetSlug);
    const widgets = await DashboardWidget.find({ slug: { $in: widgetSlugs }, published: true }).lean();

    // Preserve order
    const bySlug = new Map(widgets.map((w) => [w.slug, w]));
    const ordered = widgetSlugs.map((s) => bySlug.get(s)).filter(Boolean);

    res.json({ board: { ...board, widgets: ordered } });
  } catch (error) {
    logger.error('Get dashboard board error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard board' });
  }
});

export default router;

