import { RefreshCw, TrendingUp, TrendingDown, Minus, AlertTriangle, Users, HeartPulse, Thermometer } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { StatusBadge } from '../ui/StatusBadge';
import type { GateTelemetry, FacilityTelemetry, SecurityZone } from '../../types';

const CapacityRing = ({ percentage, status }: { percentage: number; status: string }) => {
  const color =
    status === 'critical'
      ? '#ef4444' // Red
      : status === 'high'
      ? '#f59e0b' // Amber
      : status === 'moderate'
      ? '#6366f1' // Indigo
      : '#10b981'; // Emerald

  const r = 24;
  const circ = 2 * Math.PI * r;
  const dash = (percentage / 100) * circ;

  return (
    <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r={r} fill="none" stroke="#e2e8f0" strokeWidth="5" />
        <circle
          cx="30"
          cy="30"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <span className="absolute text-xs font-bold text-slate-800">{percentage}%</span>
    </div>
  );
};

const GateCard = ({ gate }: { gate: GateTelemetry }) => {
  const TrendIcon = gate.trend === 'rising' ? TrendingUp : gate.trend === 'falling' ? TrendingDown : Minus;
  const trendColor =
    gate.trend === 'rising'
      ? 'text-red-600'
      : gate.trend === 'falling'
      ? 'text-emerald-600'
      : 'text-slate-400';

  const barColor =
    gate.status === 'critical'
      ? 'bg-red-500'
      : gate.status === 'high'
      ? 'bg-amber-500'
      : gate.status === 'moderate'
      ? 'bg-indigo-500'
      : 'bg-emerald-500';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-300 transition-all">
      <div className="flex items-start gap-3">
        <CapacityRing percentage={gate.percentage} status={gate.status} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 text-sm truncate">{gate.name}</h3>
            <StatusBadge status={gate.status} size="sm" pulse={gate.status === 'critical'} />
          </div>
          <p className="text-xs text-slate-500 mb-2 truncate">{gate.location}</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              {gate.current.toLocaleString()} / <span className="text-slate-400">{gate.capacity.toLocaleString()}</span>
            </span>
            <div className={`flex items-center gap-1 font-semibold ${trendColor}`}>
              <TrendIcon className="w-3 h-3" />
              <span className="capitalize">{gate.trend}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${gate.percentage}%` }} />
      </div>
    </div>
  );
};

const FacilityRow = ({ fac }: { fac: FacilityTelemetry }) => {
  const typeIcon = fac.type === 'restroom' ? '🚻' : fac.type === 'concession' ? '🍔' : fac.type === 'medical' ? '🏥' : '🅿️';

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
      <span className="text-lg flex-shrink-0">{typeIcon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 truncate">{fac.name}</p>
        <p className="text-xs text-slate-500">
          {fac.zone} &bull; Queue: <span className="font-semibold text-slate-700">{fac.queueLength}</span>
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <StatusBadge
          status={fac.operationalStatus === 'overloaded' ? 'critical' : fac.operationalStatus === 'busy' ? 'warning' : 'normal'}
          label={fac.operationalStatus.toUpperCase()}
          size="sm"
        />
        <span className="text-xs font-semibold text-slate-600">{fac.occupancyPercentage}% full</span>
      </div>
    </div>
  );
};

const SecurityZoneIndicator = ({ zone }: { zone: SecurityZone }) => {
  const badgeStyles = {
    red: 'bg-red-50 text-red-700 border-red-200',
    orange: 'bg-amber-50 text-amber-700 border-amber-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-white">
      <div
        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
          zone.riskLevel === 'red' ? 'bg-red-500 animate-ping' : zone.riskLevel === 'orange' ? 'bg-amber-500' : 'bg-emerald-500'
        }`}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 truncate">{zone.name}</p>
        <p className="text-xs text-slate-500">
          {zone.crowdDensity} p/m² &bull; {zone.patrolUnits} patrols on site
        </p>
      </div>
      <div className="text-right">
        <span className={`px-2 py-0.5 rounded text-[11px] font-bold border uppercase ${badgeStyles[zone.riskLevel]}`}>
          {zone.riskLevel}
        </span>
        {zone.incidentCount > 0 && (
          <p className="text-[11px] text-red-600 font-semibold mt-0.5">{zone.incidentCount} incidents</p>
        )}
      </div>
    </div>
  );
};

export const TelemetryGrid = () => {
  const { telemetry, refreshTelemetry } = useAppStore();

  return (
    <div className="space-y-6">
      {/* Top metrics summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Attendance</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{telemetry.overallPercentage}%</p>
          <p className="text-xs text-slate-500 mt-1">
            {telemetry.currentOccupancy.toLocaleString()} / {telemetry.totalCapacity.toLocaleString()}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Active Incidents</span>
            <AlertTriangle className={`w-4 h-4 ${telemetry.activeIncidents > 4 ? 'text-red-500' : 'text-amber-500'}`} />
          </div>
          <p className={`text-2xl font-bold ${telemetry.activeIncidents > 4 ? 'text-red-600' : 'text-slate-900'}`}>
            {telemetry.activeIncidents}
          </p>
          <p className="text-xs text-slate-500 mt-1">Across all concourse zones</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Medical Units</span>
            <HeartPulse className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{telemetry.medicalUnitsDeployed}</p>
          <p className="text-xs text-slate-500 mt-1">Stations staffed &amp; equipped</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Pitch Weather</span>
            <Thermometer className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{telemetry.weatherConditions.temperature}°C</p>
          <p className="text-xs text-slate-500 mt-1">{telemetry.weatherConditions.condition}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Gates Section */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Gate Ingress Monitoring</h2>
              <p className="text-xs text-slate-500">Live turnstile throughput and queue volume</p>
            </div>
            <button
              type="button"
              onClick={refreshTelemetry}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Refresh Sensor Data</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {telemetry.gates.map((gate) => (
              <GateCard key={gate.id} gate={gate} />
            ))}
          </div>
        </div>

        {/* Facilities & Security Section */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">
              Concourse Facilities
            </h2>
            <div className="space-y-2">
              {telemetry.facilities.slice(0, 5).map((fac) => (
                <FacilityRow key={fac.id} fac={fac} />
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">
              Security Patrol Sectors
            </h2>
            <div className="space-y-2">
              {telemetry.securityZones.map((zone) => (
                <SecurityZoneIndicator key={zone.id} zone={zone} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
