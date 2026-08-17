// ============================================================
// AI ANALYSIS PANEL — Organizer Dashboard
// XAI reasoning display from Gemini crowd analysis
// ============================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, AlertTriangle, CheckCircle, Clock, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { analyzeCrowd, generateAlerts } from '../../services/geminiService';
import { GlassPanel } from '../ui/GlassPanel';
import { SkeletonLoader } from '../ui/SkeletonLoader';
import type { AnalysisStep } from '../../types';

const PRIORITY_CONFIG = {
  immediate: { glow: 'red' as const, icon: Zap, color: 'text-cyber-red', border: 'border-cyber-red/30', bg: 'bg-cyber-red/5' },
  'short-term': { glow: 'amber' as const, icon: AlertTriangle, color: 'text-cyber-amber', border: 'border-cyber-amber/30', bg: 'bg-cyber-amber/5' },
  monitoring: { glow: 'teal' as const, icon: Clock, color: 'text-cyber-teal', border: 'border-cyber-teal/30', bg: 'bg-cyber-teal/5' },
};

const StrategyStep = ({ step, index }: { step: AnalysisStep; index: number }) => {
  const [expanded, setExpanded] = useState(index === 0);
  const cfg = PRIORITY_CONFIG[step.priority];
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.15 }}
      className={`rounded-xl border ${cfg.border} ${cfg.bg} overflow-hidden`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/2 transition-colors"
      >
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          cfg.glow === 'red' ? 'bg-cyber-red/20' : cfg.glow === 'amber' ? 'bg-cyber-amber/20' : 'bg-cyber-teal/20'
        }`}>
          <Icon className={`w-5 h-5 ${cfg.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`font-mono text-xs font-bold ${cfg.color}`}>STEP {step.step}</span>
            <span className="font-mono text-xs text-slate-500 uppercase">[{step.priority}]</span>
          </div>
          <p className="font-body font-semibold text-white text-sm">{step.title}</p>
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
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
              <div>
                <p className="font-mono text-xs text-slate-500 mb-1 uppercase tracking-wider">Action</p>
                <p className="font-body text-sm text-slate-200 leading-relaxed">{step.action}</p>
              </div>
              <div>
                <p className="font-mono text-xs text-slate-500 mb-1 uppercase tracking-wider">Rationale (XAI)</p>
                <p className="font-body text-sm text-slate-400 leading-relaxed italic">{step.rationale}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Analysis Skeleton ─────────────────────────────────────
const AnalysisSkeleton = () => (
  <GlassPanel glow="teal" className="space-y-6">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-cyber-teal/20 animate-pulse flex items-center justify-center">
        <Brain className="w-5 h-5 text-cyber-teal animate-pulse" />
      </div>
      <div className="space-y-2 flex-1">
        <div className="h-4 w-1/3 bg-cyber-teal/20 rounded animate-pulse" />
        <div className="h-3 w-1/2 bg-cyber-blue/50 rounded animate-pulse" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 text-xs font-mono text-cyber-teal/60 font-semibold tracking-wider">ANALYZING TELEMETRY DATA...</div>
      <SkeletonLoader lines={3} height="h-3" />
    </div>
    {[0, 1, 2].map(i => (
      <div key={i} className="rounded-xl border border-glass-border p-4 space-y-2">
        <div className="h-4 w-1/4 bg-cyber-blue/50 rounded animate-pulse" />
        <SkeletonLoader lines={2} height="h-3" />
      </div>
    ))}
    <div className="flex items-center justify-center gap-3 py-2">
      <div className="flex gap-1">
        {[0, 0.2, 0.4].map((delay, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-cyber-teal"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.2, delay }}
          />
        ))}
      </div>
      <span className="font-mono text-xs text-cyber-teal">Gemini AI reasoning...</span>
    </div>
  </GlassPanel>
);

