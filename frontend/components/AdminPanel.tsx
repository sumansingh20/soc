'use client';

import { FormEvent, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiClipboard, FiDatabase, FiList, FiPlus, FiRefreshCcw, FiTool, FiUpload, FiUser } from 'react-icons/fi';
import { adminApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

const tabs = [
  { id: 'overview', label: 'Overview', icon: FiDatabase },
  { id: 'notes', label: 'Upload Notes', icon: FiUpload },
  { id: 'labs', label: 'Manage Labs', icon: FiClipboard },
  { id: 'commands', label: 'Commands', icon: FiTool },
  { id: 'quizzes', label: 'Quizzes', icon: FiList },
  { id: 'users', label: 'Students', icon: FiUser },
];

const defaultNote = {
  slug: '',
  title: '',
  courseSlug: 'soc-basics',
  summary: '',
  pdfTitle: '',
  tags: 'SOC,HackShield',
  sections: 'Overview|Write your note section here',
  published: true,
};

const defaultLab = {
  slug: '',
  title: '',
  description: '',
  scenario: '',
  objective: '',
  difficulty: 'beginner',
  category: 'SOC Investigation',
  tags: 'auth.log,ssh',
  estimatedMinutes: 30,
  estimatedTimeMinutes: 30,
  logs: 'auth.log,btmp',
  commands: 'grep -i "failed" auth.log,lastb',
  workflow: 'Read scenario,Filter logs,Write finding',
  expectedFindings: 'Repeated failed logins,Suspicious source IP',
  solution: '',
  published: true,
};

const defaultCommand = {
  slug: '',
  name: '',
  syntax: '',
  description: '',
  example: '',
  investigationUseCase: '',
  practiceExercises: 'Find evidence,Write a finding',
  output: '',
  published: true,
};

const defaultQuiz = {
  slug: '',
  courseSlug: 'soc-basics',
  title: '',
  passingScore: 70,
  timeLimitMinutes: 20,
  questions: 'What does auth.log show?|Successful web requests;Authentication events;Disk usage|1|auth.log records authentication events.',
  published: true,
};

const splitList = (value: string) => value.split(',').map((item) => item.trim()).filter(Boolean);

const parseSections = (value: string) =>
  value
    .split('\n')
    .map((line) => {
      const [heading, body] = line.split('|');
      return { heading: heading?.trim(), body: body?.trim() };
    })
    .filter((section) => section.heading && section.body);

const parseQuestions = (value: string) =>
  value
    .split('\n')
    .map((line, index) => {
      const [question, options, answerIndex, explanation] = line.split('|');
      return {
        id: index + 1,
        question: question?.trim(),
        options: (options || '').split(';').map((option) => option.trim()).filter(Boolean),
        answerIndex: Number(answerIndex || 0),
        explanation: explanation?.trim() || '',
      };
    })
    .filter((question) => question.question && question.options.length);

export function AdminPanel() {
  const { user, token } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [noteForm, setNoteForm] = useState(defaultNote);
  const [labForm, setLabForm] = useState(defaultLab);
  const [commandForm, setCommandForm] = useState(defaultCommand);
  const [quizForm, setQuizForm] = useState(defaultQuiz);
  const [message, setMessage] = useState('');

  const isAdmin = user?.role === 'admin' || user?.role === 'instructor';

  useEffect(() => {
    const loadAdminData = async () => {
      if (!token || !isAdmin) return;
      try {
        const [analyticsResponse, usersResponse] = await Promise.all([
          adminApi.getAnalytics(),
          adminApi.getUsers(),
        ]);
        setAnalytics(analyticsResponse.data.analytics);
        setUsers(usersResponse.data.users || []);
      } catch {
        setMessage('Unable to load admin data. Confirm your account has admin permissions.');
      }
    };

    loadAdminData();
  }, [token, isAdmin]);

  useEffect(() => {
    const loadItems = async () => {
      if (!token || !isAdmin) return;
      const type = activeTab === 'notes' || activeTab === 'labs' || activeTab === 'commands' || activeTab === 'quizzes' ? activeTab : '';
      if (!type) return;

      try {
        const response = await adminApi.getContent(type);
        setItems(response.data.items || []);
      } catch {
        setItems([]);
      }
    };

    loadItems();
  }, [activeTab, token, isAdmin]);

  if (!token || !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-8 text-center">
          <h1 className="mb-4 text-3xl font-black text-white">Admin access required</h1>
          <p className="mb-6 text-gray-300">Login with an admin or instructor account to manage HackShield SOC content.</p>
          <Link href="/login" className="rounded-lg bg-soc-accent px-5 py-3 font-semibold text-soc-dark">Login</Link>
        </div>
      </div>
    );
  }

  const seedContent = async () => {
    setMessage('');
    await adminApi.seedFallback();
    setMessage('HackShield SOC baseline content seeded into MongoDB.');
  };

  const submitContent = async (event: FormEvent, type: string) => {
    event.preventDefault();
    setMessage('');

    const payload =
      type === 'notes'
        ? { ...noteForm, tags: splitList(noteForm.tags), sections: parseSections(noteForm.sections), pdfTitle: noteForm.pdfTitle || noteForm.title }
        : type === 'labs'
          ? {
              ...labForm,
              tags: splitList(labForm.tags),
              logs: splitList(labForm.logs),
              commands: splitList(labForm.commands),
              workflow: splitList(labForm.workflow),
              expectedFindings: splitList(labForm.expectedFindings),
              estimatedMinutes: Number(labForm.estimatedMinutes),
              estimatedTimeMinutes: Number(labForm.estimatedTimeMinutes),
            }
          : type === 'commands'
            ? { ...commandForm, practiceExercises: splitList(commandForm.practiceExercises) }
            : { ...quizForm, passingScore: Number(quizForm.passingScore), timeLimitMinutes: Number(quizForm.timeLimitMinutes), questions: parseQuestions(quizForm.questions) };

    await adminApi.createContent(type, payload);
    const response = await adminApi.getContent(type);
    setItems(response.data.items || []);
    setMessage(`${type.slice(0, -1)} saved successfully.`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-soc-accent">Admin Panel</p>
          <h1 className="mb-4 text-4xl font-black text-white md:text-5xl">Manage the HackShield SOC portal</h1>
          <p className="max-w-3xl leading-relaxed text-gray-300">
            Upload notes, add labs, create quizzes, manage command tutorials, review students, and seed the full training roadmap.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? 'border-soc-accent bg-soc-accent text-soc-dark'
                    : 'border-soc-accent/20 bg-soc-darker/70 text-soc-accent/70 hover:border-soc-accent/40'
                }`}
              >
                <Icon /> {tab.label}
              </button>
            );
          })}
        </div>

        {message && <div className="mb-6 rounded-2xl border border-soc-accent/20 bg-soc-accent/10 p-4 text-soc-accent">{message}</div>}

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6 lg:col-span-2">
              <h2 className="mb-4 text-2xl font-bold text-white">Platform analytics</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  ['Users', analytics?.totalUsers ?? 0],
                  ['Courses', analytics?.totalCourses ?? 0],
                  ['Labs', analytics?.totalLabs ?? 0],
                  ['Quizzes', analytics?.totalQuizzes ?? 0],
                  ['Notes', analytics?.totalNotes ?? 0],
                  ['Resources', analytics?.totalResources ?? 0],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-soc-accent/10 bg-soc-dark/70 p-4">
                    <p className="text-sm text-gray-400">{label}</p>
                    <p className="text-3xl font-bold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6">
              <h2 className="mb-4 text-2xl font-bold text-white">Seed baseline content</h2>
              <p className="mb-5 text-sm leading-relaxed text-gray-300">
                Load the complete seven-day HackShield SOC curriculum into MongoDB.
              </p>
              <button onClick={seedContent} className="inline-flex items-center gap-2 rounded-lg bg-soc-accent px-5 py-3 font-semibold text-soc-dark">
                <FiRefreshCcw /> Seed content
              </button>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <ContentForm title="Upload note / PDF source" onSubmit={(event) => submitContent(event, 'notes')}>
            <TextInput label="Slug" value={noteForm.slug} onChange={(value) => setNoteForm({ ...noteForm, slug: value })} />
            <TextInput label="Title" value={noteForm.title} onChange={(value) => setNoteForm({ ...noteForm, title: value })} />
            <TextInput label="Course slug" value={noteForm.courseSlug} onChange={(value) => setNoteForm({ ...noteForm, courseSlug: value })} />
            <TextInput label="PDF title" value={noteForm.pdfTitle} onChange={(value) => setNoteForm({ ...noteForm, pdfTitle: value })} />
            <TextArea label="Summary" value={noteForm.summary} onChange={(value) => setNoteForm({ ...noteForm, summary: value })} />
            <TextArea label="Sections, one per line: Heading|Body" value={noteForm.sections} onChange={(value) => setNoteForm({ ...noteForm, sections: value })} />
            <TextInput label="Tags comma-separated" value={noteForm.tags} onChange={(value) => setNoteForm({ ...noteForm, tags: value })} />
          </ContentForm>
        )}

        {activeTab === 'labs' && (
          <ContentForm title="Add practical lab" onSubmit={(event) => submitContent(event, 'labs')}>
            {(['slug', 'title', 'description', 'scenario', 'objective', 'category', 'solution'] as const).map((field) => (
              field === 'scenario' || field === 'description' || field === 'objective' || field === 'solution'
                ? <TextArea key={field} label={field} value={String(labForm[field])} onChange={(value) => setLabForm({ ...labForm, [field]: value })} />
                : <TextInput key={field} label={field} value={String(labForm[field])} onChange={(value) => setLabForm({ ...labForm, [field]: value })} />
            ))}
            <TextInput label="Tags" value={labForm.tags} onChange={(value) => setLabForm({ ...labForm, tags: value })} />
            <TextInput label="Logs" value={labForm.logs} onChange={(value) => setLabForm({ ...labForm, logs: value })} />
            <TextInput label="Commands" value={labForm.commands} onChange={(value) => setLabForm({ ...labForm, commands: value })} />
            <TextInput label="Workflow" value={labForm.workflow} onChange={(value) => setLabForm({ ...labForm, workflow: value })} />
            <TextInput label="Expected findings" value={labForm.expectedFindings} onChange={(value) => setLabForm({ ...labForm, expectedFindings: value })} />
          </ContentForm>
        )}

        {activeTab === 'commands' && (
          <ContentForm title="Add command tutorial" onSubmit={(event) => submitContent(event, 'commands')}>
            {(['slug', 'name', 'syntax', 'description', 'example', 'investigationUseCase', 'practiceExercises', 'output'] as const).map((field) => (
              field === 'description' || field === 'investigationUseCase'
                ? <TextArea key={field} label={field} value={commandForm[field]} onChange={(value) => setCommandForm({ ...commandForm, [field]: value })} />
                : <TextInput key={field} label={field} value={commandForm[field]} onChange={(value) => setCommandForm({ ...commandForm, [field]: value })} />
            ))}
          </ContentForm>
        )}

        {activeTab === 'quizzes' && (
          <ContentForm title="Add quiz" onSubmit={(event) => submitContent(event, 'quizzes')}>
            <TextInput label="Slug" value={quizForm.slug} onChange={(value) => setQuizForm({ ...quizForm, slug: value })} />
            <TextInput label="Course slug" value={quizForm.courseSlug} onChange={(value) => setQuizForm({ ...quizForm, courseSlug: value })} />
            <TextInput label="Title" value={quizForm.title} onChange={(value) => setQuizForm({ ...quizForm, title: value })} />
            <TextInput label="Passing score" value={String(quizForm.passingScore)} onChange={(value) => setQuizForm({ ...quizForm, passingScore: Number(value) })} />
            <TextInput label="Time limit minutes" value={String(quizForm.timeLimitMinutes)} onChange={(value) => setQuizForm({ ...quizForm, timeLimitMinutes: Number(value) })} />
            <TextArea label="Questions, one per line: Question|A;B;C|correctIndex|Explanation" value={quizForm.questions} onChange={(value) => setQuizForm({ ...quizForm, questions: value })} />
          </ContentForm>
        )}

        {activeTab === 'users' && (
          <div className="rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6">
            <h2 className="mb-4 text-2xl font-bold text-white">Students and staff</h2>
            <div className="space-y-3">
              {users.map((student) => (
                <div key={student.id} className="flex flex-col gap-3 rounded-2xl border border-soc-accent/10 bg-soc-dark/70 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-white">{student.fullName}</p>
                    <p className="text-sm text-gray-400">{student.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm capitalize text-soc-accent">{student.role} / {student.status}</span>
                    {student.status !== 'suspended' && (
                      <button onClick={() => adminApi.suspendUser(student.id)} className="rounded-lg border border-soc-red/40 px-3 py-2 text-sm text-soc-red">
                        Suspend
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'notes' || activeTab === 'labs' || activeTab === 'commands' || activeTab === 'quizzes') && (
          <div className="mt-8 rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6">
            <h2 className="mb-4 text-2xl font-bold text-white">Existing {activeTab}</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {items.slice(0, 8).map((item) => (
                <div key={item._id || item.slug} className="rounded-2xl border border-soc-accent/10 bg-soc-dark/70 p-4">
                  <p className="font-semibold text-white">{item.title || item.name || item.slug}</p>
                  <p className="text-sm text-soc-accent/60">{item.slug}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function ContentForm({ title, onSubmit, children }: { title: string; onSubmit: (event: FormEvent) => void; children: ReactNode }) {
  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6">
      <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold text-white"><FiPlus className="text-soc-accent" /> {title}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
      <button className="mt-6 rounded-lg bg-soc-accent px-5 py-3 font-semibold text-soc-dark">Save content</button>
    </form>
  );
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold capitalize text-soc-accent">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-soc-accent/15 bg-soc-dark/80 px-4 py-3 text-white outline-none focus:border-soc-accent" required />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block md:col-span-2">
      <span className="mb-2 block text-sm font-semibold capitalize text-soc-accent">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} className="min-h-32 w-full rounded-2xl border border-soc-accent/15 bg-soc-dark/80 px-4 py-3 text-white outline-none focus:border-soc-accent" required />
    </label>
  );
}
