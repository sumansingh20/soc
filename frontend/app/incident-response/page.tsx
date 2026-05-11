'use client';

import { motion } from 'framer-motion';
import { incidentResponsePhases } from '@/lib/soc-content';
import { FiAlertTriangle, FiShield, FiRefreshCcw } from 'react-icons/fi';

export default function IncidentResponsePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-soc-accent uppercase tracking-[0.25em] text-xs mb-3">Incident Response Basics</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Learn the response flow from detection to reporting</h1>
          <p className="text-gray-300 max-w-3xl leading-relaxed">
            Incident response is the process analysts use when they confirm something real is happening and need to control it safely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { icon: FiAlertTriangle, title: 'Detect', body: 'Notice the strange behavior or alert.' },
            { icon: FiShield, title: 'Contain', body: 'Stop the issue from spreading.' },
            { icon: FiRefreshCcw, title: 'Recover', body: 'Restore systems and confirm they are stable.' },
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
            <h2 className="text-2xl font-bold text-white mb-4">Full response phases</h2>
            <div className="space-y-3">
              {incidentResponsePhases.map((phase) => (
                <div key={phase.name} className="rounded-2xl bg-soc-darker/70 border border-soc-accent/10 p-4">
                  <p className="text-soc-accent font-semibold mb-1">{phase.name}</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{phase.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl border border-soc-accent/15 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Example case</h2>
            <div className="space-y-3 text-gray-300 leading-relaxed">
              <p>A server shows many failed logins and then one successful login from a strange location.</p>
              <p>Detection: the spike in failures is suspicious.</p>
              <p>Analysis: check auth.log, lastb, and wtmp for the timeline.</p>
              <p>Containment: disable or reset the affected account if the case is real.</p>
              <p>Reporting: write what happened in simple terms so others can act on it.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
