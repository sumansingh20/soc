'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiBookOpen, FiCheckCircle, FiCode, FiDownload, FiFileText } from 'react-icons/fi';
import { contentApi, noteApi, progressApi } from '@/lib/api';
import { dayPlans } from '@/lib/soc-content';
import { useAuthStore } from '@/lib/store';

type DayPlan = {
  slug: string;
  day?: string;
  dayLabel: string;
  dayNumber: number;
  title: string;
  summary: string;
  courseSlug: string;
  notes: { heading: string; body: string }[];
  commands: string[];
  labs: string[];
  practiceTasks?: string[];
  quizSlug?: string;
  downloadSlug?: string;
};

const fallbackDays: DayPlan[] = dayPlans.map((day, index) => ({
  slug: `day-${index + 1}`,
  day: day.day,
  dayLabel: day.day,
  dayNumber: index + 1,
  title: day.title,
  summary: day.summary,
  courseSlug: [
    'soc-basics',
    'linux-log-analysis',
    'command-practice',
    'attack-detection',
    'siem-basics',
    'threat-hunting',
    'incident-response',
  ][index],
  notes: day.notes.map((note) => ({ heading: note, body: day.summary })),
  commands: day.commands,
  labs: day.labs,
  practiceTasks: [day.practice],
  quizSlug: `day-${index + 1}-quiz`,
  downloadSlug: `day-${index + 1}-notes`,
}));

export default function DayWisePage() {
  const { token } = useAuthStore();
  const [days, setDays] = useState<DayPlan[]>(fallbackDays);
  const [activeSlug, setActiveSlug] = useState(fallbackDays[0].slug);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const loadDays = async () => {
      try {
        const response = await contentApi.getDays();
        if (response.data.days?.length) {
          setDays(response.data.days);
          setActiveSlug(response.data.days[0].slug);
        }
      } catch {
        setDays(fallbackDays);
      }
    };

    loadDays();
  }, []);

  const day = useMemo(() => days.find((item) => item.slug === activeSlug) || days[0], [activeSlug, days]);

  const downloadPdf = async () => {
    if (!day?.downloadSlug) return;
    if (!token) {
      window.location.href = '/login';
      return;
    }

    setDownloading(true);
    try {
      await progressApi.trackDownload(day.downloadSlug);
      const response = await noteApi.downloadPdf(day.downloadSlug);
      const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${day.downloadSlug}.pdf`;
      link.click();
      window.URL.revokeObjectURL(blobUrl);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-soc-accent">Day Wise Learning</p>
          <h1 className="mb-4 text-4xl font-black text-white md:text-5xl">Seven-day HackShield SOC practice plan</h1>
          <p className="max-w-3xl leading-relaxed text-gray-300">
            Every day includes notes, commands, examples, labs, practice tasks, PDF downloads, and a connected quiz.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {days.map((item) => (
            <button
              key={item.slug}
              onClick={() => setActiveSlug(item.slug)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                activeSlug === item.slug
                  ? 'border-soc-accent bg-soc-accent text-soc-dark'
                  : 'border-soc-accent/20 bg-soc-darker/70 text-soc-accent/70 hover:border-soc-accent/40'
              }`}
            >
              {item.dayLabel || item.day}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6 lg:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <FiBookOpen className="text-soc-accent" size={22} />
              <div>
                <p className="text-sm text-soc-accent/70">{day.dayLabel || day.day}</p>
                <h2 className="text-2xl font-bold text-white">{day.title}</h2>
              </div>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className="mb-3 font-semibold text-white">Full notes</h3>
                <div className="space-y-3">
                  {day.notes.map((note) => (
                    <details key={note.heading} className="rounded-2xl border border-soc-accent/10 bg-soc-dark/70 p-4">
                      <summary className="cursor-pointer font-semibold text-soc-accent">{note.heading}</summary>
                      <p className="mt-3 text-sm leading-relaxed text-gray-300">{note.body}</p>
                    </details>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="mb-3 font-semibold text-white">Commands</h3>
                <div className="space-y-2 font-mono text-sm">
                  {day.commands.map((command) => (
                    <div key={command} className="rounded-2xl border border-soc-accent/10 bg-soc-dark/90 p-4 text-green-300">
                      $ {command}
                    </div>
                  ))}
                </div>
              </section>

              <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-soc-accent/10 bg-soc-dark/70 p-4">
                  <h3 className="mb-2 font-semibold text-white">Practice tasks</h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    {(day.practiceTasks || []).map((task) => (
                      <p key={task} className="flex gap-2"><FiCheckCircle className="mt-0.5 text-soc-accent" /> {task}</p>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-soc-accent/10 bg-soc-dark/70 p-4">
                  <h3 className="mb-2 font-semibold text-white">Labs</h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    {day.labs.map((lab) => (
                      <p key={lab} className="flex gap-2"><FiCode className="mt-0.5 text-soc-accent" /> {lab}</p>
                    ))}
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-soc-accent/15 bg-soc-accent/10 p-5">
                <h3 className="mb-2 font-semibold text-white">Summary</h3>
                <p className="leading-relaxed text-gray-200">{day.summary}</p>
              </section>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6">
              <div className="mb-4 flex items-center gap-2 text-soc-accent">
                <FiFileText />
                <h3 className="font-semibold text-white">Actions</h3>
              </div>
              <div className="space-y-3">
                <button
                  onClick={downloadPdf}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-soc-accent/25 bg-soc-accent/10 px-4 py-4 font-semibold text-soc-accent hover:border-soc-accent"
                >
                  <FiDownload />
                  {downloading ? 'Preparing PDF...' : 'Download PDF'}
                </button>
                <Link href={`/quiz/${day.courseSlug}`} className="block rounded-2xl bg-soc-accent px-4 py-4 text-center font-semibold text-soc-dark">
                  Start quiz
                </Link>
                <Link href="/labs" className="block rounded-2xl border border-soc-accent/25 px-4 py-4 text-center font-semibold text-soc-accent">
                  Open related labs
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6">
              <h3 className="mb-3 font-semibold text-white">Investigation mindset</h3>
              <p className="text-sm leading-relaxed text-gray-300">
                Move one clue at a time: find evidence, compare the timeline, decide what it means, and explain it in simple language.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
