'use client';

import { motion } from 'framer-motion';
import { siemBasics } from '@/lib/soc-content';
import { FiTrendingUp, FiLayers, FiBell, FiBarChart2 } from 'react-icons/fi';

const tools = ['Splunk', 'ELK Stack', 'Wazuh', 'QRadar'];

export default function SiemPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-soc-accent uppercase tracking-[0.25em] text-xs mb-3">SIEM Basics</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Understand SIEM in simple SOC language</h1>
          <p className="text-gray-300 max-w-3xl leading-relaxed">
            A SIEM helps collect logs, spot suspicious patterns, and show analysts what needs attention first.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {[
            { icon: FiTrendingUp, title: 'What SIEM is', body: 'A platform for collecting logs and helping security teams review them in one place.' },
            { icon: FiBell, title: 'Alerts', body: 'Alerts highlight patterns that may need analyst attention.' },
            { icon: FiLayers, title: 'Correlation', body: 'Correlation ties events together so a small clue becomes a bigger story.' },
            { icon: FiBarChart2, title: 'Dashboards', body: 'Dashboards show what is happening now, what is noisy, and what is urgent.' },
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
            <h2 className="text-2xl font-bold text-white mb-4">Core SIEM ideas</h2>
            <ul className="space-y-3 text-gray-200">
              {siemBasics.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-soc-accent">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-3xl border border-soc-accent/15 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Common SIEM tools</h2>
            <div className="grid grid-cols-2 gap-3">
              {tools.map((tool) => (
                <div key={tool} className="rounded-2xl bg-soc-darker/70 border border-soc-accent/10 p-4 text-white text-center">
                  {tool}
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-sm mt-4 leading-relaxed">
              The goal is not to memorize tool names. The goal is to understand how central log analysis helps analysts find suspicious behavior faster.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
