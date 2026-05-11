import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';
import logger from '../utils/logger.js';
import { Resource, Progress } from '../models/index.js';
import { resources as fallbackResources } from '../data/socContent.js';

const router = Router();

const serializeResource = (resource) => ({
  id: resource._id ? String(resource._id) : resource.slug,
  slug: resource.slug,
  title: resource.title,
  category: resource.category,
  description: resource.description,
  type: resource.type,
  url: resource.url,
  noteSlug: resource.noteSlug,
});

router.get('/', async (req, res) => {
  try {
    const filters = { published: true };
    if (req.query.category) filters.category = req.query.category;
    if (req.query.type) filters.type = req.query.type;

    const items = await Resource.find(filters).sort({ createdAt: -1 }).lean();
    const source = items.length
      ? items
      : fallbackResources.filter((resource) => {
          const matchesCategory = !req.query.category || resource.category === req.query.category;
          const matchesType = !req.query.type || resource.type === req.query.type;
          return matchesCategory && matchesType;
        });

    res.json({ resources: source.map(serializeResource), count: source.length });
  } catch (error) {
    logger.error('Get resources error:', error);
    res.status(500).json({ message: 'Failed to fetch resources' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const resource = await Resource.findOne({ slug: req.params.slug, published: true }).lean();
    const source = resource || fallbackResources.find((item) => item.slug === req.params.slug);

    if (!source) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json({ resource: serializeResource(source) });
  } catch (error) {
    logger.error('Get resource error:', error);
    res.status(500).json({ message: 'Failed to fetch resource' });
  }
});

router.post('/:slug/download', authenticate, async (req, res) => {
  try {
    const resource = await Resource.findOne({ slug: req.params.slug }).lean();
    const source = resource || fallbackResources.find((item) => item.slug === req.params.slug);
    if (!source) return res.status(404).json({ message: 'Resource not found' });

    await Progress.findOneAndUpdate(
      { userId: req.user.id },
      {
        $push: {
          downloadHistory: { itemSlug: source.slug, itemType: source.type || 'resource', downloadedAt: new Date() },
        },
      },
      { upsert: true, new: true }
    );

    res.json({ message: 'Download tracked', resource: serializeResource(source) });
  } catch (error) {
    logger.error('Track resource download error:', error);
    res.status(500).json({ message: 'Failed to track resource download' });
  }
});

router.post('/', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json({ message: 'Resource created successfully', resource: serializeResource(resource) });
  } catch (error) {
    logger.error('Create resource error:', error);
    res.status(500).json({ message: 'Failed to create resource' });
  }
});

router.put('/:id', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json({ message: 'Resource updated successfully', resource: serializeResource(resource) });
  } catch (error) {
    logger.error('Update resource error:', error);
    res.status(500).json({ message: 'Failed to update resource' });
  }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    logger.error('Delete resource error:', error);
    res.status(500).json({ message: 'Failed to delete resource' });
  }
});

export default router;
