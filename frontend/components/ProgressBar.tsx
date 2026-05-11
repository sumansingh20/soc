import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  color?: 'accent' | 'success' | 'warning' | 'error';
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
  color = 'accent',
  animated = true,
}) => {
  const colorClasses = {
    accent: 'from-soc-accent to-cyan-400',
    success: 'from-green-500 to-green-600',
    warning: 'from-yellow-500 to-yellow-600',
    error: 'from-red-500 to-red-600',
  };

  return (
    <div>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <p className="text-soc-accent/70 text-sm font-semibold">{label}</p>}
          {showPercentage && <p className="text-white font-bold text-sm">{progress}%</p>}
        </div>
      )}
      <div className="w-full h-2 bg-soc-darker rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${colorClasses[color]}`}
          initial={animated ? { width: 0 } : { width: `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: animated ? 0.8 : 0 }}
        />
      </div>
    </div>
  );
};
