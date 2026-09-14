import { useState, useEffect } from "react";
import { Users, Globe, Clock, MapPin, AlertTriangle, Radio, Map } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { AlertFeed } from "../components/volunteer/AlertFeed";
import { TranslationAssistant } from "../components/volunteer/TranslationAssistant";
import { StatusBadge } from "../components/ui/StatusBadge";
import { StadiumSeatMap } from "../components/stadium/StadiumSeatMap";

const ShiftCard = () => {
  const { userProfile } = useAppStore();
  const [, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(n => n + 1), 1000); return () => clearInterval(t); }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-full flex flex-col justify-between min-h-[170px]">
      <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-2">
        <Clock className="w-4 h-4 text-blue-600" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Deployment Shift</span>
      </div>
      <div className="space-y-2">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Steward Name</p>
          <p className="font-bold text-sm text-slate-900 truncate">{userProfile?.name}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Assigned Sector</p>
          <p className="text-xs font-semibold text-slate-800 capitalize">{userProfile?.zone || "All Concourse Zones"}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Shift Time</p>
          <p className="font-bold text-sm text-slate-900">
            {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </p>
        </div>
      </div>
    </div>
  );
};

const ZoneCard = () => {
  const { telemetry, userProfile } = useAppStore();
  const zone = userProfile?.zone ?? "all";

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-full flex flex-col min-h-[170px]">
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Monitored Zones</h3>
        </div>
        <StatusBadge status="warning" label={zone.substring(0, 10).toUpperCase()} size="sm" />
      </div>
      <div className="space-y-1.5 flex-1">
        {telemetry.securityZones.slice(0, 3).map(z => {
          const isCrit = z.riskLevel === 'red';
          const isWarn = z.riskLevel === 'orange';
          return (
            <div key={z.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                isCrit ? 'bg-red-600 animate-ping' : isWarn ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
              <span className="text-xs font-semibold text-slate-800 flex-1 truncate">{z.name}</span>
              <span className={`text-[10px] font-bold uppercase ${
                isCrit ? 'text-red-700' : isWarn ? 'text-amber-800' : 'text-emerald-700'
              }`}>{z.riskLevel}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MissionStats = () => {
  const { telemetry, aiAlerts } = useAppStore();
  const critAlerts = aiAlerts.filter(a => a.severity === "critical").length;
  const stats = [
    { value: critAlerts, label: "CRITICAL ALERTS", color: 'text-red-600' },
    { value: telemetry.activeIncidents, label: "ACTIVE INCIDENTS", color: 'text-amber-800' },
    { value: `${telemetry.overallPercentage}%`, label: "VENUE CAPACITY", color: 'text-blue-600' },
    { value: telemetry.medicalUnitsDeployed, label: "MED UNITS ON DUTY", color: 'text-emerald-600' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm min-h-[120px]">
      <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
        <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Concourse Field Status</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-slate-200/80 bg-slate-50 p-3 text-center">
            <p className={`text-xl font-extrabold ${s.color}`}>
              {s.value}
            </p>
            <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const LanguagesCard = () => {
  const { userProfile } = useAppStore();
  const langs = userProfile?.languages ?? ["English"];
  const langEmojis: Record<string, string> = { English:'🇬🇧', Spanish:'🇪🇸', French:'🇫🇷', Arabic:'🇸🇦', Hindi:'🇮🇳', Japanese:'🇯🇵', Mandarin:'🇨🇳', German:'🇩🇪' };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm min-h-[170px] flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
        <Globe className="w-4 h-4 text-blue-600" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Steward Languages</span>
      </div>
      <div className="flex flex-wrap gap-1.5 flex-1 items-start">
        {(langs.length > 0 ? langs : ["English"]).map((lang) => (
          <span key={lang}
            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700"
          >
            {langEmojis[lang] ?? '🌐'} {lang.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
};

export const VolunteerPage = () => {
  const { userProfile, aiAlerts } = useAppStore();
  const critCount = aiAlerts.filter(a => a.severity === "critical").length;
  const [activeTab, setActiveTab] = useState<'dashboard' | 'zonemap'>('dashboard');

  return (
    <div data-page="volunteer" className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 justify-between flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-xs">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Volunteer Operations Hub</h1>
            <p className="text-xs text-slate-500">Steward: {userProfile?.name} &bull; Concourse Coordination</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {critCount > 0 && (
            <div className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 border border-red-200 bg-red-50 text-red-700 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>{critCount} CRITICAL ALERT{critCount > 1 ? 'S' : ''} ACTIVE</span>
            </div>
          )}

          {/* Tab switcher */}
          <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === 'dashboard' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('zonemap')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === 'zonemap' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Zone Map</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'dashboard' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2"><ShiftCard /></div>
          <div className="lg:col-span-2"><ZoneCard /></div>
          <div className="lg:col-span-2"><LanguagesCard /></div>
          <div className="lg:col-span-6"><MissionStats /></div>
          <div className="lg:col-span-3">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm" style={{ minHeight: 480 }}>
              <AlertFeed />
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm overflow-y-auto" style={{ minHeight: 480 }}>
              <TranslationAssistant />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <StadiumSeatMap mode="volunteer" />
        </div>
      )}
    </div>
  );
};