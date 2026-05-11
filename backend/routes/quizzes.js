import { Router } from 'express';
import logger from '../utils/logger.js';
import { Quiz, Progress } from '../models/index.js';
import { quizzes as fallbackQuizzes } from '../data/socContent.js';

const router = Router();

const serializeQuizForStudent = (quiz) => ({
  id: quiz._id ? String(quiz._id) : quiz.slug,
  slug: quiz.slug,
  courseSlug: quiz.courseSlug,
  title: quiz.title,
  passingScore: quiz.passingScore,
  timeLimitMinutes: quiz.timeLimitMinutes,
  questions: (quiz.questions || []).map((question) => ({
    id: question.id,
    question: question.question,
    options: question.options,
    explanation: question.explanation,
  })),
});

const gradeQuiz = (quiz, answers) => {
  const perQuestion = quiz.questions.map((question) => {
    const userChoice = Array.isArray(answers) ? answers[question.id - 1] : answers?.[question.id];
    const isCorrect = Number(userChoice) === Number(question.answerIndex);

    return {
      questionId: question.id,
      userChoice: userChoice === undefined ? null : userChoice,
      correctChoice: question.answerIndex,
      isCorrect,
      explanation: question.explanation,
    };
  });

  const score = Math.round((perQuestion.filter((item) => item.isCorrect).length / quiz.questions.length) * 100);
  return { score, perQuestion };
};

router.get('/course/:courseSlug', async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ courseSlug: req.params.courseSlug, published: true }).lean();
    if (!quiz) {
      const fallback = fallbackQuizzes.find((item) => item.courseSlug === req.params.courseSlug);
      if (!fallback) {
        return res.status(404).json({ message: 'Quiz not found for this course' });
      }

      return res.json({ quiz: serializeQuizForStudent(fallback), course: { slug: fallback.courseSlug, title: fallback.title } });
    }

    res.json({ quiz: serializeQuizForStudent(quiz), course: { slug: quiz.courseSlug, title: quiz.title } });
  } catch (error) {
    logger.error('Get quiz error:', error);
    res.status(500).json({ message: 'Failed to fetch quiz' });
  }
});

router.post('/attempt', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });

    const { quizId, answers } = req.body;
    if (!quizId) return res.status(400).json({ message: 'quizId is required' });

    const query = String(quizId).match(/^[0-9a-fA-F]{24}$/)
      ? { $or: [{ _id: quizId }, { slug: quizId }] }
      : { slug: quizId };
    const quiz = await Quiz.findOne(query).lean();
    const fallback = fallbackQuizzes.find((item) => item.slug === quizId);
    const source = quiz || fallback;
    if (!source) return res.status(404).json({ message: 'Quiz not found' });

    const { score, perQuestion } = gradeQuiz(source, answers?.answers ?? answers);
    const passed = score >= (source.passingScore ?? 70);

    await Progress.findOneAndUpdate(
      { userId },
      { $push: { quizAttempts: { quizSlug: source.slug, score, passed, attemptedAt: new Date() } } },
      { upsert: true, new: true }
    );

    res.json({
      attempt: { quizSlug: source.slug, score, passed, attemptedAt: new Date() },
      result: { score, passed, perQuestion },
    });
  } catch (error) {
    logger.error('Submit quiz attempt error:', error);
    res.status(500).json({ message: 'Failed to submit quiz' });
  }
});

export default router;
