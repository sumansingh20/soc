import { query } from '../config/database.js';

// Quiz payload format stored in quizzes.questions (JSONB)
// Expected shape:
// {
//   "questions": [
//     { "id": 1, "question": "...", "options": ["..."], "correct": 0, "explanation": "..." }
//   ]
// }

export const getQuizByCourseSlug = async (courseSlug) => {
  const result = await query(
    `SELECT q.*,
            c.slug AS course_slug,
            c.title AS course_title
     FROM quizzes q
     JOIN courses c ON q.course_id = c.id
     WHERE c.slug = $1
     ORDER BY q.created_at DESC
     LIMIT 1`,
    [courseSlug]
  );

  const row = result.rows[0];
  if (!row) return null;

  // Normalize questions payload
  let questionsPayload = row.questions;
  if (typeof questionsPayload === 'string') {
    try {
      questionsPayload = JSON.parse(questionsPayload);
    } catch {
      // keep as-is
    }
  }

  const questions = questionsPayload?.questions || questionsPayload || [];

  return {
    quiz: {
      id: row.id,
      courseId: row.course_id,
      title: row.title,
      passingScore: row.passing_score ?? row.passing_score,
      timeLimitMinutes: row.time_limit_minutes,
      questions,
    },
    course: {
      slug: row.course_slug,
      title: row.course_title,
    },
  };
};

export const getQuizById = async (quizId) => {
  const result = await query(
    `SELECT * FROM quizzes WHERE id = $1`,
    [quizId]
  );

  const row = result.rows[0];
  if (!row) return null;

  let questionsPayload = row.questions;
  if (typeof questionsPayload === 'string') {
    try {
      questionsPayload = JSON.parse(questionsPayload);
    } catch {
      // keep as-is
    }
  }

  const questions = questionsPayload?.questions || questionsPayload || [];

  return {
    id: row.id,
    courseId: row.course_id,
    title: row.title,
    passingScore: row.passing_score,
    timeLimitMinutes: row.time_limit_minutes,
    questions,
  };
};

export const gradeQuizAttempt = (questions, userAnswers) => {
  // userAnswers expected shape: { "answers": [0,2,1,...] }
  const answersArr = userAnswers?.answers || userAnswers || [];

  let correct = 0;
  const total = questions.length;

  const perQuestion = questions.map((q, idx) => {
    const userChoice = answersArr[idx];
    const isCorrect = userChoice === q.correct;
    if (isCorrect) correct++;
    return {
      questionId: q.id ?? idx,
      userChoice,
      correctChoice: q.correct,
      isCorrect,
      explanation: q.explanation,
    };
  });

  const score = total ? Math.round((correct / total) * 100) : 0;
  return {
    score,
    perQuestion,
  };
};

export const recordQuizAttempt = async ({ userId, quizId, answers, score, passed }) => {
  const result = await query(
    `INSERT INTO quiz_attempts (user_id, quiz_id, answers, score, passed, completed_at)
     VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
     RETURNING *`,
    [userId, quizId, JSON.stringify(answers), score, passed]
  );

  return result.rows[0];
};

export const upsertCourseProgressForQuiz = async ({ userId, courseId, quizScore, passed }) => {
  // Update status and percentage.
  // If passed -> mark completed-ish; else in_progress.
  const progressPercentage = passed ? Math.max(80, quizScore) : Math.min(79, quizScore);
  const status = passed ? 'completed' : 'in_progress';

  const result = await query(
    `INSERT INTO user_progress (user_id, course_id, progress_percentage, status, quiz_score)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (user_id, course_id)
     DO UPDATE SET
       progress_percentage = $3,
       status = $4,
       quiz_score = $5,
       updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [userId, courseId, progressPercentage, status, quizScore]
  );

  return result.rows[0];
};

