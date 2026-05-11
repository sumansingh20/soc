import React from 'react';
import { motion } from 'framer-motion';

interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({ text, variant = 'default', size = 'md' }) => {
  const variantStyles = {
    default: 'bg-soc-accent/20 text-soc-accent border-soc-accent/50',
    success: 'bg-green-500/20 text-green-400 border-green-500/50',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    error: 'bg-red-500/20 text-red-400 border-red-500/50',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={`inline-block rounded-full font-semibold border ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {text}
    </motion.span>
  );
};
