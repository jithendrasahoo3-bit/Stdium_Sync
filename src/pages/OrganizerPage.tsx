import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, RefreshCw, TrendingUp, TrendingDown, Minus, Radio, Activity, Map } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { AIAnalysisPanel } from '../components/organizer/AIAnalysisPanel';
import { StatusBadge } from '../components/ui/StatusBadge';
import { StadiumSeatMap } from '../components/stadium/StadiumSeatMap';

const tile = {
  hidden: { opacity: 0, y: 15 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' } }),
};

const COLORS = ['#E06B6B','#AB74C7','#6AB482','#E09255','#E05A47'];

const GateBarTile = ({ index }: { index: number }) => {
  const { telemetry, refreshTelemetry } = useAppStore();
  const TrendIcon = (t: string) => t === 'rising' ? TrendingUp : t === 'falling' ? TrendingDown : Minus;
  return (
    <motion.div custom={index} variants={tile} initial="hidden" animate="show" className="glass-panel p-5 flex flex-col h-full min-h-[340px] pop-card">
      <div className="flex items-center justify-between mb-4 border-b border-glass-border/30 pb-2">
        <h2 className="cmd-section-label text-theme-text-dark flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-cyber-teal-dim" />
          GATE TELEMETRY
        </h2>
        <motion.button onClick={refreshTelemetry} whileHover={{ rotate: 180 }} whileTap={{ scale: 0.95 }} className="text-theme-text-muted hover:text-theme-text-dark p-1 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" />
        </motion.button>
      </div>
      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {telemetry.gates.map((gate, gi) => {
          const T = TrendIcon(gate.trend);
          return (
            <div key={gate.id} className="flex items-center gap-2 cursor-default">
              <div className="w-16 flex-shrink-0">
                <p className="font-display text-[9px] text-theme-text-dark truncate font-bold">{gate.name.split('(')[0].trim()}</p>
              </div>
              <div className="flex-1 h-3 rounded-full overflow-hidden border border-glass-border" style={{ backgroundColor: 'rgba(255,209,209,0.3)' }}>
                <motion.div className="h-full rounded-full"
                  style={{ backgroundColor: COLORS[gi % COLORS.length] }}
                  initial={{ width: 0 }} animate={{ width: `${gate.percentage}%` }}
                  transition={{ duration: 0.5, delay: gi * 0.04 }} />
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <T className={`w-3.5 h-3.5 ${gate.trend === 'rising' ? 'text-cyber-red' : gate.trend === 'falling' ? 'text-cyber-green' : 'text-slate-500'}`} />
                <span className="font-mono text-[10px] font-bold w-8 text-right text-theme-text-dark">
                  {gate.percentage}%
                </span>
                <StatusBadge status={gate.status} size="sm" pulse={gate.status === 'critical'} />
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
  const cfgs: Record<string, { dot: string; text: string; border: string; bg: string }> = {
    red: { dot: 'bg-cyber-red', text: 'text-cyber-red', border: 'border-cyber-red/35', bg: 'bg-cyber-red/5' },
    orange: { dot: 'bg-cyber-amber', text: 'text-cyber-amber', border: 'border-cyber-amber/35', bg: 'bg-cyber-amber/5' },
    yellow: { dot: 'bg-yellow-500', text: 'text-yellow-600', border: 'border-yellow-500/35', bg: 'bg-yellow-500/5' },
    green: { dot: 'bg-cyber-green', text: 'text-cyber-green', border: 'border-cyber-green/35', bg: 'bg-cyber-green/5' },
  };
  return (
    <motion.div custom={index} variants={tile} initial="hidden" animate="show" className="glass-panel p-5 flex flex-col h-full min-h-[220px] pop-card">
      <h2 className="font-display text-theme-text-dark font-semibold text-xs tracking-wider flex items-center gap-1.5 mb-4 border-b border-glass-border/30 pb-2">
        <Shield className="w-4 h-4 text-cyber-teal-dim" />
        SECURITY ZONES
      </h2>
      <div className="space-y-2 flex-1">
        {telemetry.securityZones.map(z => {
          const c = cfgs[z.riskLevel] ?? cfgs.green;
          return (
            <div key={z.id} className={`flex items-center gap-3 p-2 rounded-lg border ${c.border} ${c.bg} cursor-default`}>
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${c.dot} ${z.riskLevel === 'red' ? 'animate-pulse' : ''}`} />
              <div className="flex-1 min-w-0">
                <p className="font-body text-xs text-theme-text-dark font-bold truncate">{z.name}</p>
                <p className="font-mono text-[9px] text-slate-500">{z.crowdDensity}p/m² · {z.patrolUnits} units</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`font-display text-[9px] font-bold ${c.text} uppercase`}>{z.riskLevel}</p>
                {z.incidentCount > 0 && (
                  <p className="font-mono text-[9px] text-cyber-red font-bold animate-pulse">
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
    <motion.div custom={index} variants={tile} initial="hidden" animate="show" className="glass-panel p-5 flex flex-col h-full min-h-[220px] pop-card">
      <h2 className="font-display text-theme-text-dark font-semibold text-xs tracking-wider flex items-center gap-1.5 mb-4 border-b border-glass-border/30 pb-2">
        <Activity className="w-4 h-4 text-cyber-teal-dim" />
        FACILITIES STATUS
      </h2>
      <div className="space-y-2 flex-1 overflow-y-auto pr-1">
        {telemetry.facilities.slice(0, 8).map((f, fi) => (
          <div key={f.id} className="flex items-center gap-2 cursor-default">
            <span className="font-mono text-[9px] font-bold text-slate-500 w-8 border border-glass-border px-1 py-0.5 rounded text-center bg-cyber-blue/30">
              {typeLabel[f.type] ?? 'SYS'}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className="font-body text-xs text-theme-text-dark truncate font-bold">{f.name}</p>
                <span className="font-mono text-[9px] font-bold text-theme-text-muted">
                  {f.occupancyPercentage}%
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden border border-glass-border" style={{ backgroundColor: 'rgba(255,209,209,0.3)' }}>
                <div className="h-full rounded-full"
                  style={{ width: `${f.occupancyPercentage}%`, backgroundColor: COLORS[fi % COLORS.length] }} />
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
    <div className="glass-panel p-3.5 flex items-center gap-3 overflow-hidden pop-card bg-[#FFE3E1]/20">
      <div className="flex items-center gap-1.5 flex-shrink-0 border-r border-glass-border pr-3">
        <Radio className="w-4 h-4 text-cyber-red animate-pulse" />
        <span className="font-display text-cyber-red text-[10px] font-bold tracking-widest uppercase">LIVE VENUE FEEDS</span>
      </div>
      <div className="flex-1 overflow-hidden">
        <motion.div animate={{ x: ['100%', '-100%'] }} transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
          className="whitespace-nowrap font-mono text-[11px] font-semibold text-theme-text-dark"
        >
          {critical.length > 0
            ? critical.map(g => `CRITICAL QUEUE WAIT TIMES DETECTED AT: ${g.name.toUpperCase()} (${g.percentage}% FULL) · PLEASE ADJUST SECURITY LANES `).join(' · ')
            : `All gate interfaces operational · Venue Capacity at ${telemetry.overallPercentage}% (${telemetry.currentOccupancy.toLocaleString()} active spectators) · Current weather is ${telemetry.weatherConditions.temperature}°C, ${telemetry.weatherConditions.condition}.`}
        </motion.div>
      </div>
    </div>
  );
};

const StadiumStatTile = ({ index }: { index: number }) => {
  const { telemetry } = useAppStore();
  const stats = [
    { value: `${telemetry.overallPercentage}%`, label: 'CAPACITY', color: 'var(--theme-primary)' },
    { value: telemetry.currentOccupancy.toLocaleString(), label: 'FANS INSIDE', color: 'var(--theme-primary)' },
    { value: telemetry.activeIncidents, label: 'ACTIVE INCIDENTS', color: '#E05A47' },
    { value: telemetry.medicalUnitsDeployed, label: 'MED UNITS', color: '#6AB482' },
  ];
  return (
    <motion.div custom={index} variants={tile} initial="hidden" animate="show" className="glass-panel p-5 pop-card">
      <div className="flex items-center gap-1.5 mb-4 border-b border-glass-border/30 pb-2">
        <Activity className="w-4 h-4 theme-text-color" />
        <h2 className="cmd-section-label text-theme-text-dark flex items-center gap-1.5">
          <Activity className="w-4 h-4 theme-text-color" /> VENUE STATISTICS OVERVIEW
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label}
            className="rounded-lg border p-3 text-center cursor-default bg-glass-bg border-glass-border"
          >
            <p className="stat-value-display text-2xl" style={{ color: s.color }}>{s.value}</p>
            <p className="cmd-section-label text-slate-500 mt-1">{s.label}</p>
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
    <motion.div data-page="organizer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Executive Header */}
      <div className="flex items-center gap-3 justify-between flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-glass-bg flex items-center justify-center flex-shrink-0 border border-glass-border theme-border-color">
            <Shield className="w-5 h-5 theme-text-color" />
          </div>
          <div>
            <h1 className="cmd-title text-xl text-theme-text-dark neon-text">COMMAND CENTER</h1>
            <p className="cmd-section-label text-theme-text-muted mt-0.5">
              Welcome, {userProfile?.name} · Enterprise Operations Console
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 bg-glass-bg border-glass-border">
            <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
            <span className="font-display text-cyber-green text-[10px] font-bold">{telemetry.overallPercentage}% VENUE LOAD</span>
          </div>
          {/* Tab switcher */}
          <div className="flex bg-cyber-blue/20 rounded-lg p-1 border border-glass-border">
            <button onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-display text-[10px] font-bold transition-all ${
                activeTab === 'dashboard' ? 'text-white shadow-sm' : 'text-theme-text-muted hover:text-theme-text-dark'
              }`}
              style={activeTab === 'dashboard' ? { backgroundColor: 'var(--theme-primary)' } : {}}>
              <Activity className="w-3.5 h-3.5" /> DASHBOARD
            </button>
            <button onClick={() => setActiveTab('seatmap')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-display text-[10px] font-bold transition-all ${
                activeTab === 'seatmap' ? 'text-white shadow-sm' : 'text-theme-text-muted hover:text-theme-text-dark'
              }`}
              style={activeTab === 'seatmap' ? { backgroundColor: 'var(--theme-primary)' } : {}}>
              <Map className="w-3.5 h-3.5" /> SEAT HEATMAP
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'dashboard' ? (
        <>
          {/* LIVE FEED */}
          <LiveTicker />
          {/* BENTO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-6"><StadiumStatTile index={0} /></div>
            <div className="lg:col-span-3"><GateBarTile index={1} /></div>
            <div className="lg:col-span-2"><SecurityTile index={2} /></div>
            <div className="lg:col-span-1" style={{ minWidth: 0 }}><FacilitiesTile index={3} /></div>
            <div className="lg:col-span-6">
              <motion.div custom={4} variants={tile} initial="hidden" animate="show" className="glass-panel p-6 pop-card">
                <AIAnalysisPanel />
              </motion.div>
            </div>
          </div>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
          className="glass-panel p-5 pop-card">
          <StadiumSeatMap mode="organizer" />
        </motion.div>
      )}
    </motion.div>
  );
};