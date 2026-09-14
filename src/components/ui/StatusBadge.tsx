interface StatusBadgeProps {
  status: 'critical' | 'high' | 'moderate' | 'low' | 'normal' | 'warning' | 'info' | 'resolved';
  label?: string;
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const CONFIG: Record<StatusBadgeProps['status'], { bg: string; text: string; border: string; dot: string; label: string }> = {
  critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-600', label: 'CRITICAL' },
  high: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', dot: 'bg-amber-600', label: 'HIGH' },
  warning: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', dot: 'bg-amber-600', label: 'WARNING' },
  moderate: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-600', label: 'MODERATE' },
  low: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-600', label: 'LOW' },
  normal: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-600', label: 'NORMAL' },
  info: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', dot: 'bg-sky-600', label: 'INFO' },
  resolved: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-600', label: 'RESOLVED' },
};

const SIZES: Record<NonNullable<StatusBadgeProps['size']>, string> = {
  sm: 'px-2 py-0.5 text-[10px] gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
  lg: 'px-3 py-1.5 text-sm gap-2',
};

export const StatusBadge = ({ status, label, pulse = false, size = 'md' }: StatusBadgeProps) => {
  const cfg = CONFIG[status] ?? CONFIG.info;

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${cfg.bg} ${cfg.text} ${cfg.border} ${SIZES[size]}`}>
      <span className={`rounded-full w-1.5 h-1.5 flex-shrink-0 ${cfg.dot} ${pulse ? 'animate-ping' : ''}`} />
      {label ?? cfg.label}
    </span>
  );
};

