'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight, FiShield, FiActivity, FiBook, FiTerminal, FiSearch, FiTrendingUp, FiUsers, FiGlobe } from 'react-icons/fi';
import { homeStats, roadmapStages, dayPlans, labs, commandLessons, resources } from '@/lib/soc-content';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const features = [
    {
      icon: <FiShield className="text-2xl" />,
      title: 'SOC Analyst Workflow',
      description: 'Learn how real analysts monitor, investigate, and explain security events.',
    },
    {
      icon: <FiTerminal className="text-2xl" />,
      title: 'Command Practice',
      description: 'Practice grep, tail, last, ps aux, netstat, and journalctl the way analysts do.',
    },
    {
      icon: <FiActivity className="text-2xl" />,
      title: 'Investigation Mindset',
      description: 'Focus on evidence, patterns, and simple explanations for beginners.',
    },
    {
      icon: <FiTrendingUp className="text-2xl" />,
      title: 'Learning Progress',
      description: 'Track lessons, labs, quizzes, and practice completion in one dashboard.',
    },
  ];

  const tabRoadmaps = {
    beginner: roadmapStages[0],
    intermediate: roadmapStages[1],
    advanced: roadmapStages[2],
  };

  return (
    <div className="container mx-auto px-4 pb-24">
      {/* Hero Section */}
      <motion.section
        className="min-h-[88vh] flex items-center py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-center w-full">
          <div>
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 rounded-full border border-soc-accent/20 bg-soc-darker/70 px-4 py-2 text-sm text-soc-accent/80 mb-6"
            >
              <FiGlobe />
              HackShield SOC Training Portal
            </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-black mb-6 leading-tight"
          >
            <span className="neon-text">SOC Training</span>
            <br />
            Built for practical blue team learning.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl"
          >
            Learn SOC basics, log analysis, Linux investigation, monitoring, suspicious activity detection, SIEM, threat hunting, and incident response in simple language.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/roadmap"
              className="px-8 py-3 rounded-lg bg-soc-accent text-soc-dark font-bold hover:bg-soc-accent/90 transition-all flex items-center justify-center gap-2 group"
            >
              Start the Roadmap
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/day-wise"
              className="px-8 py-3 rounded-lg border border-soc-accent/50 text-soc-accent hover:border-soc-accent transition-all"
            >
              View Day Wise Learning
            </Link>
          </motion.div>
        </div>

          <motion.div
            variants={itemVariants}
            className="glass rounded-3xl border border-soc-accent/20 p-6 lg:p-8 shadow-[0_0_40px_rgba(0,212,255,0.08)]"
          >
            <div className="grid grid-cols-2 gap-4 mb-6">
              {homeStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-soc-dark/70 border border-soc-accent/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-soc-accent/50 mb-2">{stat.label}</p>
                  <p className="text-white font-semibold">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-soc-dark/80 border border-soc-accent/15 p-4 font-mono text-sm text-green-300">
              <div className="flex items-center gap-2 mb-3 text-soc-accent/70">
                <FiTerminal />
                Analyst console preview
              </div>
              <p>$ grep -i "failed" auth.log</p>
              <p>$ lastb | head</p>
              <p>$ journalctl -p err --since today</p>
              <p>$ netstat -tulpn</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* About SOC Section */}
      <motion.section
        className="py-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            'A SOC is the team that watches systems, spots danger, and investigates what happened.',
            'Analysts read logs, compare behavior, and decide if activity is normal or suspicious.',
            'This portal teaches the same workflow in a beginner-friendly way with practical examples.',
          ].map((text, index) => (
            <div key={index} className="glass rounded-2xl p-6 border border-soc-accent/15">
              <p className="text-soc-accent/70 text-sm mb-2">0{index + 1}</p>
              <p className="text-white leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold text-center mb-4 neon-text">Why this SOC portal matters</h2>
        <p className="text-center text-gray-400 max-w-3xl mx-auto mb-12">
          Every section is written for practical SOC training, not generic note taking. The goal is to help students think like analysts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="glass p-6 rounded-lg hover:border-soc-accent/50 transition-all group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-soc-accent mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Roadmap Preview */}
      <motion.section className="py-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Learning Roadmap</h2>
            <p className="text-gray-400">Use the roadmap to move from beginner to intermediate SOC thinking.</p>
          </div>
          <Link href="/roadmap" className="text-soc-accent hover:text-cyan-300 transition">Open full roadmap</Link>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setActiveTab(level)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition border ${
                activeTab === level
                  ? 'bg-soc-accent text-soc-dark border-soc-accent'
                  : 'bg-soc-darker/70 text-soc-accent/70 border-soc-accent/20 hover:border-soc-accent/40'
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>

        <div className="glass rounded-3xl p-6 border border-soc-accent/15">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[tabRoadmaps[activeTab], roadmapStages[1], roadmapStages[2]].map((stage, index) => (
              <div key={stage.title + index} className="rounded-2xl bg-soc-dark/70 border border-soc-accent/10 p-5">
                <p className="text-soc-accent text-sm mb-2">{stage.title}</p>
                <h3 className="text-xl font-semibold text-white mb-3">{stage.summary}</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  {stage.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-soc-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Day Wise and Commands Preview */}
      <motion.section className="py-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="glass rounded-3xl border border-soc-accent/15 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Day Wise Learning Preview</h2>
              <Link href="/day-wise" className="text-sm text-soc-accent">Open all days</Link>
            </div>
            <div className="space-y-3">
              {dayPlans.slice(0, 3).map((day) => (
                <div key={day.day} className="rounded-2xl bg-soc-darker/60 border border-soc-accent/10 p-4">
                  <p className="text-soc-accent text-sm mb-1">{day.day}</p>
                  <p className="text-white font-semibold mb-1">{day.title}</p>
                  <p className="text-gray-400 text-sm">{day.summary}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl border border-soc-accent/15 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Command Training Preview</h2>
              <Link href="/commands" className="text-sm text-soc-accent">Open full command guide</Link>
            </div>
            <div className="space-y-3">
              {commandLessons.slice(0, 4).map((command) => (
                <div key={command.name} className="rounded-2xl bg-soc-dark/80 border border-soc-accent/10 p-4 font-mono text-sm">
                  <p className="text-soc-accent mb-2">{command.name}</p>
                  <p className="text-green-300">{command.example}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Labs and Resources */}
      <motion.section className="py-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="glass rounded-3xl border border-soc-accent/15 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Labs Preview</h2>
              <Link href="/labs" className="text-sm text-soc-accent">Open labs</Link>
            </div>
            <div className="space-y-3">
              {labs.slice(0, 3).map((lab) => (
                <div key={lab.title} className="rounded-2xl bg-soc-darker/60 border border-soc-accent/10 p-4">
                  <p className="text-white font-semibold mb-1">{lab.title}</p>
                  <p className="text-gray-400 text-sm">{lab.objective}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl border border-soc-accent/15 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Resources Preview</h2>
              <Link href="/resources" className="text-sm text-soc-accent">Open resources</Link>
            </div>
            <div className="space-y-3">
              {resources.map((resource) => (
                <div key={resource.name} className="rounded-2xl bg-soc-darker/60 border border-soc-accent/10 p-4">
                  <p className="text-white font-semibold mb-1">{resource.name}</p>
                  <p className="text-gray-400 text-sm">{resource.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section className="py-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <h2 className="text-3xl font-bold text-center text-white mb-10">Student mindset</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            'I finally understand how logs connect to real incidents.',
            'The command practice feels like a real SOC workstation.',
            'The daily flow helps me think like an analyst instead of just reading notes.',
          ].map((quote, index) => (
            <div key={index} className="glass rounded-2xl border border-soc-accent/15 p-6">
              <p className="text-gray-300 leading-relaxed mb-4">"{quote}"</p>
              <p className="text-soc-accent/70 text-sm">HackShield student</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 px-8 rounded-3xl bg-gradient-to-r from-soc-accent/10 to-soc-accent-secondary/10 border border-soc-accent/20 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-4">Ready to learn SOC the practical way?</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Start with the roadmap, follow the day wise lessons, practice commands, and move into log investigation step by step.
        </p>
        <Link
          href="/about"
          className="inline-block px-8 py-3 rounded-lg bg-soc-accent text-soc-dark font-bold hover:bg-soc-accent/90 transition-all"
        >
          Explore the SOC training flow
        </Link>
      </motion.section>
    </div>
  );
}
