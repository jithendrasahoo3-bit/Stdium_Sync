import { useState } from "react";
import { Ticket, Cloud, AlertTriangle, Star, Navigation, CheckCircle, Radio, LayoutGrid, Sparkles, Map } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { FanRouteCard } from "../components/fan/FanRouteCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import { PlayerShowcase } from "../components/fan/PlayerShowcase";
import { StadiumSeatMap } from "../components/stadium/StadiumSeatMap";

const MatchBanner = () => {
  const { telemetry } = useAppStore();
  const kickoff = new Date(telemetry.kickoffTime);
  const isLive = new Date() >= kickoff;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-full flex flex-col justify-between min-h-[160px]">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-[10px] font-bold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
              Live Match
            </span>
          ) : (
            <StatusBadge status="info" label="UPCOMING FIXTURE" size="sm" />
          )}
        </div>
        <span className="text-xs text-slate-500 font-medium truncate">{telemetry.stadiumName}</span>
      </div>
      <div>
        <h2 className="text-base font-bold text-slate-900 leading-tight">{telemetry.match}</h2>
        <p className="text-xs text-slate-500 mt-1">
          {kickoff.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} &bull;{' '}
          <span className="font-semibold text-blue-600">
            {kickoff.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} ET
          </span>
        </p>
      </div>
    </div>
  );
};

const AttendanceCard = () => {
  const { telemetry } = useAppStore();
  const pct = telemetry.overallPercentage;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-full flex flex-col justify-between min-h-[140px]">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Venue Attendance</p>
      <p className="text-2xl font-extrabold text-slate-900 leading-none">{pct}%</p>
      <p className="text-xs text-slate-500">{telemetry.currentOccupancy.toLocaleString()} fans in stadium</p>
      <div className="h-2 rounded-full overflow-hidden bg-slate-100 border border-slate-200 mt-1">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const WeatherCard = () => {
  const { telemetry } = useAppStore();

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-full flex flex-col justify-between min-h-[140px]">
      <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
        <Cloud className="w-4 h-4 text-amber-500" />
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pitch Conditions</p>
      </div>
      <div>
        <p className="text-2xl font-extrabold text-amber-700">{telemetry.weatherConditions.temperature}°C</p>
        <p className="text-xs text-slate-500 capitalize mt-0.5">{telemetry.weatherConditions.condition}</p>
      </div>
    </div>
  );
};

const BestGateCard = () => {
  const { telemetry } = useAppStore();
  const best = [...telemetry.gates].sort((a, b) => a.percentage - b.percentage)[0];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-full flex flex-col justify-between min-h-[140px]">
      <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
        <Navigation className="w-4 h-4 text-emerald-600" />
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lowest Wait Gate</p>
      </div>
      <div>
        <p className="text-xs font-bold text-slate-900 truncate">{best?.name.split("(")[0].trim()}</p>
        <p className="text-xl font-extrabold text-emerald-600 mt-0.5">{best?.percentage}% full</p>
      </div>
      <StatusBadge status="normal" label="FAST ENTRY" size="sm" />
    </div>
  );
};

const SeatCard = () => {
  const { userProfile } = useAppStore();

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-full flex flex-col justify-between min-h-[140px]">
      <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
        <Star className="w-4 h-4 text-blue-600" />
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Reserved Seat</p>
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900">{userProfile?.seatSection ? userProfile.seatSection.split(",")[0] : "General Admission"}</p>
        {userProfile?.seatSection && <p className="text-xs text-slate-500">{userProfile.seatSection.split(",").slice(1).join(",")}</p>}
        <p className="text-xs font-semibold text-blue-600 mt-1">{userProfile?.teamSupporting ? `Supporting ${userProfile.teamSupporting}` : "MetLife Stadium"}</p>
      </div>
    </div>
  );
};

