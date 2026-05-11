'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiThumbsUp as ThumbsUp, FiMessageCircle as MessageCircle, FiShare2 as Share2, FiFlag as Flag, FiArrowLeft as ArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

interface Reply {
  id: string;
  author: string;
  content: string;
  likes: number;
  timestamp: string;
  isAnswered: boolean;
  userRole: 'student' | 'instructor' | 'admin';
}

const REPLIES: Reply[] = [
  {
    id: '1',
    author: 'threat_hunter_pro',
    content: 'Great question! For log parsing in Splunk, I recommend using field extraction at index time. This gives better performance than search-time extraction.',
    likes: 12,
    timestamp: '2 hours ago',
    isAnswered: true,
    userRole: 'instructor',
  },
  {
    id: '2',
    author: 'log_master',
    content: 'I usually implement transforms.conf for efficient field extraction. Make sure to test your regex patterns thoroughly before pushing to production.',
    likes: 8,
    timestamp: '1 hour ago',
    isAnswered: false,
    userRole: 'student',
  },
  {
    id: '3',
    author: 'alexsecurity',
    content: 'The transforms.conf approach works well. Also consider using SEDCMD for simple transformations - it\'s often faster than complex regex patterns.',
    likes: 15,
    timestamp: '45 mins ago',
    isAnswered: false,
    userRole: 'student',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ForumThreadPage({ params }: { params: { id: string } }) {
  const [replyText, setReplyText] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-soc-dark to-soc-darker py-12 px-4">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto"
      >
        {/* Back Button */}
        <motion.div variants={item} className="mb-6">
          <Link href="/forum" className="flex items-center gap-2 text-soc-accent hover:text-soc-accent/80 transition">
            <ArrowLeft size={20} /> Back to Forum
          </Link>
        </motion.div>

        {/* Original Post */}
        <motion.div
          variants={item}
          className="bg-gradient-to-b from-soc-accent/10 to-soc-accent/5 border border-soc-accent/30 rounded-lg p-8 mb-8"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-soc-accent/20 text-soc-accent border border-soc-accent/50 rounded text-sm font-semibold">
                  SIEM
                </span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/50 rounded text-sm font-semibold">
                  ✓ Answered
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">Best practices for log parsing in Splunk</h1>
            </div>
            <button title="Flag this thread" aria-label="Flag this thread" className="text-soc-accent/70 hover:text-soc-accent transition">
              <Flag size={24} />
            </button>
          </div>

          <div className="flex items-center gap-4 text-soc-accent/70 text-sm mb-6">
            <span className="font-semibold">alexsecurity</span>
            <span>•</span>
            <span>Created 4 hours ago</span>
            <span>•</span>
            <span>12 replies</span>
            <span>•</span>
            <span>156 views</span>
          </div>

          <p className="text-soc-accent/70 leading-relaxed mb-6">
            I'm working through the Splunk SIEM course and trying to implement log parsing for Apache access logs. 
            Currently using search-time field extraction but it's running slow. What are the best practices for 
            efficient log parsing in Splunk? Should I use index-time extraction instead? Any recommendations on 
            regex patterns or tools to validate my extraction logic?
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {['splunk', 'siem', 'logs', 'parsing', 'performance'].map((tag) => (
              <span key={tag} className="text-xs px-3 py-1 bg-soc-dark/50 text-soc-accent/70 rounded border border-soc-accent/20">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-6 border-t border-soc-accent/20">
            <button className="flex items-center gap-2 text-soc-accent/70 hover:text-soc-accent transition">
              <ThumbsUp size={18} /> 24
            </button>
            <button className="flex items-center gap-2 text-soc-accent/70 hover:text-soc-accent transition">
              <MessageCircle size={18} /> Reply
            </button>
            <button className="flex items-center gap-2 text-soc-accent/70 hover:text-soc-accent transition">
              <Share2 size={18} /> Share
            </button>
          </div>
        </motion.div>

        {/* Replies */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold text-white">{REPLIES.length} Replies</h2>

          {REPLIES.map((reply, index) => (
            <motion.div
              key={reply.id}
              variants={item}
              className={`bg-soc-darker/50 border rounded-lg p-6 ${
                reply.isAnswered ? 'border-green-500/50 bg-green-500/5' : 'border-soc-accent/20'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-soc-accent to-cyan-400 flex items-center justify-center text-soc-dark font-bold text-sm">
                    {reply.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{reply.author}</p>
                    <p className="text-soc-accent/70 text-xs">{reply.timestamp}</p>
                  </div>
                  {reply.userRole === 'instructor' && (
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded text-xs font-semibold">
                      Instructor
                    </span>
                  )}
                  {reply.isAnswered && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/50 rounded text-xs font-semibold">
                      Accepted Answer
                    </span>
                  )}
                </div>
                <button title="Flag this reply" aria-label="Flag this reply" className="text-soc-accent/70 hover:text-soc-accent transition">
                  <Flag size={18} />
                </button>
              </div>

              <p className="text-soc-accent/70 leading-relaxed mb-4">{reply.content}</p>

              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-soc-accent/70 hover:text-soc-accent transition text-sm">
                  <ThumbsUp size={16} /> {reply.likes}
                </button>
                <button className="flex items-center gap-2 text-soc-accent/70 hover:text-soc-accent transition text-sm">
                  Reply
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Reply Form */}
        <motion.div
          variants={item}
          className="bg-soc-darker/50 border border-soc-accent/20 rounded-lg p-8"
        >
          <h3 className="text-xl font-bold text-white mb-4">Share Your Knowledge</h3>

          <form className="space-y-4">
            <div>
              <label className="block text-soc-accent font-semibold mb-2">Your Reply</label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Share your thoughts, insights, or solutions..."
                rows={6}
                className="w-full bg-soc-dark/80 border border-soc-accent/30 rounded-lg px-4 py-3 text-white placeholder-soc-accent/40 focus:border-soc-accent/60 focus:outline-none transition font-mono text-sm resize-none"
              />
              <p className="text-soc-accent/60 text-xs mt-2">
                Markdown formatting is supported. Use code blocks with ```language for syntax highlighting.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-soc-accent/70">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">Mark as answer to this question</span>
              </label>

              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-soc-accent to-cyan-400 text-soc-dark rounded-lg font-semibold hover:shadow-lg hover:shadow-soc-accent/50 transition-all"
              >
                Post Reply
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
