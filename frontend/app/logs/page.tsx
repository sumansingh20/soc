'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { logSections } from '@/lib/soc-content';
import { FiDatabase, FiAlertTriangle, FiSearch } from 'react-icons/fi';

export default function LogsPage() {
  const [activeLog, setActiveLog] = useState(logSections[0].name);
  const log = logSections.find((item) => item.name === activeLog) || logSections[0];

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-soc-accent uppercase tracking-[0.25em] text-xs mb-3">Linux Log Analysis</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Learn the logs SOC analysts use every day</h1>
          <p className="text-gray-300 max-w-3xl leading-relaxed">
            Each log section explains what it stores, why it matters, and which real attack clues it can reveal.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap mb-8">
          {logSections.map((section) => (
            <button
              key={section.name}
              onClick={() => setActiveLog(section.name)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition border ${
                activeLog === section.name
                  ? 'bg-soc-accent text-soc-dark border-soc-accent'
                  : 'bg-soc-darker/70 text-soc-accent/70 border-soc-accent/20 hover:border-soc-accent/40'
              }`}
            >
              {section.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass rounded-3xl border border-soc-accent/15 p-6">
            <div className="flex items-center gap-3 mb-4">
              <FiDatabase className="text-soc-accent" size={22} />
              <h2 className="text-2xl font-bold text-white">{log.name}</h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-soc-darker/70 border border-soc-accent/10 p-4">
                <p className="text-soc-accent/70 text-sm mb-1">What it stores</p>
                <p className="text-gray-200">{log.stores}</p>
              </div>
              <div className="rounded-2xl bg-soc-darker/70 border border-soc-accent/10 p-4">
                <p className="text-soc-accent/70 text-sm mb-1">Why it is important</p>
                <p className="text-gray-200">{log.why}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-soc-darker/70 border border-soc-accent/10 p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2"><FiAlertTriangle className="text-soc-accent" /> Real attack examples</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    {log.attacks.map((attack) => (
                      <li key={attack} className="flex gap-2">
                        <span className="text-soc-accent">•</span> {attack}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-soc-darker/70 border border-soc-accent/10 p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2"><FiSearch className="text-soc-accent" /> Investigation use cases</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    {log.useCases.map((useCase) => (
                      <li key={useCase} className="flex gap-2">
                        <span className="text-soc-accent">•</span> {useCase}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass rounded-3xl border border-soc-accent/15 p-6">
              <h3 className="text-white font-semibold mb-4">How analysts use it</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Pick the log, find the clue, and then compare it with the rest of the timeline. The goal is to explain the event in simple words.
              </p>
            </div>

            <div className="rounded-3xl bg-soc-dark/80 border border-soc-accent/15 p-5 font-mono text-sm text-green-300">
              <p className="text-soc-accent mb-2">Sample command flow</p>
              <p>$ grep -i "failed" auth.log</p>
              <p>$ lastb</p>
              <p>$ less /var/log/syslog</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
