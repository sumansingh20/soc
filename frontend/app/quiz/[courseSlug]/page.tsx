'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FiAlertCircle, FiCheckCircle, FiClock, FiLoader, FiRotateCcw, FiXCircle } from 'react-icons/fi';
import { quizApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

type Question = {
  id: number | string;
  question: string;
  options: string[];
  explanation?: string;
};

type Quiz = {
  id: string;
  slug: string;
  title: string;
  courseSlug: string;
  passingScore: number;
  timeLimitMinutes: number;
  questions: Question[];
};

type Result = {
  score: number;
  passed: boolean;
  perQuestion: {
    questionId: number | string;
    userChoice: number | null;
    correctChoice: number;
    isCorrect: boolean;
    explanation?: string;
  }[];
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default function QuizPage({ params }: { params: { courseSlug: string } }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadQuiz = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await quizApi.getByCourseSlug(params.courseSlug);
        const loadedQuiz: Quiz = response.data.quiz;
        setQuiz(loadedQuiz);
        setAnswers(new Array(loadedQuiz.questions.length).fill(null));
        setTimeLeft((loadedQuiz.timeLimitMinutes || 20) * 60);
      } catch (err: any) {
        if (err.response?.status === 401) {
          router.push('/login');
          return;
        }
        setError(err.response?.data?.message || 'Unable to load quiz');
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [params.courseSlug, router]);

  useEffect(() => {
    if (!quiz || result || timeLeft <= 0) return;

    const timer = window.setInterval(() => {
      setTimeLeft((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [quiz, result, timeLeft]);

  useEffect(() => {
    if (quiz && timeLeft === 0 && !result && answers.some((answer) => answer !== null)) {
      void submitQuiz();
    }
  }, [timeLeft]);

  const answeredCount = useMemo(() => answers.filter((answer) => answer !== null).length, [answers]);
  const question = quiz?.questions[currentQuestion];

  const chooseAnswer = (answerIndex: number) => {
    setAnswers((previous) => {
      const next = [...previous];
      next[currentQuestion] = answerIndex;
      return next;
    });
  };

  const submitQuiz = async () => {
    if (!quiz || submitting) return;
    if (!user) {
      router.push('/login');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await quizApi.submitAttempt({
        quizId: quiz.id || quiz.slug,
        answers: answers.map((answer) => (answer === null ? -1 : answer)),
      });
      setResult(response.data.result);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const resetQuiz = () => {
    if (!quiz) return;
    setAnswers(new Array(quiz.questions.length).fill(null));
    setCurrentQuestion(0);
    setTimeLeft((quiz.timeLimitMinutes || 20) * 60);
    setResult(null);
    setError('');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="flex items-center justify-center text-soc-accent">
          <FiLoader className="animate-spin" size={42} />
        </div>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-soc-red/30 bg-soc-red/10 p-8 text-center">
          <FiAlertCircle className="mx-auto mb-4 text-soc-red" size={42} />
          <h1 className="mb-3 text-2xl font-bold text-white">Quiz unavailable</h1>
          <p className="mb-6 text-gray-300">{error}</p>
          <Link className="text-soc-accent" href="/day-wise">Back to day wise learning</Link>
        </div>
      </div>
    );
  }

  if (!quiz || !question) return null;

  if (result) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-5xl"
        >
          <div className={`mb-8 rounded-3xl border p-8 text-center ${result.passed ? 'border-green-500/30 bg-green-500/10' : 'border-soc-red/30 bg-soc-red/10'}`}>
            {result.passed ? (
              <FiCheckCircle className="mx-auto mb-4 text-green-400" size={58} />
            ) : (
              <FiXCircle className="mx-auto mb-4 text-soc-red" size={58} />
            )}
            <p className="mb-2 text-sm uppercase tracking-[0.25em] text-soc-accent/70">{quiz.title}</p>
            <h1 className="mb-4 text-4xl font-black text-white">{result.passed ? 'Quiz passed' : 'Review and try again'}</h1>
            <p className="mb-6 text-6xl font-black text-soc-accent">{result.score}%</p>
            <p className="mx-auto max-w-2xl text-gray-300">
              Passing score is {quiz.passingScore}%. Your attempt is saved to your HackShield student progress.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={resetQuiz}
                className="inline-flex items-center gap-2 rounded-lg border border-soc-accent/40 px-5 py-3 font-semibold text-soc-accent hover:border-soc-accent"
              >
                <FiRotateCcw /> Retake quiz
              </button>
              <Link href="/student-dashboard" className="rounded-lg bg-soc-accent px-5 py-3 font-semibold text-soc-dark">
                Open dashboard
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {quiz.questions.map((item, index) => {
              const review = result.perQuestion[index];
              const isCorrect = review?.isCorrect;

              return (
                <div key={item.id} className={`rounded-2xl border p-5 ${isCorrect ? 'border-green-500/20 bg-green-500/5' : 'border-soc-red/20 bg-soc-red/5'}`}>
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <h2 className="font-semibold text-white">{index + 1}. {item.question}</h2>
                    {isCorrect ? <FiCheckCircle className="text-green-400" /> : <FiXCircle className="text-soc-red" />}
                  </div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    {item.options.map((option, optionIndex) => (
                      <div
                        key={option}
                        className={`rounded-xl border px-4 py-3 text-sm ${
                          optionIndex === review?.correctChoice
                            ? 'border-green-500/40 bg-green-500/10 text-green-200'
                            : optionIndex === review?.userChoice
                              ? 'border-soc-red/40 bg-soc-red/10 text-red-200'
                              : 'border-soc-accent/10 bg-soc-darker/60 text-gray-300'
                        }`}
                      >
                        {String.fromCharCode(65 + optionIndex)}. {option}
                      </div>
                    ))}
                  </div>
                  {review?.explanation && (
                    <p className="mt-4 rounded-xl border border-soc-accent/10 bg-soc-darker/60 p-4 text-sm text-gray-300">
                      <span className="font-semibold text-soc-accent">Explanation:</span> {review.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.25em] text-soc-accent/70">Interactive Quiz</p>
              <h1 className="text-3xl font-black text-white">{quiz.title}</h1>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-soc-accent/15 bg-soc-dark/70 px-4 py-3 font-mono text-soc-accent">
              <FiClock />
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-soc-dark">
            <div
              className="h-full rounded-full bg-soc-accent transition-all"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-soc-red/30 bg-soc-red/10 p-4 text-soc-red">
            {error}
          </div>
        )}

        <div className="rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6 md:p-8">
          <p className="mb-3 text-sm text-soc-accent/70">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </p>
          <h2 className="mb-8 text-2xl font-bold leading-snug text-white">{question.question}</h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={option}
                onClick={() => chooseAnswer(index)}
                className={`w-full rounded-2xl border px-5 py-4 text-left transition ${
                  answers[currentQuestion] === index
                    ? 'border-soc-accent bg-soc-accent/15 text-white'
                    : 'border-soc-accent/15 bg-soc-dark/70 text-gray-300 hover:border-soc-accent/50'
                }`}
              >
                <span className="mr-3 font-mono text-soc-accent">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => setCurrentQuestion((value) => Math.max(0, value - 1))}
            disabled={currentQuestion === 0}
            className="rounded-lg border border-soc-accent/30 px-5 py-3 font-semibold text-soc-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <p className="text-sm text-gray-400">{answeredCount} / {quiz.questions.length} answered</p>

          {currentQuestion === quiz.questions.length - 1 ? (
            <button
              onClick={() => void submitQuiz()}
              disabled={submitting || answeredCount === 0}
              className="rounded-lg bg-soc-accent px-5 py-3 font-semibold text-soc-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion((value) => Math.min(quiz.questions.length - 1, value + 1))}
              className="rounded-lg bg-soc-accent px-5 py-3 font-semibold text-soc-dark"
            >
              Next
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
