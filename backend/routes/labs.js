import { Router } from 'express';
import logger from '../utils/logger.js';
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';
import { Lab, Progress } from '../models/index.js';
import { labs as fallbackLabs } from '../data/socContent.js';

const router = Router();

const serializeLab = (lab) => ({
  id: lab._id ? String(lab._id) : lab.slug,
  slug: lab.slug,
  title: lab.title,
  description: lab.description,
  scenario: lab.scenario,
  objective: lab.objective,
  difficulty: lab.difficulty,
  category: lab.category,
  tags: lab.tags || [],
  estimatedMinutes: lab.estimatedMinutes || lab.estimatedTimeMinutes || 30,
  estimatedTimeMinutes: lab.estimatedTimeMinutes || lab.estimatedMinutes || 30,
  logs: lab.logs || [],
  sampleLogs: lab.sampleLogs || [],
  commands: lab.commands || [],
  workflow: lab.workflow || [],
  expectedFindings: lab.expectedFindings || [],
  solution: lab.solution,
});

const scoreSubmission = (lab, findings = '', report = '') => {
  const text = `${findings} ${report}`.toLowerCase();
  const keywords = [lab.solution, ...(lab.expectedFindings || [])]
    .join(' ')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 3);

  const uniqueMatches = new Set(keywords.filter((word) => text.includes(word)));
  const score = Math.min(100, uniqueMatches.size * 25 + 25);

  return {
    score,
    feedback: score >= 75 ? 'Good investigation. The evidence is aligned with the scenario.' : 'Review the logs again and tighten the evidence summary.',
  };
};

router.get('/', authenticate, async (_req, res) => {
  try {
    const items = await Lab.find({ published: true }).sort({ createdAt: -1 }).lean();

    if (!items.length) {
      return res.json({ labs: fallbackLabs.map(serializeLab) });
    }

    res.json({
      labs: items.map(serializeLab),
    });
  } catch (error) {
    logger.error('Get labs error:', error);
    res.status(500).json({ message: 'Failed to fetch labs' });
  }
});

router.get('/:slug', authenticate, async (req, res) => {
  try {
    const lab = await Lab.findOne({ slug: req.params.slug }).lean();


    if (!lab) {
      const fallback = fallbackLabs.find((item) => item.slug === req.params.slug);
      if (!fallback) {
        return res.status(404).json({ message: 'Lab not found' });
      }

      return res.json({ lab: serializeLab(fallback) });
    }

    res.json({ lab: serializeLab(lab) });
  } catch (error) {
    logger.error('Get lab error:', error);
    res.status(500).json({ message: 'Failed to fetch lab' });
  }
});

router.post('/:labId/submit', authenticate, async (req, res) => {
  try {

    const { findings, report } = req.body;
    const query = req.params.labId.match(/^[0-9a-fA-F]{24}$/)
      ? { $or: [{ _id: req.params.labId }, { slug: req.params.labId }] }
      : { slug: req.params.labId };
    const lab = await Lab.findOne(query);

    if (!lab) {
      const fallback = fallbackLabs.find((item) => item.slug === req.params.labId);
      if (!fallback) return res.status(404).json({ message: 'Lab not found' });

      const grading = scoreSubmission(fallback, findings, report);
      await Progress.findOneAndUpdate(
        { userId: req.user.id },
        { $addToSet: { labSlugsCompleted: fallback.slug } },
        { upsert: true, new: true }
      );

      return res.status(201).json({
        message: 'Lab submission received',
        submission: { labSlug: fallback.slug, score: grading.score, feedback: grading.feedback },
      });
    }

    const grading = scoreSubmission(lab, findings, report);

    lab.submissions.unshift({
      userId: req.user.id,
      findings,
      report,
      score: grading.score,
      feedback: grading.feedback,
      submittedAt: new Date(),
    });
    await lab.save();

    await Progress.findOneAndUpdate(
      { userId: req.user.id },
      { $addToSet: { labSlugsCompleted: lab.slug } },
      { upsert: true, new: true }
    );

    res.status(201).json({
      message: 'Lab submission received',
      submission: { labSlug: lab.slug, score: grading.score, feedback: grading.feedback },
    });
  } catch (error) {
    logger.error('Submit lab error:', error);
    res.status(500).json({ message: 'Failed to submit lab' });
  }
});

router.get('/:labId/submissions', authenticate, async (req, res) => {
  try {

    const lab = await Lab.findById(req.params.labId).lean();
    if (!lab) {
      return res.status(404).json({ message: 'Lab not found' });
    }

    const submissions = (lab.submissions || []).filter((submission) => String(submission.userId) === req.user.id);
    res.json({ submissions });
  } catch (error) {
    logger.error('Get submissions error:', error);
    res.status(500).json({ message: 'Failed to fetch submissions' });
  }
});

export default router;
