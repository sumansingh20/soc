'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiAward, FiBookOpen, FiCheckCircle, FiClock, FiDownload, FiFileText } from 'react-icons/fi';
import { dashboardApi, progressApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { ProgressBar } from '@/components/ProgressBar';

type Dashboard = {
  stats: {
    coursesEnrolled: number;
    avgProgress: number;
    completedCourses: number;
    completedLabs: number;
    quizScoreAverage: number;
  };
  courses: any[];
  labs: any[];
  quizzes: any[];
  notes: any[];
  resources: any[];
  dailyTasks?: { daySlug: string; title: string; completed: boolean }[];
  notifications?: { title: string; message: string; type: string }[];
  recentActivity?: {
    latestQuizAttempt?: any;
    downloads?: { noteSlug: string; downloadedAt?: string }[];
    commands?: { commandName: string; practicedAt?: string }[];
  };
};

const fallbackDashboard: Dashboard = {
  stats: { coursesEnrolled: 7, avgProgress: 0, completedCourses: 0, completedLabs: 0, quizScoreAverage: 0 },
  courses: [],
  labs: [],
  quizzes: [],
  notes: [],
  resources: [],
  dailyTasks: [
    { daySlug: 'day-1', title: 'Read Day 1 notes and complete SOC basics quiz', completed: false },
    { daySlug: 'day-2', title: 'Practice auth.log and btmp investigation', completed: false },
  ],
  notifications: [{ title: 'Welcome', message: 'Start Day 1 and download the SOC basics notes.', type: 'info' }],
  recentActivity: { downloads: [], commands: [] },
};

export function StudentDashboard() {
  const { token } = useAuthStore();
  const [dashboard, setDashboard] = useState<Dashboard>(fallbackDashboard);
  const [loading, setLoading] = useState(true);
  const [taskMessage, setTaskMessage] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await dashboardApi.getData();
        setDashboard(response.data.dashboard);
      } catch {
        setDashboard(fallbackDashboard);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [token]);

  const courseRows = useMemo(() => {
    if (!dashboard.courses.length) {
      return [
        { title: 'SOC Basics', progress: dashboard.stats.avgProgress, status: dashboard.stats.avgProgress ? 'In Progress' : 'Not Started' },
        { title: 'Linux Log Analysis', progress: 0, status: 'Not Started' },
        { title: 'Command Practice', progress: 0, status: 'Not Started' },
      ];
    }

    return dashboard.courses.map((course, index) => ({
      title: course.title,
      progress: index === 0 ? dashboard.stats.avgProgress : 0,
      status: index === 0 && dashboard.stats.avgProgress > 0 ? 'In Progress' : 'Ready',
    }));
  }, [dashboard]);

  const completeTask = async (taskSlug: string) => {
    if (!token) {
      window.location.href = '/login';
      return;
    }

    await progressApi.complete({ type: 'lesson', slug: taskSlug });
    setTaskMessage('Task marked complete. Refreshing your dashboard data on next load.');
  };

  if (!token && !loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-8 text-center">
          <h1 className="mb-4 text-3xl font-black text-white">Login required</h1>
          <p className="mb-6 text-gray-300">Your student dashboard tracks personal progress, quiz scores, downloads, and labs.</p>
          <Link href="/login" className="rounded-lg bg-soc-accent px-5 py-3 font-semibold text-soc-dark">Login to continue</Link>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Lessons Completed', value: String(dashboard.stats.completedCourses), icon: FiBookOpen },
    { label: 'Quiz Average', value: `${dashboard.stats.quizScoreAverage}%`, icon: FiAward },
    { label: 'Labs Completed', value: String(dashboard.stats.completedLabs), icon: FiCheckCircle },
    { label: 'Overall Progress', value: `${dashboard.stats.avgProgress}%`, icon: FiClock },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-soc-accent">Student Dashboard</p>
          <h1 className="mb-4 text-4xl font-black text-white md:text-5xl">Track your SOC training progress</h1>
          <p className="max-w-3xl leading-relaxed text-gray-300">
            Your completed lessons, quiz scores, lab submissions, download history, tasks, and notifications are pulled from the backend.
          </p>
        </div>

        {loading && <p className="mb-6 text-sm text-soc-accent/70">Loading dashboard from backend...</p>}

        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6">
                <Icon className="mb-4 text-soc-accent" size={26} />
                <p className="mb-1 text-sm text-gray-400">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6 lg:col-span-2">
            <h2 className="mb-4 text-2xl font-bold text-white">Lesson progress</h2>
            <div className="space-y-4">
              {courseRows.map((course) => (
                <div key={course.title} className="rounded-2xl border border-soc-accent/10 bg-soc-dark/70 p-4">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">{course.title}</p>
                      <p className="text-sm text-soc-accent/60">{course.status}</p>
                    </div>
                    <p className="font-semibold text-soc-accent">{course.progress}%</p>
                  </div>
                  <ProgressBar progress={course.progress} showPercentage={false} animated={false} />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-white"><FiFileText className="text-soc-accent" /> Download history</h3>
              <div className="space-y-3">
                {(dashboard.recentActivity?.downloads || []).slice(0, 5).map((download) => (
                  <div key={`${download.noteSlug}-${download.downloadedAt}`} className="flex items-center justify-between gap-3 rounded-2xl border border-soc-accent/10 bg-soc-dark/70 px-4 py-3 text-sm text-gray-200">
                    <span>{download.noteSlug}</span>
                    <FiDownload className="text-soc-accent" />
                  </div>
                ))}
                {!dashboard.recentActivity?.downloads?.length && <p className="text-sm text-gray-400">No downloads yet.</p>}
              </div>
            </div>

            <div className="rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6">
              <h3 className="mb-4 font-semibold text-white">Daily practice tasks</h3>
              <div className="space-y-3">
                {(dashboard.dailyTasks || []).slice(0, 4).map((task) => (
                  <button
                    key={task.daySlug}
                    onClick={() => void completeTask(task.daySlug)}
                    className="w-full rounded-2xl border border-soc-accent/10 bg-soc-dark/70 p-4 text-left text-sm text-gray-300"
                  >
                    <span className="mr-2 text-soc-accent">{task.completed ? 'Done' : 'Task'}</span>
                    {task.title}
                  </button>
                ))}
              </div>
              {taskMessage && <p className="mt-4 text-sm text-green-300">{taskMessage}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6">
            <h2 className="mb-4 text-2xl font-bold text-white">Quiz activity</h2>
            {dashboard.recentActivity?.latestQuizAttempt ? (
              <div className="rounded-2xl border border-soc-accent/10 bg-soc-dark/70 p-4">
                <p className="font-semibold text-white">{dashboard.recentActivity.latestQuizAttempt.quizSlug}</p>
                <p className="text-soc-accent">{dashboard.recentActivity.latestQuizAttempt.score}%</p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No quiz attempts yet. Start with Day 1.</p>
            )}
          </div>

          <div className="rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6">
            <h2 className="mb-4 text-2xl font-bold text-white">Notifications</h2>
            <div className="space-y-3">
              {(dashboard.notifications || []).map((notice) => (
                <div key={notice.title} className="rounded-2xl border border-soc-accent/10 bg-soc-dark/70 p-4">
                  <p className="font-semibold text-white">{notice.title}</p>
                  <p className="text-sm text-gray-300">{notice.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
