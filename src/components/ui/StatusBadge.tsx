/**
 * ============================================================
 * STATUS BADGE COMPONENT — Real-time Status Indicator
 * ============================================================
 * 
 * File: components/ui/StatusBadge.tsx
 * Purpose: Compact visual indicator for system status levels.
 * Used throughout the application to show alerts, facility status,
 * gate occupancy, and security zone conditions.
 * 
 * Features:
 *   - 8 status levels with color-coded styles
 *   - Optional pulse animation for critical states
 *   - 3 size options (sm, md, lg)
 *   - Dot indicator with configurable animation
 *   - Monospace font for technical aesthetics
 * 
 * Usage:
 *   <StatusBadge status="critical" pulse />
 *   <StatusBadge status="normal" label="Active" size="lg" />
 */

/**
 * StatusBadgeProps Interface
 * Props for the StatusBadge component.
 * 
 * @property {string} status - Status level determining colors and appearance
 * @property {string} label - Custom label (defaults to status-specific label)
 * @property {boolean} pulse - Enable pulsing animation on dot
 * @property {'sm' | 'md' | 'lg'} size - Badge size
 */
interface StatusBadgeProps {
  status: 'critical' | 'high' | 'moderate' | 'low' | 'normal' | 'warning' | 'info' | 'resolved';
  label?: string;
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * CONFIG Object
 * Maps each status type to its styling configuration.
 * Includes background, text color, border, indicator dot, and default label.
 */
const CONFIG = {
  critical: { bg: 'bg-cyber-red/20', text: 'text-cyber-red', border: 'border-cyber-red/40', dot: 'bg-cyber-red', label: 'CRITICAL' },
  high: { bg: 'bg-cyber-amber/20', text: 'text-cyber-amber', border: 'border-cyber-amber/40', dot: 'bg-cyber-amber', label: 'HIGH' },
  warning: { bg: 'bg-cyber-amber/20', text: 'text-cyber-amber', border: 'border-cyber-amber/40', dot: 'bg-cyber-amber', label: 'WARNING' },
  moderate: { bg: 'bg-cyber-purple/20', text: 'text-cyber-purple', border: 'border-cyber-purple/40', dot: 'bg-cyber-purple', label: 'MODERATE' },
  low: { bg: 'bg-cyber-teal/20', text: 'text-cyber-teal', border: 'border-cyber-teal/40', dot: 'bg-cyber-teal', label: 'LOW' },
  normal: { bg: 'bg-cyber-green/20', text: 'text-cyber-green', border: 'border-cyber-green/40', dot: 'bg-cyber-green', label: 'NORMAL' },
  info: { bg: 'bg-cyber-teal/20', text: 'text-cyber-teal', border: 'border-cyber-teal/40', dot: 'bg-cyber-teal', label: 'INFO' },
  resolved: { bg: 'bg-cyber-green/20', text: 'text-cyber-green', border: 'border-cyber-green/40', dot: 'bg-cyber-green', label: 'RESOLVED' },
};

/**
 * SIZE Object
 * Maps size options to corresponding padding, text size, and gap values.
 */
const SIZE = {
  sm: 'px-2 py-0.5 text-[10px] gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
  lg: 'px-3 py-1.5 text-sm gap-2',
};

/**
 * StatusBadge Component
 * Renders a compact status indicator with dot, label, and optional pulse.
 * 
 * @param {StatusBadgeProps} props - Component props
 * @returns {JSX.Element} Status badge with styled dot and label
 */
export const StatusBadge = ({ status, label, pulse = false, size = 'md' }: StatusBadgeProps) => {
  const cfg = CONFIG[status];
  return (
    <span className={`inline-flex items-center rounded-full border font-mono font-semibold ${cfg.bg} ${cfg.text} ${cfg.border} ${SIZE[size]}`}>
      <span className={`rounded-full w-1.5 h-1.5 flex-shrink-0 ${cfg.dot} ${pulse ? 'animate-pulse' : ''}`} />
      {label ?? cfg.label}
    </span>
  );
};
