'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { investigations } from '@/lib/soc-content';
import { FiClipboard, FiSearch, FiFlag } from 'react-icons/fi';

export default function InvestigationPage() {
  const [activeCase, setActiveCase] = useState(investigations[0].title);
  const caseData = investigations.find((item) => item.title === activeCase) || investigations[0];

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-soc-accent uppercase tracking-[0.25em] text-xs mb-3">Attack Investigation</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">See how SOC analysts investigate attacks</h1>
          <p className="text-gray-300 max-w-3xl leading-relaxed">
            Each example shows a simple case, the logs that matter, the commands used, and the final finding.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap mb-8">
          {investigations.map((item) => (
            <button
              key={item.title}
              onClick={() => setActiveCase(item.title)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition border ${
                activeCase === item.title
                  ? 'bg-soc-accent text-soc-dark border-soc-accent'
                  : 'bg-soc-darker/70 text-soc-accent/70 border-soc-accent/20 hover:border-soc-accent/40'
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass rounded-3xl border border-soc-accent/15 p-6">
            <div className="flex items-center gap-3 mb-4">
              <FiClipboard className="text-soc-accent" size={22} />
              <h2 className="text-2xl font-bold text-white">{caseData.title}</h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-soc-darker/70 border border-soc-accent/10 p-4">
                <p className="text-soc-accent/70 text-sm mb-1">Scenario</p>
                <p className="text-gray-200">{caseData.scenario}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-soc-darker/70 border border-soc-accent/10 p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2"><FiSearch className="text-soc-accent" /> Logs</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    {caseData.logs.map((log) => (
                      <li key={log}>• {log}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-soc-darker/70 border border-soc-accent/10 p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2"><FiFlag className="text-soc-accent" /> Investigation steps</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    {caseData.steps.map((step) => (
                      <li key={step}>• {step}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-soc-dark/80 border border-soc-accent/15 p-4 font-mono text-sm text-green-300">
                  <p className="text-soc-accent mb-2">Commands used</p>
                  {caseData.commands.map((command) => (
                    <p key={command}>$ {command}</p>
                  ))}
                </div>
                <div className="rounded-2xl bg-soc-darker/70 border border-soc-accent/10 p-4">
                  <h3 className="text-white font-semibold mb-3">Findings</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    {caseData.findings.map((finding) => (
                      <li key={finding}>• {finding}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-r from-soc-accent/10 to-cyan-400/10 border border-soc-accent/15 p-4">
                <h3 className="text-white font-semibold mb-2">Final summary</h3>
                <p className="text-gray-200 leading-relaxed">{caseData.summary}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass rounded-3xl border border-soc-accent/15 p-6">
              <h3 className="text-white font-semibold mb-3">Analyst mindset</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Always ask what happened, when it happened, and what evidence proves it. Keep the explanation simple and factual.
              </p>
            </div>

            <div className="rounded-3xl bg-soc-dark/80 border border-soc-accent/15 p-5 font-mono text-sm text-green-300">
              <p className="text-soc-accent mb-2">Case note format</p>
              <p>Scenario → Evidence → Commands → Finding → Next step</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
