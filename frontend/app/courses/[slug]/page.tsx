'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiBookOpen, FiClock, FiLoader, FiShield } from 'react-icons/fi';
import { courseApi, progressApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

type Course = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  durationHours: number;
  objectives: string[];
  lessonSlugs: string[];
};

type Lesson = {
  slug: string;
  dayLabel: string;
  title: string;
  summary: string;
};

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const { token } = useAuthStore();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const response = await courseApi.getById(params.slug);
        setCourse(response.data.course);
        setLessons(response.data.lessons || []);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [params.slug]);

  const startCourse = async () => {
    if (!course) return;
    if (!token) {
      window.location.href = '/login';
      return;
    }

    await progressApi.update({ courseSlug: course.slug, progressPercentage: 1 });
    setMessage('Course added to your progress. Start with the day-wise lesson.');
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

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-8 text-center">
          <h1 className="mb-4 text-3xl font-black text-white">Course not found</h1>
          <Link href="/courses" className="text-soc-accent">Back to courses</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-6xl">
        <Link href="/courses" className="mb-6 inline-block text-soc-accent/70 hover:text-soc-accent">Back to courses</Link>

        <div className="mb-8 rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-8">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-soc-accent/70">HackShield Course</p>
          <h1 className="mb-4 text-4xl font-black text-white md:text-5xl">{course.title}</h1>
          <p className="max-w-3xl leading-relaxed text-gray-300">{course.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full border border-soc-accent/25 bg-soc-accent/10 px-4 py-2 text-sm capitalize text-soc-accent">{course.difficulty}</span>
            <span className="rounded-full border border-soc-accent/25 bg-soc-accent/10 px-4 py-2 text-sm text-soc-accent">{course.category}</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-soc-accent/25 bg-soc-accent/10 px-4 py-2 text-sm text-soc-accent">
              <FiClock /> {course.durationHours || 4} hours
            </span>
          </div>
        </div>

        {message && <div className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-green-100">{message}</div>}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6 lg:col-span-2">
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-white"><FiBookOpen className="text-soc-accent" /> Lessons</h2>
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div key={lesson.slug} className="rounded-2xl border border-soc-accent/10 bg-soc-dark/70 p-5">
                  <p className="mb-1 text-sm text-soc-accent">{lesson.dayLabel}</p>
                  <h3 className="mb-2 font-semibold text-white">{lesson.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-300">{lesson.summary}</p>
                </div>
              ))}
              {!lessons.length && <p className="text-gray-400">Open day-wise learning to start this course.</p>}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6">
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-white"><FiShield className="text-soc-accent" /> Outcomes</h2>
              <div className="space-y-3">
                {(course.objectives || []).map((objective) => (
                  <div key={objective} className="flex gap-2 rounded-2xl border border-soc-accent/10 bg-soc-dark/70 p-4 text-sm text-gray-300">
                    <FiArrowRight className="mt-0.5 text-soc-accent" /> {objective}
                  </div>
                ))}
              </div>
            </div>

            <button onClick={startCourse} className="w-full rounded-lg bg-soc-accent px-5 py-3 font-semibold text-soc-dark">
              Start course
            </button>
            <Link href={`/quiz/${course.slug}`} className="block rounded-lg border border-soc-accent/30 px-5 py-3 text-center font-semibold text-soc-accent">
              Take quiz
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
