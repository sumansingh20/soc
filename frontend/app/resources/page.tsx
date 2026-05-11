'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiDatabase, FiDownload, FiFileText, FiLink, FiMonitor } from 'react-icons/fi';
import { noteApi, resourceApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

type Resource = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  type: string;
  url: string;
  noteSlug?: string;
};

const fallbackResources: Resource[] = [
  { id: 'soc-basics', slug: 'soc-basics-reference', title: 'SOC Basics Reference', category: 'PDF Notes', description: 'Introduction to SOC workflow and analyst mindset.', type: 'pdf', url: '/api/notes/day-1-notes/pdf', noteSlug: 'day-1-notes' },
  { id: 'linux', slug: 'linux-log-cheatsheet', title: 'Linux Log Cheat Sheet', category: 'Cheat Sheets', description: 'auth.log, syslog, Apache logs, wtmp, and btmp references.', type: 'pdf', url: '/api/notes/day-2-notes/pdf', noteSlug: 'day-2-notes' },
  { id: 'commands', slug: 'command-reference', title: 'Command Reference', category: 'Command References', description: 'grep, tail, cat, less, journalctl, last, lastb, ps aux, and netstat.', type: 'pdf', url: '/api/notes/day-3-notes/pdf', noteSlug: 'day-3-notes' },
];

export default function ResourcesPage() {
  const { token } = useAuthStore();
  const [resources, setResources] = useState<Resource[]>(fallbackResources);
  const [activeCategory, setActiveCategory] = useState('All');
  const [busySlug, setBusySlug] = useState('');

  useEffect(() => {
    const loadResources = async () => {
      try {
        const response = await resourceApi.getAll();
        if (response.data.resources?.length) setResources(response.data.resources);
      } catch {
        setResources(fallbackResources);
      }
    };

    loadResources();
  }, []);

  const categories = ['All', ...Array.from(new Set(resources.map((resource) => resource.category)))];
  const filteredResources = activeCategory === 'All'
    ? resources
    : resources.filter((resource) => resource.category === activeCategory);

  const downloadResource = async (resource: Resource) => {
    if (!token) {
      window.location.href = '/login';
      return;
    }

    setBusySlug(resource.slug);
    try {
      await resourceApi.trackDownload(resource.slug);
      if (resource.noteSlug) {
        const response = await noteApi.downloadPdf(resource.noteSlug);
        const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${resource.noteSlug}.pdf`;
        link.click();
        window.URL.revokeObjectURL(blobUrl);
      } else if (resource.url) {
        window.open(resource.url, '_blank', 'noopener,noreferrer');
      }
    } finally {
      setBusySlug('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-soc-accent">Resources</p>
          <h1 className="mb-4 text-4xl font-black text-white md:text-5xl">Notes, cheat sheets, and SOC references</h1>
          <p className="max-w-3xl leading-relaxed text-gray-300">
            Download PDF notes, command references, Linux log guides, SOC resources, and investigation templates for HackShield students.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                activeCategory === category
                  ? 'border-soc-accent bg-soc-accent text-soc-dark'
                  : 'border-soc-accent/20 bg-soc-darker/70 text-soc-accent/70 hover:border-soc-accent/40'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredResources.map((resource) => (
            <div key={resource.slug} className="rounded-3xl border border-soc-accent/15 bg-soc-darker/60 p-6">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-soc-accent/60">{resource.category}</p>
              <h2 className="mb-2 text-xl font-bold text-white">{resource.title}</h2>
              <p className="mb-5 leading-relaxed text-gray-300">{resource.description}</p>
              <button
                onClick={() => void downloadResource(resource)}
                className="inline-flex items-center gap-2 rounded-lg bg-soc-accent px-4 py-2 font-semibold text-soc-dark"
              >
                <FiDownload /> {busySlug === resource.slug ? 'Preparing...' : 'Download / Open'}
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {[
            { icon: FiFileText, title: 'PDF notes' },
            { icon: FiLink, title: 'Learning links' },
            { icon: FiDatabase, title: 'Practice datasets' },
            { icon: FiMonitor, title: 'System samples' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} href="/search" className="rounded-3xl border border-soc-accent/15 bg-soc-darker/70 p-6 text-center">
                <Icon className="mx-auto mb-4 text-soc-accent" size={26} />
                <p className="font-semibold text-white">{item.title}</p>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
