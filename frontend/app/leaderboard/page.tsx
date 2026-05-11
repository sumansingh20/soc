'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiAward as Award, FiStar as Trophy, FiTrendingUp as TrendingUp } from 'react-icons/fi';

interface LeaderboardEntry {
  rank: number;
  username: string;
  points: number;
  coursesCompleted: number;
  labsCompleted: number;
  streak: number;
  avatar: string;
}

const LEADERBOARD_DATA: LeaderboardEntry[] = [
  { rank: 1, username: 'alexsecurity', points: 4850, coursesCompleted: 8, labsCompleted: 24, streak: 12, avatar: 'AS' },
  { rank: 2, username: 'threat_hunter_pro', points: 4320, coursesCompleted: 7, labsCompleted: 21, streak: 8, avatar: 'TH' },
  { rank: 3, username: 'soc_analyst_01', points: 4120, coursesCompleted: 7, labsCompleted: 19, streak: 15, avatar: 'SA' },
  { rank: 4, username: 'cyber_defender', points: 3850, coursesCompleted: 6, labsCompleted: 17, streak: 5, avatar: 'CD' },
  { rank: 5, username: 'log_master', points: 3720, coursesCompleted: 6, labsCompleted: 16, streak: 9, avatar: 'LM' },
  { rank: 6, username: 'incident_responder', points: 3450, coursesCompleted: 5, labsCompleted: 14, streak: 3, avatar: 'IR' },
  { rank: 7, username: 'malware_analyst_x', points: 3210, coursesCompleted: 5, labsCompleted: 12, streak: 7, avatar: 'MA' },
  { rank: 8, username: 'network_ninja', points: 2950, coursesCompleted: 4, labsCompleted: 11, streak: 11, avatar: 'NN' },
  { rank: 9, username: 'security_scholar', points: 2780, coursesCompleted: 4, labsCompleted: 10, streak: 4, avatar: 'SS' },
  { rank: 10, username: 'detection_engineer', points: 2650, coursesCompleted: 4, labsCompleted: 9, streak: 2, avatar: 'DE' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export default function LeaderboardPage() {
  const [filterBy, setFilterBy] = useState<'points' | 'courses' | 'labs'>('points');

  const sortedData = [...LEADERBOARD_DATA].sort((a, b) => {
    if (filterBy === 'points') return b.points - a.points;
    if (filterBy === 'courses') return b.coursesCompleted - a.coursesCompleted;
    return b.labsCompleted - a.labsCompleted;
  });

  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-500 to-yellow-600';
    if (rank === 2) return 'from-gray-400 to-gray-500';
    if (rank === 3) return 'from-orange-600 to-orange-700';
    return 'from-soc-accent to-cyan-400';
  };

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="text-yellow-400" size={24} />;
    if (rank <= 3) return <Award size={24} />;
    return <Award size={24} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-soc-dark to-soc-darker py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center gap-3">
            <Trophy className="text-soc-accent" size={40} />
            Leaderboard
          </h1>
          <p className="text-soc-accent/70 text-lg">
            Top security professionals in SOC Academy
          </p>
        </div>

        {/* Stats Overview */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            { label: 'Top Players', value: LEADERBOARD_DATA.length, icon: Trophy },
            { label: 'Total Courses Completed', value: LEADERBOARD_DATA.reduce((a, b) => a + b.coursesCompleted, 0), icon: TrendingUp },
            { label: 'Total Labs Completed', value: LEADERBOARD_DATA.reduce((a, b) => a + b.labsCompleted, 0), icon: Award },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                variants={item}
                className="bg-gradient-to-br from-soc-accent/10 to-soc-accent/5 border border-soc-accent/30 rounded-lg p-6 text-center"
              >
                <Icon className="text-soc-accent mx-auto mb-3" size={28} />
                <p className="text-soc-accent/70 text-sm mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-8">
          {[
            { key: 'points', label: 'By Points' },
            { key: 'courses', label: 'By Courses' },
            { key: 'labs', label: 'By Labs' },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setFilterBy(filter.key as any)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                filterBy === filter.key
                  ? 'bg-gradient-to-r from-soc-accent to-cyan-400 text-soc-dark'
                  : 'bg-soc-darker border border-soc-accent/50 text-soc-accent hover:border-soc-accent'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Leaderboard Table */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="bg-soc-darker/50 border border-soc-accent/20 rounded-lg overflow-hidden hover:border-soc-accent/50 transition"
        >
          {/* Desktop View */}
          <div className="hidden md:block">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 p-6 bg-gradient-to-r from-soc-accent/10 to-transparent border-b border-soc-accent/20 sticky top-0 bg-soc-darker/80 backdrop-blur">
              <div className="col-span-1 text-soc-accent/70 text-sm font-semibold">Rank</div>
              <div className="col-span-4 text-soc-accent/70 text-sm font-semibold">Player</div>
              <div className="col-span-2 text-soc-accent/70 text-sm font-semibold text-center">Points</div>
              <div className="col-span-2 text-soc-accent/70 text-sm font-semibold text-center">Courses</div>
              <div className="col-span-2 text-soc-accent/70 text-sm font-semibold text-center">Labs</div>
              <div className="col-span-1 text-soc-accent/70 text-sm font-semibold text-center">Streak</div>
            </div>

            {/* Rows */}
            {sortedData.map((entry) => (
              <motion.div
                key={entry.rank}
                variants={item}
                className={`grid grid-cols-12 gap-4 p-6 border-b border-soc-accent/10 hover:bg-soc-accent/5 transition ${
                  entry.rank <= 3 ? 'bg-gradient-to-r from-soc-accent/5 to-transparent' : ''
                }`}
              >
                {/* Rank */}
                <div className="col-span-1 flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br ${getMedalColor(entry.rank)}`}>
                    {entry.rank <= 3 ? (
                      getMedalIcon(entry.rank)
                    ) : (
                      <span className="text-white font-bold text-sm">{entry.rank}</span>
                    )}
                  </div>
                </div>

                {/* Player */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-soc-accent to-cyan-400 flex items-center justify-center flex-shrink-0">
                    <span className="text-soc-dark font-bold text-sm">{entry.avatar}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{entry.username}</p>
                  </div>
                </div>

                {/* Points */}
                <div className="col-span-2 text-center">
                  <p className="text-soc-accent font-bold text-lg">{entry.points.toLocaleString()}</p>
                </div>

                {/* Courses */}
                <div className="col-span-2 text-center">
                  <p className="text-white font-semibold">{entry.coursesCompleted}</p>
                </div>

                {/* Labs */}
                <div className="col-span-2 text-center">
                  <p className="text-white font-semibold">{entry.labsCompleted}</p>
                </div>

                {/* Streak */}
                <div className="col-span-1 text-center">
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-semibold border border-orange-500/50">
                    🔥 {entry.streak}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-3 p-4">
            {sortedData.map((entry) => (
              <motion.div
                key={entry.rank}
                variants={item}
                className={`p-4 rounded-lg border ${
                  entry.rank <= 3
                    ? 'bg-gradient-to-r from-soc-accent/10 to-transparent border-soc-accent/50'
                    : 'bg-soc-dark/50 border-soc-accent/20'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br ${getMedalColor(entry.rank)}`}>
                      {entry.rank <= 3 ? (
                        getMedalIcon(entry.rank)
                      ) : (
                        <span className="text-white font-bold text-sm">{entry.rank}</span>
                      )}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-soc-accent to-cyan-400 flex items-center justify-center">
                      <span className="text-soc-dark font-bold text-sm">{entry.avatar}</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{entry.username}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-soc-accent font-bold text-lg">{entry.points.toLocaleString()}</p>
                    <p className="text-orange-400 text-sm">🔥 {entry.streak}</p>
                  </div>
                </div>
                <div className="flex gap-4 text-sm text-soc-accent/70">
                  <span>📚 {entry.coursesCompleted} courses</span>
                  <span>🧪 {entry.labsCompleted} labs</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-soc-accent/10 border border-soc-accent/30 rounded-lg p-6 text-center"
        >
          <p className="text-soc-accent/70">
            Join the leaderboard by enrolling in courses, completing labs, and maintaining a learning streak. The more you learn, the higher you climb! 🚀
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
