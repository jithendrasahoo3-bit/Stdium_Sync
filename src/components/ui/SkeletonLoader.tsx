import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  lines?: number;
  height?: string;
}

export const SkeletonLine = ({ className = '' }: { className?: string }) => (
  <div
    className={`bg-gradient-to-r from-cyber-blue via-cyber-teal-dim to-cyber-blue bg-[length:200%_100%] animate-shimmer rounded ${className}`}
  />
);

export const SkeletonLoader = ({ className = '', lines = 3, height = 'h-4' }: SkeletonProps) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: i * 0.1 }}
        className={`${height} rounded bg-gradient-to-r from-cyber-blue via-[rgba(0,212,200,0.15)] to-cyber-blue bg-[length:200%_100%] animate-shimmer`}
        style={{ width: i === lines - 1 ? '70%' : '100%' }}
      />
    ))}
  </div>
);

export const SkeletonCard = ({ className = '' }: { className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`glass-panel p-6 space-y-4 ${className}`}
  >
    <div className="h-5 w-1/3 rounded bg-gradient-to-r from-cyber-blue via-[rgba(0,212,200,0.15)] to-cyber-blue bg-[length:200%_100%] animate-shimmer" />
    <SkeletonLoader lines={4} height="h-3" />
    <div className="h-10 w-full rounded-lg bg-gradient-to-r from-cyber-blue via-[rgba(0,212,200,0.15)] to-cyber-blue bg-[length:200%_100%] animate-shimmer" />
  </motion.div>
);
