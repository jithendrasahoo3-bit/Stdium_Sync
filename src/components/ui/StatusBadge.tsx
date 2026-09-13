interface StatusBadgeProps {
  status: 'critical' | 'high' | 'moderate' | 'low' | 'normal' | 'warning' | 'info' | 'resolved';
  label?: string;
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const CONFIG: Record<StatusBadgeProps['status'], { bg: string; text: string; border: string; dot: string; label: string }> = {
  critical: { bg: 'bg-cyber-red/20', text: 'text-cyber-red', border: 'border-cyber-red/40', dot: 'bg-cyber-red', label: 'CRITICAL' },
  high: { bg: 'bg-cyber-amber/20', text: 'text-cyber-amber', border: 'border-cyber-amber/40', dot: 'bg-cyber-amber', label: 'HIGH' },
  warning: { bg: 'bg-cyber-amber/20', text: 'text-cyber-amber', border: 'border-cyber-amber/40', dot: 'bg-cyber-amber', label: 'WARNING' },
  moderate: { bg: 'bg-cyber-purple/20', text: 'text-cyber-purple', border: 'border-cyber-purple/40', dot: 'bg-cyber-purple', label: 'MODERATE' },
  low: { bg: 'bg-cyber-teal/20', text: 'text-cyber-teal', border: 'border-cyber-teal/40', dot: 'bg-cyber-teal', label: 'LOW' },
  normal: { bg: 'bg-cyber-green/20', text: 'text-cyber-green', border: 'border-cyber-green/40', dot: 'bg-cyber-green', label: 'NORMAL' },
  info: { bg: 'bg-cyber-teal/20', text: 'text-cyber-teal', border: 'border-cyber-teal/40', dot: 'bg-cyber-teal', label: 'INFO' },
  resolved: { bg: 'bg-cyber-green/20', text: 'text-cyber-green', border: 'border-cyber-green/40', dot: 'bg-cyber-green', label: 'RESOLVED' },
};

const SIZES: Record<NonNullable<StatusBadgeProps['size']>, string> = {
  sm: 'px-2 py-0.5 text-[10px] gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
  lg: 'px-3 py-1.5 text-sm gap-2',
};

export const StatusBadge = ({ status, label, pulse = false, size = 'md' }: StatusBadgeProps) => {
  const cfg = CONFIG[status] ?? CONFIG.info;

  return (
    <span className={`inline-flex items-center rounded-full border font-mono font-semibold ${cfg.bg} ${cfg.text} ${cfg.border} ${SIZES[size]}`}>
      <span className={`rounded-full w-1.5 h-1.5 flex-shrink-0 ${cfg.dot} ${pulse ? 'animate-pulse' : ''}`} />
      {label ?? cfg.label}
    </span>
  );
};
