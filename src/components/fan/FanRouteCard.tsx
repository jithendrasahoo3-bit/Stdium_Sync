import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Navigation,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  RotateCcw,
  Info,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { generateFanRoute } from '../../services/geminiService';

const RouteStep = ({ step, index, total }: { step: string; index: number; total: number }) => (
  <div className="flex items-start gap-3.5">
    <div className="relative flex flex-col items-center flex-shrink-0">
      <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
        {index + 1}
      </div>
      {index < total - 1 && (
        <div className="w-0.5 bg-slate-200 h-8 my-1" />
      )}
    </div>
    <div className="flex-1 pb-4">
      <p className="text-sm font-medium text-slate-800 leading-snug">{step}</p>
    </div>
  </div>
);

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
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 flex-shrink-0">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Seat Navigator &amp; Gate Router</h3>
            <p className="text-xs text-slate-500">Calculates turn-by-turn path avoiding congested stadium gates</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1.5 block uppercase tracking-wider">
              Enter Seat Location or Section
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={fanSeatInput}
                onChange={(e) => setFanSeatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGetRoute()}
                placeholder="e.g. Section 203, Row F, Seat 12"
                className="flex-1 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-lg px-3.5 py-2.5 text-slate-900 text-sm placeholder-slate-400 outline-none transition-all"
              />
              <button
                type="button"
                onClick={handleGetRoute}
                disabled={!fanSeatInput.trim() || isGeneratingRoute}
                className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{isGeneratingRoute ? 'Routing...' : 'Find Route'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {aiAlerts.length > 0 && !fanRoute && !isGeneratingRoute && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <p className="font-bold">Active Ingress Advisory</p>
            <p className="text-amber-800 mt-0.5">
              Some gates are currently at peak queue capacity. The routing engine automatically redirects your entry to the lowest-wait gate for your tier.
            </p>
          </div>
        </div>
      )}

      {isGeneratingRoute && (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3 shadow-sm">
          <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-800">Calculating Concourse Trajectory...</p>
          <p className="text-xs text-slate-500">Checking nearest gates, turnstile queues, and walking corridors</p>
        </div>
      )}

      {routeError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-bold text-red-900 text-sm">Route Calculation Failed</p>
            <p className="text-xs text-red-700 mt-1">{routeError}</p>
            <button
              type="button"
              onClick={handleGetRoute}
              className="mt-2 text-xs font-semibold text-red-800 border border-red-300 rounded px-2.5 py-1 bg-white hover:bg-red-50"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {fanRoute && !isGeneratingRoute && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Route Summary Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Fastest Ingress Route
                  </span>
                  <h4 className="font-bold text-slate-900 text-lg mt-1.5">{fanRoute.seatSection}</h4>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg text-slate-800 text-xs font-bold">
                  <Clock className="w-3.5 h-3.5 text-slate-600" />
                  <span>~{fanRoute.estimatedWalkTime} min walk</span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Recommended Entry Gate</p>
                  <p className="text-sm font-bold text-emerald-950">{fanRoute.recommendedGate}</p>
                </div>
              </div>

              {fanRoute.avoidGates.length > 0 && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-red-800 uppercase tracking-wider">Avoid Congested Gates</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {fanRoute.avoidGates.map((g, i) => (
                        <span key={i} className="text-xs bg-white text-red-700 border border-red-200 rounded px-2 py-0.5 font-medium">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Turn by turn */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <MapPin className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Step-by-Step Wayfinding</h4>
              </div>
              <div className="space-y-1 pt-1">
                {fanRoute.instructions.map((step, i) => (
                  <RouteStep key={i} step={step} index={i} total={fanRoute.instructions.length} />
                ))}
              </div>
            </div>

            {/* Concourse Note */}
            {fanRoute.aiNote && (
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-950">
                  <p className="font-bold uppercase tracking-wider text-blue-800 text-[10px]">Concourse Wayfinding Note</p>
                  <p className="mt-1 leading-relaxed">{fanRoute.aiNote}</p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setFanRoute(null);
                setRouteError(null);
              }}
              className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-xl py-3 transition-colors shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Route Another Seat</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

