'use client';

import { motion } from 'framer-motion';
import { threatHuntingBasics } from '@/lib/soc-content';
import { FiTarget, FiSearch, FiCompass } from 'react-icons/fi';

export default function ThreatHuntingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-soc-accent uppercase tracking-[0.25em] text-xs mb-3">Threat Hunting Basics</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Search for hidden attackers with a clear hypothesis</h1>
          <p className="text-gray-300 max-w-3xl leading-relaxed">
            Threat hunting is not random clicking. It is a planned search for clues that point to hidden activity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { icon: FiTarget, title: 'Why it matters', body: 'Alerts do not catch everything. Hunting helps find behavior that slips through.' },
            { icon: FiSearch, title: 'How to hunt', body: 'Start with one question, check logs, compare patterns, and keep your scope simple.' },
            { icon: FiCompass, title: 'Mindset', body: 'Think like an investigator who wants to prove or disprove a theory with evidence.' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="glass rounded-3xl border border-soc-accent/15 p-6">
                <Icon className="text-soc-accent mb-4" size={26} />
                <h2 className="text-xl font-bold text-white mb-2">{item.title}</h2>
                <p className="text-gray-300 leading-relaxed">{item.body}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass rounded-3xl border border-soc-accent/15 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Common hunting techniques</h2>
            <ul className="space-y-3 text-gray-200">
              {threatHuntingBasics.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-soc-accent">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-3xl border border-soc-accent/15 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Practical example</h2>
            <div className="space-y-3 text-gray-300 leading-relaxed">
              <p>Hypothesis: A hidden attacker may be using the system at unusual hours.</p>
              <p>Check logs, login history, processes, and network connections.</p>
              <p>Compare what is normal with what looks different.</p>
              <p>Record the result in simple analyst language.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
