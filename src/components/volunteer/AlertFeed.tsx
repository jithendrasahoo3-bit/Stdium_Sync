import { useState } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle, Clock, MapPin, Loader2, RefreshCw } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { StatusBadge } from '../ui/StatusBadge';
import { generateAlerts } from '../../services/geminiService';
import type { AIAlert } from '../../types';

const SEVERITY_CONFIG = {
  critical: { icon: AlertTriangle, iconColor: 'text-red-600', bg: 'bg-red-50/60', border: 'border-red-200' },
  warning: { icon: Bell, iconColor: 'text-amber-600', bg: 'bg-amber-50/60', border: 'border-amber-200' },
  info: { icon: Info, iconColor: 'text-blue-600', bg: 'bg-blue-50/60', border: 'border-blue-200' },
  resolved: { icon: CheckCircle, iconColor: 'text-emerald-600', bg: 'bg-emerald-50/60', border: 'border-emerald-200' },
};

interface AlertCardProps {
  alert: AIAlert;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

const AlertCard = ({ alert, isSelected, onSelect }: AlertCardProps) => {
  const cfg = SEVERITY_CONFIG[alert.severity] ?? SEVERITY_CONFIG.info;
  const Icon = cfg.icon;

  return (
    <div
      onClick={onSelect}
      className={`w-full text-left rounded-xl border p-4 transition-all duration-150 cursor-pointer ${cfg.border} ${cfg.bg} ${
        isSelected ? 'ring-2 ring-blue-600 bg-blue-50/40 border-blue-300' : 'hover:border-slate-300'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg bg-white border ${cfg.border} flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs`}>
          <Icon className={`w-4 h-4 ${cfg.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="font-bold text-slate-900 text-sm leading-tight">{alert.title}</p>
            <StatusBadge status={alert.severity} size="sm" />
          </div>
          <p className="text-slate-600 text-xs leading-relaxed mb-2">{alert.description}</p>
          <div className="flex items-center gap-3 flex-wrap text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              {alert.affectedArea}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {new Date(alert.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="mt-2.5 bg-white/80 rounded-lg p-2.5 border border-slate-200">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Recommended Action</p>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">{alert.recommendedAction}</p>
          </div>
          {isSelected && (
            <div className="mt-2 flex items-center gap-1.5 text-blue-600 text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span>Selected &mdash; Ready for translation</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const AlertFeed = () => {
  const { aiAlerts, setAiAlerts, selectedAlertId, setSelectedAlertId, telemetry } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setErr(null);
    try {
      const alerts = await generateAlerts(telemetry);
      setAiAlerts(alerts);
    } catch (e) {
      setErr((e as Error)?.message ?? 'Failed to generate alerts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0">
        <h2 className="font-bold text-slate-900 text-sm tracking-wide flex items-center gap-2">
          <span>Active Alerts</span>
          {aiAlerts.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
              {aiAlerts.length}
            </span>
          )}
        </h2>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all text-xs font-semibold disabled:opacity-50 shadow-xs"
        >
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <RefreshCw className="w-3 h-3" />
          )}
          <span>{loading ? 'Evaluating...' : aiAlerts.length > 0 ? 'Refresh' : 'Scan Alerts'}</span>
        </button>
      </div>

      {err && (
        <div className="text-red-700 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {err}
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 pr-1" style={{ maxHeight: 500 }}>
        {aiAlerts.length === 0 ? (
          <div className="py-12 text-center">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700 text-sm">No Active Concourse Alerts</p>
            <p className="text-slate-500 text-xs mt-0.5">Click &quot;Scan Alerts&quot; to evaluate live gate telemetry.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {aiAlerts.map((alert, i) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                index={i}
                isSelected={selectedAlertId === alert.id}
                onSelect={() => setSelectedAlertId(selectedAlertId === alert.id ? null : alert.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

