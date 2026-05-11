import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiClock } from 'react-icons/fi';

interface LabCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  estimatedTimeMinutes: number;
  tags?: string[];
  slug: string;
  completed?: boolean;
}

const getDifficultyColor = (difficulty: string) => {
  const colors: { [key: string]: string } = {
    beginner: 'bg-green-500/20 text-green-400 border border-green-500/50',
    intermediate: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50',
    advanced: 'bg-red-500/20 text-red-400 border border-red-500/50',
    expert: 'bg-purple-500/20 text-purple-400 border border-purple-500/50',
  };
  return colors[difficulty] || colors.beginner;
};

export const LabCard: React.FC<LabCardProps> = ({
  title,
  description,
  difficulty,
  category,
  estimatedTimeMinutes,
  tags,
  slug,
  completed,
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-soc-darker/50 border border-soc-accent/20 rounded-lg overflow-hidden hover:border-soc-accent/50 transition-all group"
    >
      {/* Status indicator */}
      {completed && (
        <div className="h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
      )}
      {!completed && <div className="h-1 bg-gradient-to-r from-soc-accent to-cyan-400"></div>}

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <span className={`px-3 py-1 rounded text-xs font-semibold ${getDifficultyColor(difficulty)}`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
          {completed && <span className="text-green-400 text-xs font-semibold">✓ Completed</span>}
        </div>

        {/* Title */}
        <Link href={`/labs/${slug}`}>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-soc-accent transition line-clamp-2">
            {title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-soc-accent/70 text-sm mb-3 line-clamp-2">{description}</p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-soc-accent/10 text-soc-accent border border-soc-accent/20 rounded"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 2 && <span className="text-xs text-soc-accent/60">+{tags.length - 2}</span>}
          </div>
        )}

        {/* Stats */}
        <div className="py-3 border-y border-soc-accent/10 mb-4">
          <div className="flex items-center gap-2 text-soc-accent/70 text-sm">
            <FiClock size={16} />
            {estimatedTimeMinutes} minutes | {category}
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/labs/${slug}`}
          className="block w-full py-2 text-center rounded font-semibold text-sm transition"
        >
          <span className="inline-block px-4 py-2 bg-soc-accent/20 text-soc-accent border border-soc-accent/50 rounded hover:border-soc-accent transition">
            {completed ? 'Review Lab' : 'Start Lab →'}
          </span>
        </Link>
      </div>
    </motion.div>
  );
};
