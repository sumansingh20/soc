import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';
import logger from '../utils/logger.js';
import { Note, Progress } from '../models/index.js';
import { notes as fallbackNotes } from '../data/socContent.js';
import { buildTextPdf } from '../utils/pdf.js';

const router = Router();

const serializeNote = (note) => ({
  id: note._id ? String(note._id) : note.slug,
  slug: note.slug,
  title: note.title,
  courseSlug: note.courseSlug,
  summary: note.summary,
  sections: note.sections || [],
  tags: note.tags || [],
  pdfTitle: note.pdfTitle,
});

router.get('/', authenticate, async (req, res) => {
  try {
    const filters = { published: true };
    if (req.query.courseSlug) filters.courseSlug = req.query.courseSlug;

    const items = await Note.find(filters).sort({ createdAt: -1 }).lean();
    const source = items.length
      ? items
      : fallbackNotes.filter((note) => !req.query.courseSlug || note.courseSlug === req.query.courseSlug);

    res.json({ notes: source.map(serializeNote), count: source.length });
  } catch (error) {
    logger.error('Get notes error:', error);
    res.status(500).json({ message: 'Failed to fetch notes' });
  }
});

router.get('/:slug', authenticate, async (req, res) => {
  try {
    const note = await Note.findOne({ slug: req.params.slug, published: true }).lean();
    const source = note || fallbackNotes.find((item) => item.slug === req.params.slug);

    if (!source) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ note: serializeNote(source) });
  } catch (error) {
    logger.error('Get note error:', error);
    res.status(500).json({ message: 'Failed to fetch note' });
  }
});

router.get('/:slug/pdf', authenticate, async (req, res) => {
  try {
    const note = await Note.findOne({ slug: req.params.slug, published: true }).lean();
    const source = note || fallbackNotes.find((item) => item.slug === req.params.slug);

    if (!source) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const lines = [
      source.summary,
      '',
      ...(source.sections || []).flatMap((section) => [section.heading, section.body, '']),
      '',
      'Created by Suman Kumar for HackShield students.',
    ];
    const pdf = buildTextPdf({ title: source.pdfTitle || source.title, lines });

    await Progress.findOneAndUpdate(
      { userId: req.user.id },
      {
        $push: {
          noteDownloads: { noteSlug: source.slug, downloadedAt: new Date() },
          downloadHistory: { itemSlug: source.slug, itemType: 'note', downloadedAt: new Date() },
        },
      },
      { upsert: true, new: true }
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${source.slug}.pdf"`);
    return res.send(pdf);
  } catch (error) {
    logger.error('Generate note PDF error:', error);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
});

router.post('/', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json({ message: 'Note created successfully', note: serializeNote(note) });
  } catch (error) {
    logger.error('Create note error:', error);
    res.status(500).json({ message: 'Failed to create note' });
  }
});

router.put('/:id', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note updated successfully', note: serializeNote(note) });
  } catch (error) {
    logger.error('Update note error:', error);
    res.status(500).json({ message: 'Failed to update note' });
  }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    logger.error('Delete note error:', error);
    res.status(500).json({ message: 'Failed to delete note' });
  }
});

export default router;
