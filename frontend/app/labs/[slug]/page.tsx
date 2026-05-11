'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiLoader,
  FiSend,
  FiTerminal,
  FiTarget,
} from 'react-icons/fi';
import { labApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

type Lab = {
  id: string;
  slug: string;
  title: string;
  description: string;
  scenario: string;
  objective: string;
  difficulty: string;
  category: string;
  tags: string[];
  estimatedMinutes: number;
  estimatedTimeMinutes: number;
  logs: string[];
  sampleLogs?: { source: string; line: string; clue: string }[];
  commands: string[];
  workflow: string[];
  expectedFindings: string[];
  solution: string;
};

export default function LabDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [lab, setLab] = useState<Lab | null>(null);
  const [activeTab, setActiveTab] = useState<'scenario' | 'evidence' | 'workflow' | 'submit'>('scenario');
  const [findings, setFindings] = useState('');
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState<{ score: number; feedback: string } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadLab = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await labApi.getBySlug(params.slug);
        setLab(response.data.lab);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Unable to load lab');
      } finally {
        setLoading(false);
      }
    };

    loadLab();
  }, [params.slug]);

  const submitLab = async (event: FormEvent) => {
    event.preventDefault();
    if (!lab) return;
    if (!user) {
      router.push('/login');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const response = await labApi.submit(lab.id || lab.slug, { findings, report });
      setSubmission(response.data.submission);
      setActiveTab('workflow');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to submit lab');
    } finally {
      setSubmitting(false);
    }
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

  if (!lab) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-soc-red/30 bg-soc-red/10 p-8 text-center">
          <FiAlertCircle className="mx-auto mb-4 text-soc-red" size={42} />
          <h1 className="mb-3 text-2xl font-bold text-white">Lab unavailable</h1>
          <p className="mb-6 text-gray-300">{error || 'The lab could not be found.'}</p>
          <Link className="text-soc-accent" href="/labs">Back to labs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-6xl">
        <Link href="/labs" className="mb-6 inline-block text-soc-accent/70 hover:text-soc-accent">
          Back to labs
        </Link>

        <div className="mb-8 rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-soc-accent/70">Practical SOC Lab</p>
              <h1 className="mb-4 text-4xl font-black text-white">{lab.title}</h1>
              <p className="max-w-3xl text-gray-300">{lab.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm md:min-w-80">
              <div className="rounded-2xl border border-soc-accent/15 bg-soc-dark/70 p-4">
                <FiClock className="mb-2 text-soc-accent" />
                <p className="text-gray-400">Time</p>
                <p className="font-semibold text-white">{lab.estimatedTimeMinutes || lab.estimatedMinutes} min</p>
              </div>
              <div className="rounded-2xl border border-soc-accent/15 bg-soc-dark/70 p-4">
                <FiTarget className="mb-2 text-soc-accent" />
                <p className="text-gray-400">Level</p>
                <p className="font-semibold capitalize text-white">{lab.difficulty}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {lab.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-soc-accent/25 bg-soc-accent/10 px-3 py-1 text-xs text-soc-accent">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          {[
            ['scenario', 'Scenario'],
            ['evidence', 'Logs and Commands'],
            ['workflow', 'Investigation Workflow'],
            ['submit', 'Submit Findings'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                activeTab === id
                  ? 'border-soc-accent bg-soc-accent text-soc-dark'
                  : 'border-soc-accent/20 bg-soc-darker/70 text-soc-accent/70 hover:border-soc-accent/40'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {submission && (
          <div className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-5 text-green-100">
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <FiCheckCircle /> Lab submitted. Score: {submission.score}%
            </div>
            <p className="text-sm text-green-100/80">{submission.feedback}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-soc-red/30 bg-soc-red/10 p-4 text-soc-red">
            {error}
          </div>
        )}

        {activeTab === 'scenario' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6">
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-white">
                <FiTarget className="text-soc-accent" /> Scenario
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-gray-300">{lab.scenario}</p>
              <h3 className="mb-3 font-semibold text-white">Objective</h3>
              <p className="rounded-2xl border border-soc-accent/10 bg-soc-dark/70 p-4 text-gray-300">{lab.objective}</p>
            </div>

            <div className="rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6">
              <h3 className="mb-4 font-semibold text-white">Available log sources</h3>
              <div className="space-y-3">
                {lab.logs.map((log) => (
                  <div key={log} className="rounded-xl border border-soc-accent/10 bg-soc-dark/70 px-4 py-3 text-sm text-gray-300">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6">
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-white">
                <FiFileText className="text-soc-accent" /> Sample log evidence
              </h2>
              <div className="space-y-4">
                {(lab.sampleLogs || []).map((entry) => (
                  <div key={entry.line} className="rounded-2xl border border-soc-accent/10 bg-soc-dark/80 p-4">
                    <p className="mb-2 text-xs uppercase tracking-[0.18em] text-soc-accent/70">{entry.source}</p>
                    <pre className="whitespace-pre-wrap border-0 bg-transparent p-0 text-xs text-green-300">{entry.line}</pre>
                    <p className="mt-3 text-sm text-gray-300">{entry.clue}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6">
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-white">
                <FiTerminal className="text-soc-accent" /> Commands
              </h2>
              <div className="space-y-3">
                {lab.commands.map((command) => (
                  <div key={command} className="rounded-2xl border border-soc-accent/10 bg-soc-dark/90 p-4 font-mono text-sm text-green-300">
                    $ {command}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'workflow' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6">
              <h2 className="mb-4 text-2xl font-bold text-white">Investigation workflow</h2>
              <div className="space-y-3">
                {lab.workflow.map((step, index) => (
                  <div key={step} className="flex gap-3 rounded-2xl border border-soc-accent/10 bg-soc-dark/70 p-4 text-gray-300">
                    <span className="font-mono text-soc-accent">{index + 1}</span>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6">
              <h2 className="mb-4 text-2xl font-bold text-white">Expected findings and solution</h2>
              <div className="mb-5 space-y-3">
                {lab.expectedFindings.map((finding) => (
                  <div key={finding} className="rounded-2xl border border-soc-accent/10 bg-soc-dark/70 p-4 text-gray-300">
                    {finding}
                  </div>
                ))}
              </div>
              <p className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-green-100">{lab.solution}</p>
            </div>
          </div>
        )}

        {activeTab === 'submit' && (
          <form onSubmit={submitLab} className="rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6">
            <h2 className="mb-4 text-2xl font-bold text-white">Submit your findings</h2>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-soc-accent">Key findings</label>
                <textarea
                  value={findings}
                  onChange={(event) => setFindings(event.target.value)}
                  required
                  minLength={40}
                  className="h-56 w-full rounded-2xl border border-soc-accent/20 bg-soc-dark/80 p-4 text-white outline-none focus:border-soc-accent"
                  placeholder="List the strongest evidence, source IPs, users, timestamps, process names, and why they matter."
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-soc-accent">Analyst report</label>
                <textarea
                  value={report}
                  onChange={(event) => setReport(event.target.value)}
                  required
                  minLength={40}
                  className="h-56 w-full rounded-2xl border border-soc-accent/20 bg-soc-dark/80 p-4 text-white outline-none focus:border-soc-accent"
                  placeholder="Write a short SOC-style report: what happened, impact, confidence, and recommended next action."
                />
              </div>
            </div>

            <button
              disabled={submitting}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-soc-accent px-5 py-3 font-semibold text-soc-dark disabled:opacity-50"
            >
              <FiSend /> {submitting ? 'Submitting...' : 'Submit lab'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
