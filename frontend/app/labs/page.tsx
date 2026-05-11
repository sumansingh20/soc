'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiClock, FiSearch, FiTarget, FiTerminal } from 'react-icons/fi';
import { labApi } from '@/lib/api';
import { labs as fallbackLabs } from '@/lib/soc-content';

type LabCard = {
  id?: string;
  slug?: string;
  title: string;
  description?: string;
  objective: string;
  scenario: string;
  difficulty?: string;
  category?: string;
  tags?: string[];
  estimatedMinutes?: number;
  estimatedTimeMinutes?: number;
  commands: string[];
};

const normalizeFallbackLabs = fallbackLabs.map((lab, index) => ({
  id: `fallback-${index}`,
  slug: lab.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  title: lab.title,
  description: lab.objective,
  objective: lab.objective,
  scenario: lab.scenario,
  difficulty: 'beginner',
  category: 'SOC Lab',
  tags: lab.logs,
  estimatedMinutes: 35,
  estimatedTimeMinutes: 35,
  commands: lab.commands,
}));

export default function LabsPage() {
  const [labs, setLabs] = useState<LabCard[]>(normalizeFallbackLabs);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLabs = async () => {
      try {
        const response = await labApi.getAll();
        if (response.data.labs?.length) {
          setLabs(response.data.labs);
        }
      } catch {
        setLabs(normalizeFallbackLabs);
      } finally {
        setLoading(false);
      }
    };

    loadLabs();
  }, []);

  const filteredLabs = useMemo(() => {
    const query = search.toLowerCase();
    return labs.filter((lab) => `${lab.title} ${lab.objective} ${lab.scenario} ${lab.tags?.join(' ')}`.toLowerCase().includes(query));
  }, [labs, search]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-soc-accent">Labs</p>
          <h1 className="mb-4 text-4xl font-black text-white md:text-5xl">Practical SOC investigation labs</h1>
          <p className="max-w-3xl leading-relaxed text-gray-300">
            Work through real analyst cases: SSH brute force, failed logins, suspicious access, Apache attacks, malware process review, and incident response.
          </p>
        </div>

        <div className="relative mb-8 max-w-2xl">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-soc-accent/50" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search labs by objective, log, command, or scenario"
            className="w-full rounded-2xl border border-soc-accent/20 bg-soc-darker/70 py-4 pl-12 pr-4 text-white outline-none placeholder:text-soc-accent/40 focus:border-soc-accent/50"
          />
        </div>

        {loading && <p className="mb-6 text-sm text-soc-accent/70">Loading labs from backend...</p>}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredLabs.map((lab) => (
            <motion.div key={lab.slug || lab.title} whileHover={{ y: -4 }} className="rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs uppercase tracking-[0.2em] text-soc-accent/60">{lab.category || 'SOC Lab'}</p>
                  <h2 className="text-xl font-bold text-white">{lab.title}</h2>
                </div>
                <span className="rounded-full border border-soc-accent/30 bg-soc-accent/15 px-3 py-1 text-xs capitalize text-soc-accent">
                  {lab.difficulty || 'beginner'}
                </span>
              </div>

              <p className="mb-4 text-sm leading-relaxed text-gray-300">{lab.objective}</p>

              <div className="mb-4 rounded-2xl border border-soc-accent/10 bg-soc-dark/70 p-4 text-sm text-gray-300">
                <p className="mb-2 text-soc-accent/70">Scenario</p>
                {lab.scenario}
              </div>

              <div className="mb-5 space-y-2 font-mono text-xs text-green-300">
                {lab.commands.slice(0, 2).map((command) => (
                  <div key={command} className="rounded-xl border border-soc-accent/10 bg-soc-dark/90 p-3">
                    $ {command}
                  </div>
                ))}
              </div>

              <div className="mb-5 flex flex-wrap gap-2">
                {(lab.tags || []).slice(0, 4).map((tag) => (
                  <span key={tag} className="rounded-full bg-soc-accent/10 px-3 py-1 text-xs text-soc-accent/80">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-soc-accent/70">
                  <FiClock /> {lab.estimatedTimeMinutes || lab.estimatedMinutes || 35} min
                </div>
                <Link href={`/labs/${lab.slug}`} className="inline-flex items-center gap-2 rounded-lg bg-soc-accent px-4 py-2 text-sm font-semibold text-soc-dark">
                  <FiTerminal /> Start lab
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-white">
            <FiTarget className="text-soc-accent" /> Lab workflow
          </h2>
          <div className="grid grid-cols-1 gap-4 text-sm text-gray-300 md:grid-cols-3">
            <div className="rounded-2xl border border-soc-accent/10 bg-soc-dark/70 p-4">Read the scenario and identify the question.</div>
            <div className="rounded-2xl border border-soc-accent/10 bg-soc-dark/70 p-4">Use the provided commands to inspect the evidence.</div>
            <div className="rounded-2xl border border-soc-accent/10 bg-soc-dark/70 p-4">Submit a short analyst report with findings and next action.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
