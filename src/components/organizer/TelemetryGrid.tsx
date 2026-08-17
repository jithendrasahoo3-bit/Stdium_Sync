/**
 * ============================================================
 * TELEMETRY GRID COMPONENT — Organizer Real-time Monitoring
 * ============================================================
 * 
 * File: components/organizer/TelemetryGrid.tsx
 * Purpose: Displays real-time stadium telemetry data for organizers.
 * Shows gate occupancy, facility status, and security zones in a
 * comprehensive grid layout with animated visualizations.\n * Features:
 *   - Circular capacity indicators with status colors
 *   - Gate occupancy and trend visualization
 *   - Facility queue and status displays
 *   - Security zone risk level indicators
 *   - Real-time data refresh with visual feedback
 *   - Responsive grid layout for various screen sizes\n * Data Displayed:
 *   - Gates: Capacity %, occupancy, trend (rising/stable/falling)
 *   - Facilities: Queue length, operational status
 *   - Security: Crowd density, incident count, patrol units\n */

// ============================================================
// TELEMETRY GRID — Organizer Dashboard
// Real-time display of gate and facility telemetry
// ============================================================

import { motion } from 'framer-motion';
import { RefreshCw, TrendingUp, TrendingDown, Minus, AlertTriangle, Gauge } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { GlassPanel } from '../ui/GlassPanel';
import { StatusBadge } from '../ui/StatusBadge';
import type { GateTelemetry, FacilityTelemetry, SecurityZone } from '../../types';

/**
 * CapacityRing Component
 * Circular SVG indicator showing percentage fill with color-coded status
 * Used for visual at-a-glance capacity assessment
 * \n * Color Mapping:
 *   - Critical (95%+): #FF3B5C (Red)
 *   - High (80-94%): #FFB800 (Amber)
 *   - Moderate (60-79%): #7B61FF (Purple)
 *   - Low (30-59%): #00D4C8 (Teal)
 *   - Normal (<30%): #00FF87 (Green)
 */
// ── Capacity Ring ─────────────────────────────────────────
const CapacityRing = ({ percentage, status }: { percentage: number; status: string }) => {
  const color =
    status === 'critical' ? '#FF3B5C' :
    status === 'high' ? '#FFB800' :
    status === 'moderate' ? '#7B61FF' :
    status === 'low' ? '#00D4C8' : '#00FF87';

  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (percentage / 100) * circ;

  return (
    <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
        <circle
          cx="36" cy="36" r={r} fill="none"
          stroke={color} strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color})`, transition: 'stroke-dasharray 0.5s ease' }}
        />
      </svg>
      <span className="absolute font-mono font-bold text-xs text-white">{percentage}%</span>
    </div>
  );
};

// ── Gate Card ─────────────────────────────────────────────
const GateCard = ({ gate, index }: { gate: GateTelemetry; index: number }) => {
  const TrendIcon = gate.trend === 'rising' ? TrendingUp : gate.trend === 'falling' ? TrendingDown : Minus;
  const trendColor = gate.trend === 'rising' ? 'text-cyber-red' : gate.trend === 'falling' ? 'text-cyber-green' : 'text-slate-400';
  const glow = gate.status === 'critical' ? 'red' : gate.status === 'high' ? 'amber' : gate.status === 'low' ? 'teal' : 'none';

  return (
    <GlassPanel
      glow={glow as 'red' | 'amber' | 'teal' | 'none'}
      noPadding
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-4 hover:border-cyber-teal/40 transition-all duration-300 cursor-default"
    >
      <div className="flex items-start gap-3">
        <CapacityRing percentage={gate.percentage} status={gate.status} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-body font-semibold text-white text-sm leading-tight truncate">
              {gate.name}
            </h3>
            <StatusBadge status={gate.status} size="sm" pulse={gate.status === 'critical'} />
          </div>
          <p className="font-mono text-slate-500 text-xs mb-2 truncate">{gate.location}</p>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-slate-400">
              <span className="text-white font-semibold">{gate.current.toLocaleString()}</span>
              <span className="text-slate-600">/{gate.capacity.toLocaleString()}</span>
            </span>
            <div className={`flex items-center gap-1 ${trendColor}`}>
              <TrendIcon className="w-3 h-3" />
              <span className="font-mono text-xs capitalize">{gate.trend}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1 bg-cyber-blue rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: gate.status === 'critical' ? '#FF3B5C' :
              gate.status === 'high' ? '#FFB800' :
              gate.status === 'moderate' ? '#7B61FF' :
              gate.status === 'low' ? '#00D4C8' : '#00FF87',
            boxShadow: `0 0 6px currentColor`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${gate.percentage}%` }}
          transition={{ duration: 0.8, delay: index * 0.05 }}
        />
      </div>
    </GlassPanel>
  );
};