const AlertSnapshotCard = () => {
  const { aiAlerts } = useAppStore();
  const critical = aiAlerts.filter(a => a.severity === "critical");
  const isCrit = critical.length > 0;

  return (
    <div className={`bg-white border rounded-xl p-5 shadow-sm flex flex-col justify-between min-h-[140px] ${
      isCrit ? 'border-red-200 bg-red-50/30' : 'border-slate-200'
    }`}>
      <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
        <AlertTriangle className={`w-4 h-4 ${isCrit ? "text-red-600" : "text-emerald-600"}`} />
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Turnstile Advisory</p>
      </div>
      <p className={`text-2xl font-extrabold ${isCrit ? 'text-red-600' : 'text-emerald-700'}`}>
        {isCrit ? `${critical.length} active alerts` : "No delays"}
      </p>
      <p className="text-xs text-slate-500">{isCrit ? "Gates congested, routing around" : "All entry gates running clear"}</p>
    </div>
  );
};

const TipsCard = () => {
  const tips = [
    "Arrive 90 minutes before kickoff to clear security without waiting",
    "Digital mobile tickets only &bull; keep your phone battery charged",
    "Clear bag policy: maximum 14&times;14 inches per guest",
    "ADA and stroller-friendly access is available at East Concourse Gate H",
    "Complimentary water refill stations on every level",
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-1.5 mb-3 border-b border-slate-100 pb-2">
        <CheckCircle className="w-4 h-4 text-emerald-600" />
        <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Matchday Guidelines</p>
      </div>
      <ul className="space-y-2 flex-1">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-slate-600 leading-snug">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
            <span dangerouslySetInnerHTML={{ __html: tip }} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const TransportCard = () => {
  const items = [
    { icon: "🚇", text: "NJ Transit — Meadowlands Station" },
    { icon: "🚌", text: "Free Shuttle from Secaucus Junction" },
    { icon: "🚗", text: "Lot P3 Parking OPEN (West)" },
    { icon: "🏥", text: "Medical Aid: 24 Stations Active" },
    { icon: "📍", text: "Guest Services: North Info Desk" },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-1.5 mb-4 border-b border-slate-100 pb-2">
        <Radio className="w-4 h-4 text-amber-500" />
        <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Stadium Transit &amp; Logistics</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-slate-200 bg-slate-50 text-center">
            <span className="text-xl">{item.icon}</span>
            <p className="text-xs text-slate-700 font-medium leading-tight">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const FanPage = () => {
  const { userProfile } = useAppStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'seats' | 'showcase'>('dashboard');

  return (
    <div data-page="fan" className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 justify-between flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Spectator Matchday Guide</h1>
            <p className="text-xs text-slate-500">Welcome, {userProfile?.name} &bull; MetLife Stadium, NJ</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === 'dashboard' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Guide</span>
          </button>
          <button
            onClick={() => setActiveTab('seats')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === 'seats' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Seat Map</span>
          </button>
          <button
            onClick={() => setActiveTab('showcase')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === 'showcase' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Lineup</span>
          </button>
        </div>
      </div>

      {activeTab === 'dashboard' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="col-span-2 lg:col-span-2"><MatchBanner /></div>
          <div className="col-span-1"><AttendanceCard /></div>
          <div className="col-span-1"><WeatherCard /></div>
          <div className="col-span-1"><BestGateCard /></div>
          <div className="col-span-1"><SeatCard /></div>

          <div className="col-span-2 md:col-span-3 lg:col-span-4">
            <FanRouteCard />
          </div>
          <div className="col-span-2 md:col-span-3 lg:col-span-2 flex flex-col gap-4">
            <AlertSnapshotCard />
            <TipsCard />
          </div>

          <div className="col-span-2 md:col-span-3 lg:col-span-6">
            <TransportCard />
          </div>
        </div>
      ) : activeTab === 'seats' ? (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <StadiumSeatMap mode="fan" />
        </div>
      ) : (
        <PlayerShowcase />
      )}
    </div>
  );
};