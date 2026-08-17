// ============================================================
// FAN ROUTE CARD — Fan Experience View
// AI-powered personalized routing for fans
// ============================================================

import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Navigation, Clock, Star, Sparkles, AlertTriangle,
  ArrowRight, Shield, RotateCcw,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { generateFanRoute } from '../../services/geminiService';
import { GlassPanel } from '../ui/GlassPanel';
import { SkeletonLoader } from '../ui/SkeletonLoader';

// ── Route Skeleton ────────────────────────────────────────
const RouteSkeleton = () => (
  <GlassPanel glow="green" className="space-y-6">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-cyber-green/20 animate-pulse flex items-center justify-center">
        <Navigation className="w-6 h-6 text-cyber-green animate-pulse" />
      </div>
      <div className="space-y-2 flex-1">
        <div className="h-4 w-1/2 bg-cyber-green/20 rounded animate-pulse" />
        <div className="h-2.5 w-2/3 bg-cyber-blue/50 rounded animate-pulse" />
      </div>
    </div>
    <SkeletonLoader lines={4} height="h-3" />
    <div className="space-y-2">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-cyber-blue/50 animate-pulse flex-shrink-0" />
          <div className="h-3 rounded bg-cyber-blue/40 animate-pulse flex-1" style={{ width: `${60 + i * 10}%` }} />
        </div>
      ))}
    </div>
    <div className="flex justify-center gap-2">
      {[0, 0.2, 0.4].map((d, i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-cyber-green"
          animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: d }}
        />
      ))}
    </div>
  </GlassPanel>
);

// ── Step Item ─────────────────────────────────────────────
const RouteStep = ({ step, index, total }: { step: string; index: number; total: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.2 + index * 0.12 }}
    className="flex items-start gap-3"
  >
    <div className="relative flex-shrink-0">
      <div className="w-8 h-8 rounded-full bg-teal-gradient flex items-center justify-center text-cyber-dark font-mono text-xs font-bold shadow-cyber">
        {index + 1}
      </div>
      {index < total - 1 && (
        <div className="absolute left-1/2 top-8 bottom-0 w-px bg-gradient-to-b from-cyber-teal/40 to-transparent h-6 -translate-x-1/2" />
      )}
    </div>
    <div className="flex-1 pb-6">
      <p className="font-body text-sm text-slate-200 leading-relaxed">{step}</p>
    </div>
  </motion.div>
);