// ── Facility Row ──────────────────────────────────────────
const FacilityRow = ({ fac }: { fac: FacilityTelemetry }) => {
  const typeIcon = fac.type === 'restroom' ? '🚻' : fac.type === 'concession' ? '🍔' : fac.type === 'medical' ? '🏥' : '🚗';

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
      fac.operationalStatus === 'overloaded'
        ? 'border-cyber-red/30 bg-cyber-red/5'
        : fac.operationalStatus === 'busy'
        ? 'border-cyber-amber/30 bg-cyber-amber/5'
        : 'border-glass-border/50 bg-cyber-blue/20'
    }`}>
      <span className="text-xl flex-shrink-0">{typeIcon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm text-white font-medium truncate">{fac.name}</p>
        <p className="font-mono text-xs text-slate-500">{fac.zone} · Queue: <span className="text-slate-300">{fac.queueLength}</span></p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <StatusBadge
          status={fac.operationalStatus === 'overloaded' ? 'critical' : fac.operationalStatus === 'busy' ? 'warning' : 'normal'}
          label={fac.operationalStatus.toUpperCase()}
          size="sm"
          pulse={fac.operationalStatus === 'overloaded'}
        />
        <span className="font-mono text-xs text-slate-400">{fac.occupancyPercentage}%</span>
      </div>
    </div>
  );
};

// ── Security Zone Indicator ───────────────────────────────
const SecurityZoneIndicator = ({ zone }: { zone: SecurityZone }) => {
  const colors = {
    red: { border: 'border-cyber-red/50', bg: 'bg-cyber-red/10', text: 'text-cyber-red', dot: 'bg-cyber-red' },
    orange: { border: 'border-cyber-amber/50', bg: 'bg-cyber-amber/10', text: 'text-cyber-amber', dot: 'bg-cyber-amber' },
    yellow: { border: 'border-yellow-500/50', bg: 'bg-yellow-500/10', text: 'text-yellow-400', dot: 'bg-yellow-500' },
    green: { border: 'border-cyber-green/50', bg: 'bg-cyber-green/10', text: 'text-cyber-green', dot: 'bg-cyber-green' },
  };
  const c = colors[zone.riskLevel];

  return (
    <div className={`flex items-center gap-3 p-2.5 rounded-lg border ${c.border} ${c.bg}`}>
      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${c.dot} ${zone.riskLevel === 'red' ? 'animate-pulse' : ''}`} />
      <div className="flex-1 min-w-0">
        <p className="font-body text-xs text-white font-medium truncate">{zone.name}</p>
        <p className="font-mono text-xs text-slate-500">{zone.crowdDensity} p/m² · {zone.patrolUnits} units</p>
      </div>
      <div className="text-right">
        <p className={`font-mono text-xs font-bold ${c.text} uppercase`}>{zone.riskLevel}</p>
        {zone.incidentCount > 0 && (
          <p className="font-mono text-xs text-cyber-red">{zone.incidentCount} incidents</p>
        )}
      </div>
    </div>
  );
};

// ── Main Telemetry Grid ───────────────────────────────────
export const TelemetryGrid = () => {
  const { telemetry, refreshTelemetry } = useAppStore();

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Occupancy',
            value: `${telemetry.overallPercentage}%`,
            sub: `${telemetry.currentOccupancy.toLocaleString()} / ${telemetry.totalCapacity.toLocaleString()}`,
            color: 'text-cyber-teal',
            icon: Gauge,
          },
          {
            label: 'Active Incidents',
            value: telemetry.activeIncidents,
            sub: 'Across all zones',
            color: telemetry.activeIncidents > 5 ? 'text-cyber-red' : 'text-cyber-amber',
            icon: AlertTriangle,
          },
          {
            label: 'Medical Units',
            value: telemetry.medicalUnitsDeployed,
            sub: 'Deployed on-site',
            color: 'text-cyber-green',
            icon: () => <span className="text-lg">🏥</span>,
          },
          {
            label: 'Temperature',
            value: `${telemetry.weatherConditions.temperature}°C`,
            sub: telemetry.weatherConditions.condition,
            color: 'text-cyber-amber',
            icon: () => <span className="text-lg">🌤️</span>,
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className="glass-panel p-4 text-center"
          >
            <p className="font-body text-xs text-slate-500 mb-1">{stat.label}</p>
            <p className={`font-display text-2xl font-bold ${stat.color} mb-0.5`}>{stat.value}</p>
            <p className="font-mono text-xs text-slate-600">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Gate Grid */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-white font-semibold text-base tracking-wide flex items-center gap-2">
              <div className="w-1 h-5 bg-teal-gradient rounded-full" />
              GATE TELEMETRY
              <span className="font-mono text-cyber-teal text-xs">({telemetry.gates.length} active)</span>
            </h2>
            <button
              onClick={refreshTelemetry}
              className="flex items-center gap-1.5 text-xs text-cyber-teal hover:text-white transition-colors font-mono border border-cyber-teal/30 hover:border-cyber-teal/60 rounded-lg px-3 py-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              REFRESH
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {telemetry.gates.map((gate, i) => (
              <GateCard key={gate.id} gate={gate} index={i} />
            ))}
          </div>
        </div>

        {/* Right column: Facilities + Security */}
        <div className="space-y-6">
          {/* Facilities */}
          <div className="space-y-3">
            <h2 className="font-display text-white font-semibold text-base tracking-wide flex items-center gap-2">
              <div className="w-1 h-5 bg-amber-gradient rounded-full" />
              FACILITIES
            </h2>
            <GlassPanel noPadding className="p-3 space-y-2">
              {telemetry.facilities.slice(0, 6).map(fac => (
                <FacilityRow key={fac.id} fac={fac} />
              ))}
            </GlassPanel>
          </div>

          {/* Security Zones */}
          <div className="space-y-3">
            <h2 className="font-display text-white font-semibold text-base tracking-wide flex items-center gap-2">
              <div className="w-1 h-5 bg-red-gradient rounded-full" />
              SECURITY ZONES
            </h2>
            <GlassPanel noPadding className="p-3 space-y-2">
              {telemetry.securityZones.map(zone => (
                <SecurityZoneIndicator key={zone.id} zone={zone} />
              ))}
            </GlassPanel>
          </div>
        </div>
      </div>
    </div>
  );
};
