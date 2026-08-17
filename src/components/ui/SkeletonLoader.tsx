/**
 * ============================================================
 * SKELETON LOADER COMPONENT — Loading State Placeholders
 * ============================================================
 * 
 * File: components/ui/SkeletonLoader.tsx
 * Purpose: Provides visual feedback during data loading.
 * Includes multiple skeleton variants for different content types.
 * 
 * Components:
 *   - SkeletonLine: Single animated line placeholder
 *   - SkeletonLoader: Multi-line placeholder for content blocks
 *   - SkeletonCard: Complete card placeholder with header and body
 * 
 * Features:
 *   - Shimmer animation for visual interest
 *   - Staggered animation for multi-line loaders
 *   - Responsive sizing options
 *   - Framer Motion integration for smooth transitions
 * 
 * Usage:
 *   <SkeletonLoader lines={5} />
 *   <SkeletonCard />
 */

import { motion } from 'framer-motion';

/**
 * SkeletonProps Interface
 * Props for skeleton loader components.
 * 
 * @property {string} className - Additional Tailwind classes
 * @property {number} lines - Number of skeleton lines to display
 * @property {string} height - Tailwind height class for each line
 */
interface SkeletonProps {
  className?: string;
  lines?: number;
  height?: string;
}

/**
 * SkeletonLine Component
 * Single animated line placeholder using shimmer effect.
 * Used as a building block for more complex skeletons.
 * 
 * @param {Object} props - Component props
 * @returns {JSX.Element} Animated skeleton line
 */
export const SkeletonLine = ({ className = '' }: { className?: string }) => (
  <div
    className={`bg-gradient-to-r from-cyber-blue via-cyber-teal-dim to-cyber-blue bg-[length:200%_100%] animate-shimmer rounded ${
className}`}
  />
);

/**
 * SkeletonLoader Component
 * Multi-line skeleton loader with staggered animation.
 * Used to preview text content while loading.
 * 
 * @param {SkeletonProps} props - Component props
 * @returns {JSX.Element} Animated multi-line skeleton
 */
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

/**
 * SkeletonCard Component
 * Complete card skeleton with header, content, and action area.
 * Used to preview entire card layouts during loading.
 * 
 * @param {Object} props - Component props
 * @returns {JSX.Element} Animated card skeleton
 */
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
