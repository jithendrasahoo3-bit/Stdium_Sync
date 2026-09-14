import { type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface GlassPanelProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  glow?: 'teal' | 'red' | 'green' | 'amber' | 'purple' | 'none';
  noPadding?: boolean;
}

export const GlassPanel = ({
  children,
  className = '',
  noPadding = false,
  ...motionProps
}: GlassPanelProps) => (
  <motion.div
    {...motionProps}
    className={`
      bg-white border border-slate-200 rounded-xl shadow-sm
      ${noPadding ? '' : 'p-5 sm:p-6'}
      ${className}
    `}
  >
    {children}
  </motion.div>
);

