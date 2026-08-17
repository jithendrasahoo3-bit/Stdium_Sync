import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, Info, CheckCircle, Clock, MapPin, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { StatusBadge } from '../ui/StatusBadge';
import { generateAlerts } from '../../services/geminiService';
import { useState } from 'react';
import type { AIAlert } from '../../types';

const SEVERITY_CONFIG = {
  critical: { icon: AlertTriangle, iconColor: 'text-cyber-red', bg: 'bg-cyber-red/10', border: 'border-cyber-red/40', pulse: true },
  warning: { icon: Bell, iconColor: 'text-cyber-amber', bg: 'bg-cyber-amber/10', border: 'border-cyber-amber/40', pulse: false },
  info: { icon: Info, iconColor: 'text-cyber-teal', bg: 'bg-cyber-teal/10', border: 'border-cyber-teal/40', pulse: false },
  resolved: { icon: CheckCircle, iconColor: 'text-cyber-green', bg: 'bg-cyber-green/5', border: 'border-cyber-green/20', pulse: false },
};

const AlertCard = ({ alert, index, isSelected, onSelect }: { alert: AIAlert; index: number; isSelected: boolean; onSelect: () => void }) => {
  const cfg = SEVERITY_CONFIG[alert.severity] ?? SEVERITY_CONFIG.info;
  const Icon = cfg.icon;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
      <button onClick={onSelect} className={`w-full text-left rounded-xl border p-3.5 transition-all duration-200 ${cfg.border} ${cfg.bg} ${isSelected ? 'ring-2 ring-cyber-teal/50' : 'hover:brightness-110'}`}>
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-lg ${cfg.bg} border ${cfg.border} flex items-center justify-center flex-shrink-0 mt-0.5`}>
            <Icon className={`w-4 h-4 ${cfg.iconColor} ${cfg.pulse ? 'animate-pulse' : ''}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="font-display text-white font-semibold text-sm leading-tight">{alert.title}</p>
              <StatusBadge status={alert.severity} size="sm" pulse={cfg.pulse} />
            </div>
            <p className="font-body text-slate-400 text-xs leading-relaxed mb-2">{alert.description}</p>
            <div className="flex items-center gap-3 flex-wrap text-xs font-mono">
              <span className={`flex items-center gap-1 ${cfg.iconColor}`}><MapPin className="w-3 h-3" />{alert.affectedArea}</span>
              <span className="flex items-center gap-1 text-slate-500"><Clock className="w-3 h-3" />{new Date(alert.timestamp).toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' })}</span>
            </div>
            <div className="mt-2.5 bg-black/20 rounded-lg p-2.5 border border-white/5">
              <p className="font-mono text-[10px] text-cyber-teal font-semibold tracking-wider mb-0.5">ACTION REQUIRED</p>
              <p className="font-body text-xs text-slate-300 leading-relaxed">{alert.recommendedAction}</p>
            </div>
            {isSelected && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 flex items-center gap-1.5 text-cyber-teal">
                <div className="w-1.5 h-1.5 rounded-full bg-cyber-teal animate-pulse" />
                <span className="font-mono text-[10px]">Selected for translation</span>
              </motion.div>
            )}
          </div>
        </div>
      </button>
    </motion.div>
  );
};

export const AlertFeed = () => {
  const { aiAlerts, setAiAlerts, selectedAlertId, setSelectedAlertId, telemetry } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true); setErr(null);
    try {
      const alerts = await generateAlerts(telemetry);
      setAiAlerts(alerts);
    } catch (e) {
      setErr((e as Error)?.message ?? 'Failed to generate alerts');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0">
        <h2 className="font-display text-white font-semibold text-sm tracking-wide flex items-center gap-2">
          <div className="w-1 h-4 bg-red-gradient rounded-full" />
          ACTIVE ALERTS
          {aiAlerts.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-cyber-red text-white text-[10px] font-bold flex items-center justify-center animate-pulse">{aiAlerts.length}</span>
          )}
        </h2>
        <button onClick={handleGenerate} disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-teal/10 border border-cyber-teal/30 text-cyber-teal hover:bg-cyber-teal/20 transition-all text-[10px] font-mono disabled:opacity-50">
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : aiAlerts.length > 0 ? <RefreshCw className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
          {loading ? 'GENERATING...' : aiAlerts.length > 0 ? 'REFRESH' : 'GENERATE AI ALERTS'}
        </button>
      </div>

      {err && <div className="text-cyber-red text-xs font-mono bg-cyber-red/10 border border-cyber-red/30 rounded-lg px-3 py-2">{err}</div>}

      <div className="flex-1 overflow-y-auto space-y-3 pr-1" style={{ maxHeight: 500 }}>
        <AnimatePresence mode="wait">
          {aiAlerts.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-10 text-center">
              <Bell className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="font-display text-slate-500 text-sm mb-1">No Active Alerts</p>
              <p className="font-body text-slate-600 text-xs">Click "Generate AI Alerts" to analyze live telemetry.</p>
            </motion.div>
          ) : (
            <motion.div key="list" className="space-y-3">
              {aiAlerts.map((alert, i) => (
                <AlertCard key={alert.id} alert={alert} index={i}
                  isSelected={selectedAlertId === alert.id}
                  onSelect={() => setSelectedAlertId(selectedAlertId === alert.id ? null : alert.id)} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};