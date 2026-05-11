'use client';

import { motion } from 'framer-motion';
import { roadmapStages, dayPlans } from '@/lib/soc-content';
import { FiArrowRight, FiLayers } from 'react-icons/fi';

export default function RoadmapPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-soc-accent uppercase tracking-[0.25em] text-xs mb-3">SOC Roadmap</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Beginner to advanced learning order</h1>
          <p className="text-gray-300 max-w-3xl leading-relaxed">
            The roadmap connects your lessons in the right order so each topic builds on the one before it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {roadmapStages.map((stage, index) => (
            <div key={stage.title} className="glass rounded-3xl border border-soc-accent/15 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-11 w-11 rounded-xl bg-soc-accent/15 border border-soc-accent/30 flex items-center justify-center text-soc-accent">
                  <FiLayers />
                </div>
                <div>
                  <p className="text-soc-accent/70 text-sm">Phase {index + 1}</p>
                  <h2 className="text-xl font-bold text-white">{stage.title}</h2>
                </div>
              </div>
              <p className="text-gray-300 mb-4 leading-relaxed">{stage.summary}</p>
              <ul className="space-y-2 text-sm text-gray-200">
                {stage.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <FiArrowRight className="text-soc-accent" size={14} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="glass rounded-3xl border border-soc-accent/15 p-6">
          <h2 className="text-2xl font-bold text-white mb-4">How the learning order flows</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {dayPlans.map((day) => (
              <div key={day.day} className="rounded-2xl bg-soc-darker/70 border border-soc-accent/10 p-5">
                <p className="text-soc-accent mb-1">{day.day}</p>
                <p className="text-white font-semibold mb-2">{day.title}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{day.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