// ── Main Component ────────────────────────────────────────
export const FanRouteCard = () => {
  const {
    telemetry,
    fanSeatInput,
    setFanSeatInput,
    fanRoute,
    setFanRoute,
    isGeneratingRoute,
    setIsGeneratingRoute,
    routeError,
    setRouteError,
    aiAlerts,
  } = useAppStore();

  const handleGetRoute = async () => {
    if (!fanSeatInput.trim()) return;
    setIsGeneratingRoute(true);
    setRouteError(null);
    setFanRoute(null);

    try {
      const route = await generateFanRoute(telemetry, fanSeatInput);
      setFanRoute(route);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not generate route';
      setRouteError(message);
    } finally {
      setIsGeneratingRoute(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Seat Input */}
      <GlassPanel glow="teal" noPadding className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-teal-gradient flex items-center justify-center shadow-cyber flex-shrink-0">
            <MapPin className="w-5 h-5 text-cyber-dark" />
          </div>
          <div>
            <p className="font-display text-white font-bold text-sm tracking-wide">GET YOUR AI ROUTE</p>
            <p className="font-body text-slate-400 text-xs">AI will route you around active bottlenecks</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="font-mono text-xs text-slate-500 mb-1.5 block tracking-wider">
              ENTER YOUR SEAT SECTION
            </label>
            <input
              type="text"
              value={fanSeatInput}
              onChange={e => setFanSeatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGetRoute()}
              placeholder="e.g. Section 203, Row F, Seat 12"
              className="w-full bg-cyber-dark/60 border border-glass-border focus:border-cyber-teal/60 rounded-lg px-4 py-3 text-white font-body text-sm placeholder-slate-600 outline-none transition-all duration-200 focus:shadow-cyber"
            />
          </div>

          <button
            onClick={handleGetRoute}
            disabled={!fanSeatInput.trim() || isGeneratingRoute}
            className="group w-full relative overflow-hidden rounded-xl bg-teal-gradient hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 p-4 flex items-center justify-center gap-3 shadow-cyber hover:shadow-cyber-strong"
          >
            <Navigation className="w-5 h-5 text-cyber-dark" />
            <span className="font-display text-cyber-dark font-bold text-sm tracking-wide">
              {isGeneratingRoute ? 'GENERATING...' : 'GET MY ROUTE'}
            </span>
            <Sparkles className="w-4 h-4 text-cyber-dark" />
          </button>
        </div>
      </GlassPanel>

      {/* Active Alerts Preview */}
      {aiAlerts.length > 0 && !fanRoute && !isGeneratingRoute && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <GlassPanel glow="amber" noPadding className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-cyber-amber animate-pulse" />
              <p className="font-mono text-xs text-cyber-amber font-semibold tracking-wider">
                {aiAlerts.filter(a => a.severity === 'critical').length} CRITICAL ALERTS ACTIVE
              </p>
            </div>
            <p className="font-body text-xs text-slate-400">
              AI is routing you around {telemetry.gates.filter(g => g.status === 'critical').length} congested gates automatically.
            </p>
          </GlassPanel>
        </motion.div>
      )}

      {/* Loading */}
      <AnimatePresence>
        {isGeneratingRoute && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <RouteSkeleton />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {routeError && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GlassPanel glow="red" className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-cyber-red flex-shrink-0" />
              <div>
                <p className="font-display text-cyber-red font-semibold text-sm">Route Generation Failed</p>
                <p className="font-body text-slate-400 text-xs mt-1">{routeError}</p>
                <button
                  onClick={handleGetRoute}
                  className="mt-2 font-mono text-xs text-cyber-teal hover:text-white border border-cyber-teal/30 rounded px-3 py-1.5 transition-colors"
                >
                  RETRY
                </button>
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Route Result */}
      <AnimatePresence>
        {fanRoute && !isGeneratingRoute && (
          <motion.div
            key="route"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Header Card */}
            <GlassPanel glow="green" noPadding className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-gradient flex items-center justify-center shadow-green-glow flex-shrink-0">
                    <Navigation className="w-6 h-6 text-cyber-dark" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-cyber-green font-semibold tracking-wider mb-0.5">AI ROUTE READY</p>
                    <p className="font-display text-white font-bold text-base">{fanRoute.seatSection}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-cyber-green/10 border border-cyber-green/30 rounded-lg px-3 py-1.5">
                  <Clock className="w-3 h-3 text-cyber-green" />
                  <span className="font-mono text-xs text-cyber-green font-bold">{fanRoute.estimatedWalkTime} min</span>
                </div>
              </div>

              {/* Recommended Gate */}
              <div className="flex items-center gap-3 bg-cyber-green/10 rounded-lg p-3 border border-cyber-green/20 mb-3">
                <ArrowRight className="w-4 h-4 text-cyber-green flex-shrink-0" />
                <div>
                  <p className="font-mono text-xs text-slate-500">ENTER VIA</p>
                  <p className="font-body font-semibold text-white text-sm">{fanRoute.recommendedGate}</p>
                </div>
              </div>

              {/* Gates to Avoid */}
              {fanRoute.avoidGates.length > 0 && (
                <div className="flex items-start gap-2.5 bg-cyber-red/5 rounded-lg p-3 border border-cyber-red/20">
                  <Shield className="w-4 h-4 text-cyber-red flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-mono text-xs text-cyber-red mb-1">AVOID THESE GATES</p>
                    <div className="flex flex-wrap gap-2">
                      {fanRoute.avoidGates.map((g, i) => (
                        <span key={i} className="font-body text-xs text-slate-400 bg-cyber-red/10 border border-cyber-red/20 rounded px-2 py-0.5">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </GlassPanel>

            {/* Step by Step Instructions */}
            <GlassPanel glow="teal" noPadding className="p-5">
              <p className="font-mono text-xs text-cyber-teal font-semibold tracking-wider mb-4 flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                TURN-BY-TURN DIRECTIONS
              </p>
              <div className="space-y-0">
                {fanRoute.instructions.map((step, i) => (
                  <RouteStep key={i} step={step} index={i} total={fanRoute.instructions.length} />
                ))}
              </div>
            </GlassPanel>

            {/* AI Note */}
            <GlassPanel glow="purple" noPadding className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-cyber-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Star className="w-4 h-4 text-cyber-purple" />
                </div>
                <div>
                  <p className="font-mono text-xs text-cyber-purple font-semibold mb-1 tracking-wider">AI INSIGHT</p>
                  <p className="font-body text-sm text-slate-300 leading-relaxed">{fanRoute.aiNote}</p>
                  <p className="font-mono text-xs text-slate-600 mt-2">
                    Generated {new Date(fanRoute.generatedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </GlassPanel>

            {/* Re-route button */}
            <button
              onClick={() => {
                setFanRoute(null);
                setRouteError(null);
              }}
              className="w-full flex items-center justify-center gap-2 text-xs font-mono text-slate-500 hover:text-cyber-teal transition-colors border border-glass-border hover:border-cyber-teal/30 rounded-lg py-2.5"
            >
              <RotateCcw className="w-3 h-3" />
              GET NEW ROUTE
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
