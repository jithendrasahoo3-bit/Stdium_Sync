import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, RefreshCw, TrendingUp, TrendingDown, Minus, Radio, Activity, Map } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { AIAnalysisPanel } from '../components/organizer/AIAnalysisPanel';
import { StatusBadge } from '../components/ui/StatusBadge';
import { StadiumSeatMap } from '../components/stadium/StadiumSeatMap';

const tile = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.25 } }),
};

const GateBarTile = ({ index }: { index: number }) => {
  const { telemetry, refreshTelemetry } = useAppStore();
  const TrendIcon = (t: string) => t === 'rising' ? TrendingUp : t === 'falling' ? TrendingDown : Minus;
  return (
    <motion.div custom={index} variants={tile} initial="hidden" animate="show" className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col h-full min-h-[340px]">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-blue-600" />
          Turnstile Throughput
        </h2>
        <button onClick={refreshTelemetry} className="text-slate-400 hover:text-slate-700 p-1 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {telemetry.gates.map((gate) => {
          const T = TrendIcon(gate.trend);
          const barColor =
            gate.status === 'critical' ? 'bg-red-500' :
            gate.status === 'high' ? 'bg-amber-500' :
            gate.status === 'moderate' ? 'bg-indigo-500' : 'bg-emerald-500';

          return (
            <div key={gate.id} className="flex items-center gap-2">
              <div className="w-20 flex-shrink-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{gate.name.split('(')[0].trim()}</p>
              </div>
              <div className="flex-1 h-2 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${gate.percentage}%` }} />
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <T className={`w-3.5 h-3.5 ${gate.trend === 'rising' ? 'text-red-600' : gate.trend === 'falling' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className="text-xs font-bold w-8 text-right text-slate-800">
                  {gate.percentage}%
                </span>
                <StatusBadge status={gate.status} size="sm" />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

const SecurityTile = ({ index }: { index: number }) => {
  const { telemetry } = useAppStore();
  return (
    <motion.div custom={index} variants={tile} initial="hidden" animate="show" className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col h-full min-h-[220px]">
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-4 border-b border-slate-100 pb-2.5">
        <Shield className="w-4 h-4 text-blue-600" />
        Security Sectors
      </h2>
      <div className="space-y-2 flex-1">
        {telemetry.securityZones.map(z => {
          const isCrit = z.riskLevel === 'red';
          const isWarn = z.riskLevel === 'orange';
          return (
            <div key={z.id} className={`flex items-center gap-3 p-2 rounded-lg border ${
              isCrit ? 'bg-red-50/60 border-red-200' : isWarn ? 'bg-amber-50/60 border-amber-200' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                isCrit ? 'bg-red-600 animate-ping' : isWarn ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">{z.name}</p>
                <p className="text-[10px] text-slate-500">{z.crowdDensity} p/m² &bull; {z.patrolUnits} officers</p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                  isCrit ? 'bg-red-100 text-red-800 border-red-200' : isWarn ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                }`}>{z.riskLevel}</span>
                {z.incidentCount > 0 && (
                  <p className="text-[10px] text-red-600 font-bold mt-0.5">
                    {z.incidentCount} active
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

const FacilitiesTile = ({ index }: { index: number }) => {
  const { telemetry } = useAppStore();
  const typeLabel: Record<string, string> = { restroom: 'WC', concession: 'F&B', medical: 'MED', parking: 'PKG' };
  return (
    <motion.div custom={index} variants={tile} initial="hidden" animate="show" className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col h-full min-h-[220px]">
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-4 border-b border-slate-100 pb-2.5">
        <Activity className="w-4 h-4 text-blue-600" />
        Concourse Services
      </h2>
      <div className="space-y-2 flex-1 overflow-y-auto pr-1">
        {telemetry.facilities.slice(0, 8).map((f) => (
          <div key={f.id} className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-600 w-8 border border-slate-200 px-1 py-0.5 rounded text-center bg-slate-100">
              {typeLabel[f.type] ?? 'SYS'}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-xs font-semibold text-slate-900 truncate">{f.name}</p>
                <span className="text-[10px] font-bold text-slate-500">
                  {f.occupancyPercentage}%
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                <div
                  className={`h-full rounded-full ${f.occupancyPercentage > 85 ? 'bg-red-500' : f.occupancyPercentage > 60 ? 'bg-amber-500' : 'bg-blue-500'}`}
                  style={{ width: `${f.occupancyPercentage}%` }} />
              </div>
            </div>
            <StatusBadge status={f.operationalStatus === 'overloaded' ? 'critical' : f.operationalStatus === 'busy' ? 'warning' : 'normal'}
              label={f.operationalStatus === 'overloaded' ? 'OVER' : f.operationalStatus === 'busy' ? 'BUSY' : 'OPEN'} size="sm" />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const LiveTicker = () => {
  const { telemetry } = useAppStore();
  const critical = telemetry.gates.filter(g => g.status === 'critical');
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 overflow-hidden shadow-sm">
      <div className="flex items-center gap-1.5 flex-shrink-0 border-r border-slate-200 pr-3">
        <Radio className="w-4 h-4 text-red-600 animate-pulse" />
        <span className="text-[11px] font-bold text-red-700 tracking-wider uppercase">Live Operations Ticker</span>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="whitespace-nowrap text-xs text-slate-700 font-medium">
          {critical.length > 0
            ? critical.map(g => `QUEUE ALERT: ${g.name.toUpperCase()} (${g.percentage}% FULL) - ADJUST INGRESS LANES`).join(' • ')
            : `All gate interfaces running within operational velocity • Overall Stadium Load: ${telemetry.overallPercentage}% (${telemetry.currentOccupancy.toLocaleString()} spectators inside) • Weather: ${telemetry.weatherConditions.temperature}°C, ${telemetry.weatherConditions.condition}.`}
        </div>
      </div>
    </div>
  );
};

const StadiumStatTile = ({ index }: { index: number }) => {
  const { telemetry } = useAppStore();
  const stats = [
    { value: `${telemetry.overallPercentage}%`, label: 'CAPACITY OCCUPIED', color: 'text-blue-600' },
    { value: telemetry.currentOccupancy.toLocaleString(), label: 'FANS IN VENUE', color: 'text-slate-900' },
    { value: telemetry.activeIncidents, label: 'ACTIVE INCIDENTS', color: telemetry.activeIncidents > 3 ? 'text-red-600' : 'text-slate-900' },
    { value: telemetry.medicalUnitsDeployed, label: 'MED UNITS ON DUTY', color: 'text-emerald-600' },
  ];
  return (
    <motion.div custom={index} variants={tile} initial="hidden" animate="show" className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2.5">
        <Activity className="w-4 h-4 text-blue-600" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Tournament Venue Summary
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-3.5 text-center">
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export const OrganizerPage = () => {
  const { userProfile, telemetry } = useAppStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'seatmap'>('dashboard');

  return (
    <div data-page="organizer" className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 justify-between flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Venue Command Center</h1>
            <p className="text-xs text-slate-500">
              Operations Director: {userProfile?.name} &bull; FIFA World Cup 2026 Telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-emerald-800">{telemetry.overallPercentage}% VENUE LOAD</span>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === 'dashboard' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('seatmap')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === 'seatmap' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Seat Heatmap</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'dashboard' ? (
        <>
          <LiveTicker />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-6"><StadiumStatTile index={0} /></div>
            <div className="lg:col-span-3"><GateBarTile index={1} /></div>
            <div className="lg:col-span-2"><SecurityTile index={2} /></div>
            <div className="lg:col-span-1" style={{ minWidth: 0 }}><FacilitiesTile index={3} /></div>
            <div className="lg:col-span-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <AIAnalysisPanel />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <StadiumSeatMap mode="organizer" />
        </div>
      )}
    </div>
  );
};