import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, Cloud, AlertTriangle, Star, Navigation, ThumbsUp, Radio, LayoutGrid, Sparkles, Map } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { FanRouteCard } from "../components/fan/FanRouteCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import { PlayerShowcase } from "../components/fan/PlayerShowcase";
import { StadiumSeatMap } from "../components/stadium/StadiumSeatMap";

const tile = {
  hidden: { opacity: 0, y: 15 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' } }),
};

const MatchBanner = () => {
  const { telemetry } = useAppStore();
  const kickoff = new Date(telemetry.kickoffTime);
  const isLive = new Date() >= kickoff;
  return (
    <div className="glass-panel p-5 h-full flex flex-col justify-between min-h-[160px] pop-card relative overflow-hidden">
      {/* Zero-G Goal Celebration Background */}
      <div className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-multiply pointer-events-none select-none"
        style={{ backgroundImage: `url("${import.meta.env.BASE_URL}images/goal_celebration.jpg")` }} />
      <div className="flex items-center gap-2 mb-2 relative z-10">
        {isLive ? (
          <div className="flex items-center gap-1 rounded-full px-2.5 py-0.5 border" style={{ backgroundColor: 'rgba(224,90,71,0.06)', borderColor: 'rgba(224,90,71,0.2)' }}>
            <span className="font-display text-cyber-red text-[9px] font-bold tracking-widest uppercase">LIVE NOW</span>
          </div>
        ) : <StatusBadge status="info" label="UPCOMING" />}
        <span className="font-mono text-slate-500 text-[9px] truncate">{telemetry.stadiumName}</span>
      </div>
      <div className="flex items-end justify-between relative z-10">
        <div>
          <p className="font-display text-[#4A3535] font-bold text-sm leading-tight">{telemetry.match}</p>
          <p className="font-mono text-slate-500 text-[9px] mt-1">{kickoff.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</p>
          <p className="font-display text-cyber-teal text-[10px] font-bold">{kickoff.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} ET</p>
        </div>
      </div>
    </div>
  );
};

const AttendanceCard = () => {
  const { telemetry } = useAppStore();
  const pct = telemetry.overallPercentage;
  return (
    <div className="glass-panel p-5 h-full flex flex-col justify-between min-h-[140px] pop-card">
      <p className="font-display text-[9px] text-theme-text-muted tracking-widest font-bold uppercase">VENUE LOAD</p>
      <p className="font-display text-2xl font-bold text-theme-text-dark leading-none">{pct}%</p>
      <p className="font-mono text-[9px] text-slate-500 font-bold">{telemetry.currentOccupancy.toLocaleString()} spectating</p>
      <div className="h-2 rounded-full overflow-hidden border border-glass-border mt-1" style={{ backgroundColor: 'rgba(255,209,209,0.3)' }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: '#6AB482' }} />
      </div>
    </div>
  );
};

const WeatherCard = () => {
  const { telemetry } = useAppStore();
  return (
    <div className="glass-panel p-5 h-full flex flex-col justify-between min-h-[140px] pop-card">
      <div className="flex items-center gap-1.5 border-b border-glass-border/30 pb-2"><Cloud className="w-3.5 h-3.5 text-cyber-amber" /><p className="font-display text-[9px] text-theme-text-muted font-bold uppercase">WEATHER</p></div>
      <div className="flex items-end gap-3">
        <div>
          <p className="font-display text-xl font-bold text-[#E09255]">{telemetry.weatherConditions.temperature}°C</p>
          <p className="font-body text-[10px] text-slate-500 capitalize font-bold">{telemetry.weatherConditions.condition}</p>
        </div>
      </div>
    </div>
  );
};

const BestGateCard = () => {
  const { telemetry } = useAppStore();
  const best = [...telemetry.gates].sort((a, b) => a.percentage - b.percentage)[0];
  return (
    <div className="glass-panel p-5 h-full flex flex-col justify-between min-h-[140px] pop-card">
      <div className="flex items-center gap-1.5 border-b border-glass-border/30 pb-2"><Navigation className="w-3.5 h-3.5 text-cyber-green" /><p className="font-display text-[9px] text-theme-text-muted font-bold uppercase">FASTEST GATE</p></div>
      <div>
        <p className="font-body text-xs text-[#4A3535] font-bold leading-tight">{best?.name.split("(")[0].trim()}</p>
        <p className="font-display text-xl font-bold text-cyber-green mt-1">{best?.percentage}% load</p>
      </div>
      <StatusBadge status="normal" label="OPEN" size="sm" />
    </div>
  );
};

const SeatCard = () => {
  const { userProfile } = useAppStore();
  return (
    <div className="glass-panel p-5 h-full flex flex-col justify-between min-h-[140px] pop-card relative overflow-hidden">
      {/* Holographic Player Card Portrait Background */}
      <div className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-multiply pointer-events-none select-none"
        style={{ backgroundImage: `url("${import.meta.env.BASE_URL}images/player_card_portrait.jpg")` }} />
      <div className="flex items-center gap-1.5 relative z-10 border-b border-glass-border/30 pb-2"><Star className="w-3.5 h-3.5 text-cyber-purple" /><p className="font-display text-[9px] text-theme-text-muted font-bold uppercase">YOUR SEAT</p></div>
      <div className="relative z-10 mt-1">
        <p className="font-display text-sm font-bold text-theme-text-dark">{userProfile?.seatSection ? userProfile.seatSection.split(",")[0] : "Not set"}</p>
        {userProfile?.seatSection && <p className="font-body text-[10px] text-slate-500">{userProfile.seatSection.split(",").slice(1).join(",")}</p>}
        <p className="font-mono text-[9px] text-slate-500 font-bold mt-1">{userProfile?.teamSupporting ? `${userProfile.teamSupporting.toUpperCase()}` : "MetLife Stadium"}</p>
      </div>
    </div>
  );
};

const AlertSnapshotCard = () => {
  const { aiAlerts } = useAppStore();
  const critical = aiAlerts.filter(a => a.severity === "critical");
  const isCrit = critical.length > 0;
  return (
    <div className={`glass-panel p-5 h-full flex flex-col justify-between min-h-[140px] pop-card`} style={isCrit ? { borderColor: 'rgba(224,90,71,0.3)' } : {}}>
      <div className="flex items-center gap-1.5 border-b border-glass-border/30 pb-2">
        <AlertTriangle className={`w-3.5 h-3.5 ${isCrit ? "text-cyber-red" : "text-cyber-green"}`} />
        <p className="font-display text-[9px] text-theme-text-muted font-bold uppercase">ALERT STATUS</p>
      </div>
      <p className="font-display text-2xl font-bold" style={{ color: isCrit ? '#E05A47' : '#6AB482' }}>
        {isCrit ? `${critical.length} active` : "0 alerts"}
      </p>
      <p className="font-mono text-[9px] text-slate-500 font-bold">{isCrit ? "Review safety guidelines" : "All sectors running clear"}</p>
    </div>
  );
};

const TipsCard = () => {
  const tips = ["Arrive 90 min before kickoff","Gate B (NE) — fastest entry now","Mobile tickets only · keep phone charged","No bags > 14×14 inches","ADA access: Gate H (East)","Hydration stations on all concourse levels"];
  return (
    <div className="glass-panel p-5 h-full flex flex-col pop-card">
      <div className="flex items-center gap-1.5 mb-3 border-b border-glass-border/30 pb-2">
        <ThumbsUp className="w-3.5 h-3.5 text-cyber-green" />
        <p className="font-display text-[9px] text-cyber-green tracking-widest font-bold uppercase">MATCHDAY INSTRUCTIONS</p>
      </div>
      <ul className="space-y-1.5 flex-1">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-slate-500 font-body font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-green flex-shrink-0 mt-1.5" />
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
};

const TransportCard = () => {
  const items = [
    { icon: "🚇", text: "NJ Transit — Meadowlands Station", color: '#FF9494' },
    { icon: "🚌", text: "Shuttle from Secaucus Junction", color: '#AB74C7' },
    { icon: "🚗", text: "Parking Lot P3 OPEN (West)", color: '#6AB482' },
    { icon: "🏥", text: "Medical: 24 units deployed", color: '#E05A47' },
    { icon: "📍", text: "Lost & Found: North Info Desk", color: '#E09255' },
  ];
  return (
    <div className="glass-panel p-5">
      <div className="flex items-center gap-1.5 mb-4 border-b border-glass-border/30 pb-2">
        <Radio className="w-4 h-4 text-cyber-amber animate-pulse" />
        <p className="font-display text-[9px] text-cyber-amber tracking-widest font-bold uppercase">LOGISTICS & TRANSPORT</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {items.map((item, i) => (
          <div key={i}
            className="flex flex-col items-center gap-2 p-3 rounded-lg border text-center cursor-default"
            style={{ borderColor: `${item.color}35`, background: `${item.color}05` }}
          >
            <span className="text-xl">{item.icon}</span>
            <p className="font-body text-[10px] text-slate-500 leading-tight font-bold">{item.text}</p>
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
    <motion.div data-page="fan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Executive Header */}
      <div className="flex items-center gap-3 justify-between flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-glass-bg flex items-center justify-center flex-shrink-0 border border-glass-border theme-border-color">
            <Ticket className="w-5 h-5 theme-text-color" />
          </div>
          <div>
            <h1 className="fan-title text-2xl">FAN EXPERIENCE</h1>
            <p className="fan-section-label text-theme-text-muted mt-0.5">Welcome, {userProfile?.name} · Personal Spectator Guide</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-cyber-blue/20 rounded-lg p-1 border border-glass-border">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md font-display text-[10px] font-bold transition-all ${
              activeTab === 'dashboard'
                ? 'theme-bg-color text-white shadow-sm'
                : 'text-theme-text-muted hover:text-theme-text-dark'
            }`}
            style={activeTab === 'dashboard' ? { backgroundColor: 'var(--theme-primary)' } : {}}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            DASHBOARD
          </button>
          <button
            onClick={() => setActiveTab('seats')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md font-display text-[10px] font-bold transition-all ${
              activeTab === 'seats'
                ? 'theme-bg-color text-white shadow-sm'
                : 'text-theme-text-muted hover:text-theme-text-dark'
            }`}
            style={activeTab === 'seats' ? { backgroundColor: 'var(--theme-primary)' } : {}}
          >
            <Map className="w-3.5 h-3.5" />
            BOOK SEATS
          </button>
          <button
            onClick={() => setActiveTab('showcase')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md font-display text-[10px] font-bold transition-all ${
              activeTab === 'showcase'
                ? 'theme-bg-color text-white shadow-sm'
                : 'text-theme-text-muted hover:text-theme-text-dark'
            }`}
            style={activeTab === 'showcase' ? { backgroundColor: 'var(--theme-primary)' } : {}}
          >
            <Sparkles className="w-3.5 h-3.5" />
            LINEUP
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            <div className="col-span-2 lg:col-span-2"><motion.div custom={0} variants={tile} initial="hidden" animate="show"><MatchBanner /></motion.div></div>
            <div className="col-span-1"><motion.div custom={1} variants={tile} initial="hidden" animate="show"><AttendanceCard /></motion.div></div>
            <div className="col-span-1"><motion.div custom={2} variants={tile} initial="hidden" animate="show"><WeatherCard /></motion.div></div>
            <div className="col-span-1"><motion.div custom={3} variants={tile} initial="hidden" animate="show"><BestGateCard /></motion.div></div>
            <div className="col-span-1"><motion.div custom={4} variants={tile} initial="hidden" animate="show"><SeatCard /></motion.div></div>

            <div className="col-span-2 md:col-span-3 lg:col-span-4">
              <motion.div custom={5} variants={tile} initial="hidden" animate="show" className="glass-panel p-5 min-h-[420px] pop-card">
                <FanRouteCard />
              </motion.div>
            </div>
            <div className="col-span-2 md:col-span-3 lg:col-span-2 flex flex-col gap-4">
              <motion.div custom={6} variants={tile} initial="hidden" animate="show"><AlertSnapshotCard /></motion.div>
              <motion.div custom={7} variants={tile} initial="hidden" animate="show"><TipsCard /></motion.div>
            </div>

            <div className="col-span-2 md:col-span-3 lg:col-span-6">
              <motion.div custom={8} variants={tile} initial="hidden" animate="show"><TransportCard /></motion.div>
            </div>
          </motion.div>
        ) : activeTab === 'seats' ? (
          <motion.div
            key="seats"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="glass-panel p-5 pop-card"
          >
            <StadiumSeatMap mode="fan" />
          </motion.div>
        ) : (
          <motion.div
            key="showcase"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <PlayerShowcase />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};