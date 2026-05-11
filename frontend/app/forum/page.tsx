'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMessageCircle, FiThumbsUp, FiEye, FiSearch, FiFilter, FiPlus } from 'react-icons/fi';
import Link from 'next/link';

interface ForumPost {
  id: string;
  title: string;
  author: string;
  category: string;
  replies: number;
  views: number;
  likes: number;
  lastReply: string;
  isPinned: boolean;
  isResolved: boolean;
  tags: string[];
}

const FORUM_POSTS: ForumPost[] = [
  {
    id: '1',
    title: 'Best practices for log parsing in Splunk',
    author: 'alexsecurity',
    category: 'SIEM',
    replies: 12,
    views: 156,
    likes: 24,
    lastReply: '2 hours ago',
    isPinned: true,
    isResolved: false,
    tags: ['splunk', 'siem', 'logs'],
  },
  {
    id: '2',
    title: 'Help with Lab: SSH Brute Force Detection',
    author: 'security_scholar',
    category: 'Labs',
    replies: 5,
    views: 89,
    likes: 8,
    lastReply: '30 mins ago',
    isPinned: false,
    isResolved: true,
    tags: ['labs', 'ssh', 'detection'],
  },
  {
    id: '3',
    title: 'Python script for parsing Windows Event logs',
    author: 'threat_hunter_pro',
    category: 'Tools',
    replies: 18,
    views: 324,
    likes: 52,
    lastReply: '1 hour ago',
    isPinned: false,
    isResolved: false,
    tags: ['python', 'eventlogs', 'script'],
  },
  {
    id: '4',
    title: 'How to approach incident response in real-world scenario?',
    author: 'incident_responder',
    category: 'General',
    replies: 23,
    views: 412,
    likes: 67,
    lastReply: '45 mins ago',
    isPinned: false,
    isResolved: false,
    tags: ['incident-response', 'career', 'guide'],
  },
  {
    id: '5',
    title: 'Difference between threat hunting and SOC monitoring',
    author: 'log_master',
    category: 'General',
    replies: 14,
    views: 267,
    likes: 35,
    lastReply: '3 hours ago',
    isPinned: false,
    isResolved: false,
    tags: ['soc', 'threat-hunting', 'concepts'],
  },
];

const CATEGORIES = ['All', 'General', 'Labs', 'SIEM', 'Tools', 'Courses', 'Career'];

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

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'unanswered'>('recent');

  const filteredPosts = FORUM_POSTS.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'recent') return 0;
    if (sortBy === 'popular') return b.views - a.views;
    if (sortBy === 'unanswered') return a.replies - b.replies;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-soc-dark to-soc-darker py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <FiMessageCircle className="text-soc-accent" size={36} />
                Community Forum
              </h1>
              <p className="text-soc-accent/70">
                Ask questions, share knowledge, and connect with security professionals
              </p>
            </div>
            <Link
              href="/forum/new"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-soc-accent to-cyan-400 text-soc-dark rounded-lg font-semibold hover:shadow-lg hover:shadow-soc-accent/50 transition-all"
            >
              <FiPlus size={20} /> New Discussion
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-soc-darker/50 border border-soc-accent/20 rounded-lg p-6 mb-8"
        >
          {/* Search Bar */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-soc-accent/50" size={20} />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-soc-dark/80 border border-soc-accent/30 rounded-lg pl-12 pr-4 py-3 text-white placeholder-soc-accent/40 focus:border-soc-accent/60 focus:outline-none transition"
              />
            </div>
            <button title="Open filters" aria-label="Open filters" className="px-6 py-3 bg-soc-accent/20 text-soc-accent border border-soc-accent/50 rounded-lg hover:border-soc-accent transition">
              <FiFilter size={20} />
            </button>
          </div>

          {/* Category and Sort */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Categories */}
            <div>
              <p className="text-soc-accent/70 text-sm mb-3">Category</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      selectedCategory === cat
                        ? 'bg-gradient-to-r from-soc-accent to-cyan-400 text-soc-dark'
                        : 'bg-soc-dark/50 border border-soc-accent/30 text-soc-accent/70 hover:border-soc-accent/60'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <p className="text-soc-accent/70 text-sm mb-3">Sort By</p>
              <div className="flex gap-2">
                {(['recent', 'popular', 'unanswered'] as const).map((sort) => (
                  <button
                    key={sort}
                    onClick={() => setSortBy(sort)}
                    className={`px-4 py-2 rounded text-sm font-semibold transition-all ${
                      sortBy === sort
                        ? 'bg-soc-accent/20 text-soc-accent border border-soc-accent/50'
                        : 'bg-soc-dark/50 border border-soc-accent/20 text-soc-accent/70 hover:border-soc-accent/40'
                    }`}
                  >
                    {sort.charAt(0).toUpperCase() + sort.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Forum Posts */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {sortedPosts.length === 0 ? (
            <div className="text-center py-12 bg-soc-darker/50 border border-soc-accent/20 rounded-lg">
              <FiMessageCircle className="text-soc-accent/50 mx-auto mb-4" size={48} />
              <p className="text-soc-accent/70">No discussions found</p>
            </div>
          ) : (
            sortedPosts.map((post) => (
              <motion.div
                key={post.id}
                variants={item}
                className={`bg-soc-darker/50 border transition-all hover:border-soc-accent/50 rounded-lg p-6 ${
                  post.isPinned ? 'border-soc-accent/50 bg-soc-accent/5' : 'border-soc-accent/20'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Content */}
                  <Link href={`/forum/${post.id}`} className="flex-1 group">
                    <div className="flex items-start gap-3 mb-3">
                      {post.isPinned && (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 rounded text-xs font-semibold">
                          📌 Pinned
                        </span>
                      )}
                      {post.isResolved && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/50 rounded text-xs font-semibold">
                          ✓ Resolved
                        </span>
                      )}
                      <span className="px-2 py-1 bg-soc-accent/20 text-soc-accent border border-soc-accent/50 rounded text-xs font-semibold">
                        {post.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-soc-accent transition mb-2 line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-soc-dark/50 text-soc-accent/70 rounded border border-soc-accent/20"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <p className="text-soc-accent/70 text-sm">
                      by <span className="font-semibold text-soc-accent">{post.author}</span> • {post.lastReply}
                    </p>
                  </Link>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-white font-bold text-lg">{post.replies}</p>
                      <p className="text-soc-accent/70 text-xs">Replies</p>
                    </div>
                    <div className="flex items-center gap-1 text-soc-accent/70">
                      <FiEye size={16} />
                      <p className="text-xs">{post.views}</p>
                    </div>
                    <div className="flex items-center gap-1 text-soc-accent/70">
                      <FiThumbsUp size={16} />
                      <p className="text-xs">{post.likes}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Pagination */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex justify-center gap-2"
        >
          <button className="px-4 py-2 bg-soc-darker border border-soc-accent/30 text-soc-accent rounded hover:border-soc-accent/60 transition">
            ← Previous
          </button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`px-3 py-2 rounded transition-all ${
                page === 1
                  ? 'bg-soc-accent/20 text-soc-accent border border-soc-accent/50'
                  : 'bg-soc-darker border border-soc-accent/30 text-soc-accent/70 hover:border-soc-accent/60'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="px-4 py-2 bg-soc-darker border border-soc-accent/30 text-soc-accent rounded hover:border-soc-accent/60 transition">
            Next →
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
