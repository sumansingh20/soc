import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';
import logger from '../utils/logger.js';
import { Command, Progress } from '../models/index.js';
import { commands as fallbackCommands } from '../data/socContent.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const commands = await Command.find({ published: true }).sort({ name: 1 }).lean();
    const source = commands.length ? commands : fallbackCommands;
    res.json({ commands: source, count: source.length });
  } catch (error) {
    logger.error('Get commands error:', error);
    res.status(500).json({ message: 'Failed to fetch commands' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const command = await Command.findOne({ slug: req.params.slug, published: true }).lean();
    const fallback = fallbackCommands.find((item) => item.slug === req.params.slug || item.name === req.params.slug);

    if (!command && !fallback) {
      return res.status(404).json({ message: 'Command not found' });
    }

    res.json({ command: command || fallback });
  } catch (error) {
    logger.error('Get command error:', error);
    res.status(500).json({ message: 'Failed to fetch command' });
  }
});

router.post('/:slug/practice', authenticate, async (req, res) => {
  try {
    const command = await Command.findOne({ slug: req.params.slug }).lean();
    const fallback = fallbackCommands.find((item) => item.slug === req.params.slug);
    const source = command || fallback;
    if (!source) return res.status(404).json({ message: 'Command not found' });

    const progress = await Progress.findOneAndUpdate(
      { userId: req.user.id },
      {
        $push: {
          commandPractices: {
            commandName: source.name,
            notes: req.body.notes || '',
            practicedAt: new Date(),
          },
        },
      },
      { upsert: true, new: true }
    );

    res.json({ message: 'Command practice tracked', progress });
  } catch (error) {
    logger.error('Track command practice error:', error);
    res.status(500).json({ message: 'Failed to track command practice' });
  }
});

router.post('/', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const command = await Command.create(req.body);
    res.status(201).json({ message: 'Command created successfully', command });
  } catch (error) {
    logger.error('Create command error:', error);
    res.status(500).json({ message: 'Failed to create command' });
  }
});

router.put('/:id', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const command = await Command.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!command) {
      return res.status(404).json({ message: 'Command not found' });
    }

    res.json({ message: 'Command updated successfully', command });
  } catch (error) {
    logger.error('Update command error:', error);
    res.status(500).json({ message: 'Failed to update command' });
  }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const command = await Command.findByIdAndDelete(req.params.id);

    if (!command) {
      return res.status(404).json({ message: 'Command not found' });
    }

    res.json({ message: 'Command deleted successfully' });
  } catch (error) {
    logger.error('Delete command error:', error);
    res.status(500).json({ message: 'Failed to delete command' });
  }
});

export default router;
