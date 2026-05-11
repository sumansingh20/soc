'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiBookOpen, FiClock, FiFileText, FiSearch, FiTerminal } from 'react-icons/fi';
import { contentApi } from '@/lib/api';
import { commandLessons, dayPlans, investigations, labs } from '@/lib/soc-content';

type SearchResult = {
  type: string;
  title: string;
  slug: string;
  description: string;
  url: string;
};

const localResults: SearchResult[] = [
  ...dayPlans.map((day, index) => ({ type: 'lesson', title: day.title, slug: `day-${index + 1}`, description: day.summary, url: '/day-wise' })),
  ...commandLessons.map((command) => ({ type: 'command', title: command.name, slug: command.name, description: command.usage, url: '/commands' })),
  ...investigations.map((investigation) => ({ type: 'investigation', title: investigation.title, slug: investigation.title, description: investigation.summary, url: '/investigation' })),
  ...labs.map((lab) => ({ type: 'lab', title: lab.title, slug: lab.title, description: lab.objective, url: '/labs' })),
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [remoteResults, setRemoteResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setRemoteResults([]);
      return;
    }

    const timeout = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await contentApi.search(query);
        setRemoteResults(response.data.results || []);
      } catch {
        setRemoteResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [query]);

  const results = useMemo(() => {
    const source = remoteResults.length ? remoteResults : localResults;
    const text = query.toLowerCase();
    return source.filter((result) => {
      const matchesQuery = !text || `${result.title} ${result.description} ${result.type}`.toLowerCase().includes(text);
      const matchesFilter = filterBy === 'all' || result.type === filterBy;
      return matchesQuery && matchesFilter;
    });
  }, [filterBy, query, remoteResults]);

  const filters = ['all', ...Array.from(new Set([...remoteResults, ...localResults].map((result) => result.type))).slice(0, 8)];

  const iconForType = (type: string) => {
    if (type === 'command') return <FiTerminal className="text-green-400" size={24} />;
    if (type === 'lab') return <FiSearch className="text-cyan-400" size={24} />;
    if (type === 'note' || type === 'resource') return <FiFileText className="text-yellow-400" size={24} />;
    return <FiBookOpen className="text-soc-accent" size={24} />;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-soc-accent">Search</p>
          <h1 className="mb-4 text-4xl font-black text-white md:text-5xl">Search HackShield SOC training</h1>
          <p className="mx-auto max-w-2xl text-gray-300">Find lessons, commands, labs, notes, resources, and investigation workflows.</p>
        </div>

        <div className="relative mb-6">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-soc-accent/50" size={24} />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search auth.log, brute force, journalctl, SIEM, incident response..."
            className="w-full rounded-2xl border border-soc-accent/30 bg-soc-darker/60 py-4 pl-14 pr-4 text-lg text-white outline-none placeholder:text-soc-accent/40 focus:border-soc-accent"
            autoFocus
          />
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterBy(filter)}
              className={`rounded-full border px-5 py-2 text-sm font-semibold capitalize transition ${
                filterBy === filter
                  ? 'border-soc-accent bg-soc-accent text-soc-dark'
                  : 'border-soc-accent/20 bg-soc-darker/70 text-soc-accent/70 hover:border-soc-accent/40'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mb-6 flex items-center justify-between text-sm text-soc-accent/70">
          <span>{results.length} result{results.length === 1 ? '' : 's'}</span>
          {loading && <span>Searching backend...</span>}
        </div>

        <div className="space-y-4">
          {results.map((result) => (
            <Link
              key={`${result.type}-${result.slug}`}
              href={result.url}
              className="block rounded-2xl border border-soc-accent/15 bg-soc-darker/60 p-5 transition hover:border-soc-accent/50"
            >
              <div className="flex items-start gap-4">
                <div className="pt-1">{iconForType(result.type)}</div>
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-lg font-bold text-white">{result.title}</h2>
                    <span className="rounded-full border border-soc-accent/20 bg-soc-accent/10 px-3 py-1 text-xs capitalize text-soc-accent">{result.type}</span>
                  </div>
                  <p className="mb-3 text-sm leading-relaxed text-gray-300">{result.description}</p>
                  <p className="flex items-center gap-2 text-xs text-soc-accent/60"><FiClock /> Open training item</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
