import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, AlertTriangle, CheckCircle, Clock, ChevronDown, ChevronUp, RefreshCw, Layers } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { analyzeCrowd, generateAlerts } from '../../services/geminiService';
import type { AnalysisStep } from '../../types';

const PRIORITY_CONFIG = {
  immediate: { icon: Zap, color: 'text-red-700', border: 'border-red-200', bg: 'bg-red-50/60', badge: 'bg-red-100 text-red-800' },
  'short-term': { icon: AlertTriangle, color: 'text-amber-800', border: 'border-amber-200', bg: 'bg-amber-50/60', badge: 'bg-amber-100 text-amber-900' },
  monitoring: { icon: Clock, color: 'text-blue-700', border: 'border-blue-200', bg: 'bg-blue-50/60', badge: 'bg-blue-100 text-blue-800' },
};

const StrategyStep = ({ step, index }: { step: AnalysisStep; index: number }) => {
  const [expanded, setExpanded] = useState(index === 0);
  const cfg = PRIORITY_CONFIG[step.priority] ?? PRIORITY_CONFIG['short-term'];
  const Icon = cfg.icon;

  return (
    <div className={`rounded-xl border ${cfg.border} ${cfg.bg} overflow-hidden transition-colors`}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-black/[0.02] transition-colors"
      >
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-white border ${cfg.border}`}>
          <Icon className={`w-4 h-4 ${cfg.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-xs font-bold ${cfg.color}`}>STEP {step.step}</span>
            <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}>
              {step.priority}
            </span>
          </div>
          <p className="font-semibold text-slate-900 text-sm">{step.title}</p>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-slate-200/60 pt-3 bg-white/60">
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Operational Protocol</p>
                <p className="text-sm text-slate-800 leading-relaxed">{step.action}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Impact &amp; Ingress Rationale</p>
                <p className="text-sm text-slate-600 leading-relaxed">{step.rationale}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const AIAnalysisPanel = () => {
  const {
    telemetry,
    crowdAnalysis,
    isAnalyzing,
    analysisError,
    setCrowdAnalysis,
    setIsAnalyzing,
    setAnalysisError,
    setAiAlerts,
  } = useAppStore();

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setCrowdAnalysis(null);

    try {
      const [analysis, alerts] = await Promise.all([
        analyzeCrowd(telemetry),
        generateAlerts(telemetry),
      ]);
      setCrowdAnalysis(analysis);
      setAiAlerts(alerts);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analysis failed. Please retry.';
      setAnalysisError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      {!isAnalyzing && !crowdAnalysis && (
        <button
          type="button"
          onClick={handleAnalyze}
          className="w-full rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 transition-all p-5 flex items-center justify-between gap-4 text-left shadow-sm group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm sm:text-base">
                Run Crowd Dynamics &amp; Bottleneck Assessment
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                Evaluates gate turnstile throughput, concourse density, and recommended redistribution routes
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold group-hover:bg-blue-700 transition-colors">
            <span>Analyze Now</span>
          </div>
        </button>
      )}

      {isAnalyzing && (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-4 shadow-sm">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <div>
            <p className="font-bold text-slate-900 text-sm">Processing Venue Telemetry...</p>
            <p className="text-xs text-slate-500 mt-1">Analyzing turnstile velocity, zone capacities, and queue progression</p>
          </div>
        </div>
      )}

      {analysisError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-red-900 text-sm">Assessment Error</p>
            <p className="text-xs text-red-700 mt-1">{analysisError}</p>
            <button
              type="button"
              onClick={handleAnalyze}
              className="mt-3 text-xs font-semibold text-red-800 bg-white border border-red-300 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors"
            >
              Retry Assessment
            </button>
          </div>
        </div>
      )}

      {crowdAnalysis && !isAnalyzing && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Crowd Ingress &amp; Capacity Strategy</h3>
                  <p className="text-xs text-slate-500">
                    Updated {new Date(crowdAnalysis.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull; Calculated from live gate counters
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAnalyze}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Re-analyze</span>
              </button>
            </div>

            {/* Executive Summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Executive Situation Summary</p>
              <p className="text-sm text-slate-800 leading-relaxed">{crowdAnalysis.summary}</p>
            </div>

            {/* Risk Assessment */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1.5 text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <p className="text-[11px] font-bold uppercase tracking-wider">Safety Risk Assessment</p>
              </div>
              <p className="text-sm text-amber-900 leading-relaxed">{crowdAnalysis.riskAssessment}</p>
            </div>
          </div>

          {/* Identified Bottlenecks */}
          {crowdAnalysis.bottlenecks.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Active Concourse Bottlenecks</h4>
              </div>
              <ul className="space-y-2">
                {crowdAnalysis.bottlenecks.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-red-50/50 border border-red-100">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-800">{b}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Prioritized Strategy Steps */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Prioritized Action Protocol</h4>
            </div>
            <div className="space-y-2.5">
              {crowdAnalysis.strategy.map((step, i) => (
                <StrategyStep key={step.step} step={step} index={i} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

