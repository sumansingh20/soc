'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus as Plus, FiX as X } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const CATEGORIES = ['General', 'Labs', 'SIEM', 'Tools', 'Courses', 'Career', 'Other'];

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function CreateForumPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 5) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to API
    alert('Post created successfully!');
    router.push('/forum');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-soc-dark to-soc-darker py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <Link href="/forum" className="text-soc-accent hover:text-soc-accent/80 transition mb-4 inline-block">
            ← Back to Forum
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Start a New Discussion</h1>
          <p className="text-soc-accent/70">
            Ask a question or share knowledge with the SOC Academy community
          </p>
        </div>

        {/* Form */}
        <motion.form
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Title */}
          <motion.div variants={item} className="bg-soc-darker/50 border border-soc-accent/20 rounded-lg p-6">
            <label className="block text-soc-accent font-semibold mb-3">Discussion Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your question or topic?"
              maxLength={120}
              className="w-full bg-soc-dark/80 border border-soc-accent/30 rounded-lg px-4 py-3 text-white placeholder-soc-accent/40 focus:border-soc-accent/60 focus:outline-none transition"
              required
            />
            <p className="text-soc-accent/60 text-xs mt-2">{title.length}/120 characters</p>
          </motion.div>

          {/* Category */}
          <motion.div variants={item} className="bg-soc-darker/50 border border-soc-accent/20 rounded-lg p-6">
            <label className="block text-soc-accent font-semibold mb-3">Category</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-3 rounded font-semibold text-sm transition-all ${
                    category === cat
                      ? 'bg-gradient-to-r from-soc-accent to-cyan-400 text-soc-dark'
                      : 'bg-soc-dark/50 border border-soc-accent/30 text-soc-accent/70 hover:border-soc-accent/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Description */}
          <motion.div variants={item} className="bg-soc-darker/50 border border-soc-accent/20 rounded-lg p-6">
            <label className="block text-soc-accent font-semibold mb-3">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed context, code snippets, error messages, or what you've already tried..."
              rows={10}
              className="w-full bg-soc-dark/80 border border-soc-accent/30 rounded-lg px-4 py-3 text-white placeholder-soc-accent/40 focus:border-soc-accent/60 focus:outline-none transition font-mono text-sm resize-none"
              required
            />
            <p className="text-soc-accent/60 text-xs mt-2">
              Markdown formatting supported. Use ```language for code blocks.
            </p>
          </motion.div>

          {/* Tags */}
          <motion.div variants={item} className="bg-soc-darker/50 border border-soc-accent/20 rounded-lg p-6">
            <label className="block text-soc-accent font-semibold mb-3">Tags (max 5)</label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add tags to improve visibility..."
                maxLength={20}
                className="flex-1 bg-soc-dark/80 border border-soc-accent/30 rounded-lg px-4 py-2 text-white placeholder-soc-accent/40 focus:border-soc-accent/60 focus:outline-none transition"
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={tags.length >= 5}
                className="px-4 py-2 bg-soc-accent/20 text-soc-accent border border-soc-accent/50 rounded-lg hover:border-soc-accent disabled:opacity-50 transition flex items-center gap-2"
              >
                <Plus size={18} /> Add
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1 bg-soc-accent/20 text-soc-accent border border-soc-accent/50 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      aria-label={`Remove tag ${tag}`}
                      title={`Remove tag ${tag}`}
                      className="text-soc-accent/70 hover:text-soc-accent transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Tips */}
          <motion.div
            variants={item}
            className="bg-soc-accent/10 border border-soc-accent/30 rounded-lg p-4"
          >
            <p className="text-soc-accent/70 text-sm">
              💡 <span className="font-semibold">Tips for good discussions:</span> Be specific, include error messages, 
              show what you've already tried, and provide relevant context like course/lab name and environment details.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div variants={item} className="flex gap-4">
            <Link
              href="/forum"
              className="flex-1 py-3 bg-soc-darker border border-soc-accent/50 text-soc-accent rounded-lg font-semibold hover:border-soc-accent transition text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-soc-accent to-cyan-400 text-soc-dark rounded-lg font-semibold hover:shadow-lg hover:shadow-soc-accent/50 transition-all"
            >
              Create Discussion
            </button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
}
