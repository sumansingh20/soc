import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiStar, FiClock, FiUsers, FiPlay } from 'react-icons/fi';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  price: number;
  durationHours: number;
  studentsCount: number;
  rating: number;
  slug: string;
  enrolled?: boolean;
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

export const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  difficulty,
  category,
  price,
  durationHours,
  studentsCount,
  rating,
  slug,
  enrolled,
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-soc-darker/50 border border-soc-accent/20 rounded-lg overflow-hidden hover:border-soc-accent/50 transition-all group"
    >
      {/* Header with category */}
      <div className="h-2 bg-gradient-to-r from-soc-accent to-cyan-400"></div>

      <div className="p-6">
        {/* Badge and Category */}
        <div className="flex justify-between items-start mb-3">
          <span className={`px-3 py-1 rounded text-xs font-semibold ${getDifficultyColor(difficulty)}`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
          <span className="text-soc-accent/70 text-xs">{category}</span>
        </div>

        {/* Title */}
        <Link href={`/courses/${slug}`}>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-soc-accent transition line-clamp-2">
            {title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-soc-accent/70 text-sm mb-4 line-clamp-2">{description}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-soc-accent/10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-soc-accent/70 text-xs">
              <FiClock size={14} /> {durationHours}h
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-soc-accent/70 text-xs">
              <FiUsers size={14} /> {studentsCount}+
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-soc-accent/70 text-xs">
              <FiStar size={14} /> {rating}/5
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <p className="text-white font-bold">{price === 0 ? 'Free' : `$${price.toFixed(2)}`}</p>
          <Link
            href={`/courses/${slug}`}
            className={`px-4 py-2 rounded font-semibold text-sm transition flex items-center gap-2 ${
              enrolled
                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                : 'bg-soc-accent/20 text-soc-accent border border-soc-accent/50 hover:border-soc-accent'
            }`}
          >
            <FiPlay size={14} /> {enrolled ? 'Continue' : 'Explore'}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
