'use client';

import { motion } from 'framer-motion';
import { FiShield, FiUsers, FiClock, FiBriefcase } from 'react-icons/fi';

const sections = [
  {
    title: 'What is a SOC?',
    body: 'A Security Operations Center is the team that watches systems, reviews alerts, and investigates suspicious activity before it becomes a bigger problem.',
  },
  {
    title: 'Why SOC matters',
    body: 'A SOC helps organizations react faster, find attacks earlier, and keep logs, systems, and users safer.',
  },
  {
    title: 'How SOC teams work',
    body: 'Analysts watch dashboards, inspect logs, validate alerts, collect evidence, and share findings in simple words that the rest of the team can use.',
  },
  {
    title: 'Real workflow',
    body: 'Watch an alert, check the source, read the logs, compare the timeline, write the finding, and decide what happens next.',
  },
];

const hierarchy = [
  'SOC Manager',
  'Tier 3 / Senior Analyst',
  'Tier 2 Analyst',
  'Tier 1 Analyst',
  'Threat Hunter / Incident Responder / DFIR Specialist',
];

const careers = ['SOC Analyst', 'Security Monitor', 'Threat Hunter', 'Incident Responder', 'DFIR Analyst'];

export default function AboutSocPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-soc-accent uppercase tracking-[0.25em] text-xs mb-3">About SOC</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Learn how a real SOC works</h1>
          <p className="text-gray-300 max-w-3xl leading-relaxed">
            This page explains the Security Operations Center in simple language so beginners can understand the daily work of analysts, what they watch, and how they investigate attacks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {sections.map((section) => (
            <div key={section.title} className="glass rounded-3xl border border-soc-accent/15 p-6">
              <h2 className="text-xl font-bold text-white mb-3">{section.title}</h2>
              <p className="text-gray-300 leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {[
            { icon: FiShield, label: 'Defense first', value: 'Blue team work' },
            { icon: FiUsers, label: 'Team focus', value: 'Shared investigation' },
            { icon: FiClock, label: 'Daily routine', value: 'Watch, review, report' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-3xl bg-soc-darker/70 border border-soc-accent/15 p-6">
                <Icon className="text-soc-accent mb-4" size={28} />
                <p className="text-white text-lg font-semibold mb-1">{item.label}</p>
                <p className="text-gray-400">{item.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass rounded-3xl border border-soc-accent/15 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">SOC team hierarchy</h2>
            <div className="space-y-3">
              {hierarchy.map((role, index) => (
                <div key={role} className="flex items-center justify-between rounded-2xl bg-soc-darker/70 border border-soc-accent/10 px-4 py-3">
                  <span className="text-white">{role}</span>
                  <span className="text-soc-accent/60 text-sm">Tier {hierarchy.length - index}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl border border-soc-accent/15 p-6">
            <div className="flex items-center gap-3 mb-4">
              <FiBriefcase className="text-soc-accent" size={22} />
              <h2 className="text-2xl font-bold text-white">Career paths</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {careers.map((career) => (
                <div key={career} className="rounded-2xl bg-soc-darker/70 border border-soc-accent/10 p-4 text-gray-200">
                  {career}
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-sm mt-4 leading-relaxed">
              The training path in this portal focuses on beginner to intermediate SOC skills so students can move step by step into practical investigation work.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