// ── Main Panel ────────────────────────────────────────────
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
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      setAnalysisError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Trigger Button */}
      {!isAnalyzing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="group w-full relative overflow-hidden rounded-xl border border-cyber-teal/40 bg-cyber-teal/10 hover:bg-cyber-teal/20 transition-all duration-300 p-4 flex items-center justify-center gap-3 hover:shadow-cyber disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-teal/0 via-cyber-teal/5 to-cyber-teal/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <div className="relative flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-gradient flex items-center justify-center shadow-cyber">
                <Brain className="w-5 h-5 text-cyber-dark" />
              </div>
              <div className="text-left">
                <p className="font-display text-white font-bold text-sm tracking-wide">
                  AI CROWD ANALYSIS
                </p>
                <p className="font-mono text-cyber-teal text-xs">Powered by Gemini 1.5 Flash · XAI Reasoning</p>
              </div>
              <Sparkles className="w-5 h-5 text-cyber-teal ml-auto animate-pulse" />
            </div>
          </button>
        </motion.div>
      )}

      {/* Loading State */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AnalysisSkeleton />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {analysisError && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <GlassPanel glow="red" className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-cyber-red flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-display text-cyber-red font-semibold text-sm mb-1">Analysis Failed</p>
                <p className="font-body text-slate-400 text-sm">{analysisError}</p>
                <button
                  onClick={handleAnalyze}
                  className="mt-3 font-mono text-xs text-cyber-teal hover:text-white transition-colors border border-cyber-teal/30 hover:border-cyber-teal rounded px-3 py-1.5"
                >
                  RETRY ANALYSIS
                </button>
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {crowdAnalysis && !isAnalyzing && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Header */}
            <GlassPanel glow="teal" noPadding className="p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-gradient flex items-center justify-center shadow-cyber flex-shrink-0">
                    <Brain className="w-5 h-5 text-cyber-dark" />
                  </div>
                  <div>
                    <p className="font-display text-white font-bold text-sm tracking-wide">GEMINI AI ANALYSIS</p>
                    <p className="font-mono text-slate-500 text-xs">
                      Generated {new Date(crowdAnalysis.generatedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-cyber-green flex-shrink-0 mt-1" />
              </div>

              {/* Executive Summary */}
              <div className="bg-cyber-blue/40 rounded-lg p-4 mb-4">
                <p className="font-mono text-xs text-cyber-teal mb-2 tracking-wider font-semibold">EXECUTIVE SUMMARY</p>
                <p className="font-body text-slate-200 text-sm leading-relaxed">{crowdAnalysis.summary}</p>
              </div>

              {/* Risk Assessment */}
              <div className="bg-cyber-red/10 border border-cyber-red/20 rounded-lg p-3">
                <p className="font-mono text-xs text-cyber-red mb-1 tracking-wider font-semibold">RISK ASSESSMENT</p>
                <p className="font-body text-slate-300 text-sm leading-relaxed">{crowdAnalysis.riskAssessment}</p>
              </div>
            </GlassPanel>

            {/* Bottlenecks */}
            <GlassPanel glow="amber" noPadding className="p-5">
              <p className="font-mono text-xs text-cyber-amber mb-3 tracking-wider font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                IDENTIFIED BOTTLENECKS
              </p>
              <ul className="space-y-2">
                {crowdAnalysis.bottlenecks.map((b, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-2.5"
                  >
                    <span className="font-mono text-xs text-cyber-amber font-bold flex-shrink-0 mt-0.5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="font-body text-sm text-slate-300">{b}</p>
                  </motion.li>
                ))}
              </ul>
            </GlassPanel>

            {/* 3-Step Strategy */}
            <div className="space-y-2">
              <p className="font-display text-white font-semibold text-sm tracking-wide flex items-center gap-2">
                <div className="w-1 h-4 bg-cyber-purple rounded-full" />
                AI-GENERATED STRATEGY
              </p>
              {crowdAnalysis.strategy.map((step, i) => (
                <StrategyStep key={step.step} step={step} index={i} />
              ))}
            </div>

            {/* Re-analyze button */}
            <button
              onClick={handleAnalyze}
              className="w-full font-mono text-xs text-slate-500 hover:text-cyber-teal transition-colors border border-glass-border hover:border-cyber-teal/30 rounded-lg py-2.5 flex items-center justify-center gap-2"
            >
              <Brain className="w-3 h-3" />
              RE-ANALYZE WITH LATEST DATA
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
