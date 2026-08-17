/**
 * ============================================================
 * GLASS PANEL COMPONENT — Reusable Container with Glassmorphism
 * ============================================================
 * 
 * File: components/ui/GlassPanel.tsx
 * Purpose: Foundational UI component providing a frosted glass container
 * with customizable glow effects and motion support.
 * 
 * Features:
 *   - Backdrop blur for glassmorphism effect
 *   - Customizable glow colors (teal, red, green, amber, purple)
 *   - Animated scan line and accent line effects
 *   - Framer Motion integration for animations
 *   - Responsive padding options
 * 
 * Usage:
 *   <GlassPanel glow="teal">
 *     Content here
 *   </GlassPanel>
 */

import { type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

/**
 * GlassPanelProps Interface
 * Props for the GlassPanel component.
 * Extends HTMLMotionProps for full Framer Motion support.
 * 
 * @property {ReactNode} children - Content to display inside the panel
 * @property {string} className - Additional Tailwind classes
 * @property {'teal' | 'red' | 'green' | 'amber' | 'purple' | 'none'} glow - Color of the glow effect and accent line
 * @property {boolean} noPadding - If true, removes default padding
 */
interface GlassPanelProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  glow?: 'teal' | 'red' | 'green' | 'amber' | 'purple' | 'none';
  noPadding?: boolean;
}

/**
 * glowStyles Object
 * Tailwind classes mapped to each glow color option.
 * Controls both box-shadow glow effect and border color.
 */
const glowStyles = {
  teal: 'shadow-cyber border-cyber-teal/30',
  red: 'shadow-red-glow border-cyber-red/30',
  green: 'shadow-green-glow border-cyber-green/30',
  amber: 'shadow-amber-glow border-cyber-amber/30',
  purple: 'shadow-[0_0_20px_rgba(123,97,255,0.4)] border-cyber-purple/30',
  none: 'border-glass-border',
};

/**
 * GlassPanel Component
 * Main component that renders a glassmorphic container.
 * Combines backdrop blur, glow effects, and visual accents.
 * 
 * @param {GlassPanelProps} props - Component props
 * @returns {JSX.Element} Animated glass panel with content
 */
export const GlassPanel = ({
  children,
  className = '',
  glow = 'none',
  noPadding = false,
  ...motionProps
}: GlassPanelProps) => (
  <motion.div
    {...motionProps}
    className={`
      relative backdrop-blur-md bg-glass-bg border rounded-xl overflow-hidden
      ${glowStyles[glow]}
      ${noPadding ? '' : 'p-6'}
      ${className}
    `}
  >
    {/* Scan line effect */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
      <div className="absolute inset-0 bg-grid-pattern bg-grid" />
    </div>
    {/* Top accent line */}
    <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${
      glow === 'teal' ? 'from-transparent via-cyber-teal to-transparent' :
      glow === 'red' ? 'from-transparent via-cyber-red to-transparent' :
      glow === 'green' ? 'from-transparent via-cyber-green to-transparent' :
      glow === 'amber' ? 'from-transparent via-cyber-amber to-transparent' :
      glow === 'purple' ? 'from-transparent via-cyber-purple to-transparent' :
      'from-transparent via-glass-border to-transparent'
    }`} />
    <div className="relative z-10">{children}</div>
  </motion.div>
);
