import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Globe, Clock, MapPin, AlertTriangle, Radio, Map } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { AlertFeed } from "../components/volunteer/AlertFeed";
import { TranslationAssistant } from "../components/volunteer/TranslationAssistant";
import { StatusBadge } from "../components/ui/StatusBadge";
import { StadiumSeatMap } from "../components/stadium/StadiumSeatMap";

const tile = {
  hidden: { opacity: 0, y: 15 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' } }),
};

const ShiftCard = () => {
  const { userProfile } = useAppStore();
  const [, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(n => n + 1), 1000); return () => clearInterval(t); }, []);
  return (
    <div className="glass-panel p-5 h-full flex flex-col justify-between min-h-[170px] pop-card">
      <div className="flex items-center gap-2 mb-2 border-b border-glass-border/30 pb-2">
        <Clock className="w-4 h-4 text-cyber-purple" />
        <span className="vol-section-label text-cyber-purple">SHIFT INFO</span>
      </div>
      <div className="space-y-2">
        <div>
          <p className="vol-section-label text-slate-500">DEPLOYMENT PROFILE</p>
          <p className="font-display text-sm text-theme-text-dark font-bold truncate">{userProfile?.name}</p>
        </div>
        <div>
          <p className="vol-section-label text-slate-500">SECTOR AREA</p>
          <p className="font-body text-xs text-theme-text-dark font-bold capitalize">{userProfile?.zone || "All Zones"}</p>
        </div>
        <div>
          <p className="vol-section-label text-slate-500">CONSOLE TIMESTAMP</p>
          <p className="font-display text-sm font-bold text-theme-text-dark">
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
  const colors: Record<string, { dot: string; text: string; border: string; bg: string }> = {
    red: { dot: "bg-cyber-red", text: "text-cyber-red", border: "border-cyber-red/35", bg: "bg-cyber-red/5" },
    orange: { dot: "bg-cyber-amber", text: "text-cyber-amber", border: "border-cyber-amber/35", bg: "bg-cyber-amber/5" },
    yellow: { dot: "bg-yellow-500", text: "text-yellow-600", border: "border-yellow-500/35", bg: "bg-yellow-500/5" },
    green: { dot: "bg-cyber-green", text: "text-cyber-green", border: "border-cyber-green/35", bg: "bg-cyber-green/5" },
  };
  return (
    <div className="glass-panel p-5 h-full flex flex-col min-h-[170px] pop-card">
      <div className="flex items-center gap-2 mb-3 border-b border-glass-border/30 pb-2">
        <MapPin className="w-4 h-4 text-cyber-amber" />
        <h3 className="vol-section-label text-theme-text-dark uppercase">MONITORED REGION</h3>
        <StatusBadge status="warning" label={zone.substring(0, 8).toUpperCase()} size="sm" />
      </div>
      <div className="space-y-1.5 flex-1">
        {telemetry.securityZones.slice(0, 3).map(z => {
          const c = colors[z.riskLevel] ?? colors.green;
          return (
            <div key={z.id} className={`flex items-center gap-2 p-2 rounded-lg border ${c.border} ${c.bg} cursor-default`}>
              <div className={`w-2 h-2 rounded-full ${c.dot} ${z.riskLevel === "red" ? 'animate-pulse' : ''}`} />
              <span className="font-body text-xs text-slate-500 flex-1 truncate font-bold">{z.name}</span>
              <span className={`font-display text-[9px] font-bold ${c.text} uppercase`}>{z.riskLevel}</span>
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
    { value: critAlerts, label: "CRITICAL ALERTS", color: '#E05A47', bg: 'rgba(224,90,71,0.05)', border: 'rgba(224,90,71,0.2)' },
    { value: telemetry.activeIncidents, label: "INCIDENTS REPORTED", color: '#E09255', bg: 'rgba(224,146,85,0.05)', border: 'rgba(224,146,85,0.2)' },
    { value: `${telemetry.overallPercentage}%`, label: "VENUE CAPACITY", color: '#FF9494', bg: 'rgba(255,148,148,0.05)', border: 'rgba(255,148,148,0.2)' },
    { value: telemetry.medicalUnitsDeployed, label: "MED UNITS ACTIVE", color: '#6AB482', bg: 'rgba(106,180,130,0.05)', border: 'rgba(106,180,130,0.2)' },
  ];
  return (
    <div className="glass-panel p-5 min-h-[120px] pop-card">
      <div className="flex items-center gap-2 mb-3 border-b border-glass-border/30 pb-2">
        <Radio className="w-4 h-4 text-cyber-green animate-pulse" />
        <span className="font-display text-[10px] text-cyber-green tracking-widest font-bold">MISSION CONSOLE METRICS</span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label}
            className="rounded-lg border p-3 text-center cursor-default"
            style={{ backgroundColor: s.bg, borderColor: s.border }}
          >
            <p className="font-display text-xl font-bold" style={{ color: s.color }}>
              {s.value}
            </p>
            <p className="font-mono text-[8px] text-slate-500 mt-1 font-bold">{s.label}</p>
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
    <div className="glass-panel p-5 min-h-[170px] pop-card">
      <div className="flex items-center gap-2 mb-3 border-b border-glass-border/30 pb-2">
        <Globe className="w-4 h-4 text-cyber-amber" />
        <span className="font-display text-[10px] text-cyber-amber tracking-widest font-bold">INTERPRETATION ASSISTANT</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {(langs.length > 0 ? langs : ["English"]).map((lang) => (
          <span key={lang}
            className="px-2.5 py-1 rounded-lg border text-xs font-semibold cursor-default bg-glass-bg border-glass-border"
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
    <motion.div data-page="volunteer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Executive Header */}
      <div className="flex items-center gap-3 justify-between flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-glass-bg flex items-center justify-center flex-shrink-0 border border-glass-border theme-border-color">
            <Users className="w-5 h-5 theme-text-color" />
          </div>
          <div>
            <h1 className="vol-title text-2xl text-theme-text-dark">VOLUNTEER COPILOT</h1>
            <p className="vol-section-label text-theme-text-muted mt-0.5">Welcome, {userProfile?.name} · Field Operations Console</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {critCount > 0 && (
            <div className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 border"
              style={{ backgroundColor: 'rgba(224,90,71,0.06)', borderColor: 'rgba(224,90,71,0.2)' }}
            >
              <AlertTriangle className="w-4 h-4 text-cyber-red animate-pulse" />
              <span className="font-display text-cyber-red text-[10px] font-bold uppercase">{critCount} CRITICAL ALERT{critCount > 1 ? 'S' : ''} ACTIVE</span>
            </div>
          )}
          {/* Tab switcher */}
          <div className="flex bg-cyber-blue/20 rounded-lg p-1 border border-glass-border">
            <button onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-display text-[10px] font-bold transition-all ${
                activeTab === 'dashboard' ? 'text-white shadow-sm' : 'text-theme-text-muted hover:text-theme-text-dark'
              }`}
              style={activeTab === 'dashboard' ? { backgroundColor: 'var(--theme-primary)' } : {}}>
              <Radio className="w-3.5 h-3.5" /> DASHBOARD
            </button>
            <button onClick={() => setActiveTab('zonemap')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-display text-[10px] font-bold transition-all ${
                activeTab === 'zonemap' ? 'text-white shadow-sm' : 'text-theme-text-muted hover:text-theme-text-dark'
              }`}
              style={activeTab === 'zonemap' ? { backgroundColor: 'var(--theme-primary)' } : {}}>
              <Map className="w-3.5 h-3.5" /> ZONE MAP
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'dashboard' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2"><motion.div custom={0} variants={tile} initial="hidden" animate="show" className="h-full"><ShiftCard /></motion.div></div>
          <div className="lg:col-span-2"><motion.div custom={1} variants={tile} initial="hidden" animate="show" className="h-full"><ZoneCard /></motion.div></div>
          <div className="lg:col-span-2"><motion.div custom={2} variants={tile} initial="hidden" animate="show" className="h-full"><LanguagesCard /></motion.div></div>
          <div className="lg:col-span-6"><motion.div custom={3} variants={tile} initial="hidden" animate="show"><MissionStats /></motion.div></div>
          <div className="lg:col-span-3">
            <motion.div custom={4} variants={tile} initial="hidden" animate="show" className="glass-panel p-5 pop-card" style={{ minHeight: 480 }}>
              <AlertFeed />
            </motion.div>
          </div>
          <div className="lg:col-span-3">
            <motion.div custom={5} variants={tile} initial="hidden" animate="show" className="glass-panel p-5 pop-card overflow-y-auto" style={{ minHeight: 480 }}>
              <TranslationAssistant />
            </motion.div>
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
          className="glass-panel p-5 pop-card">
          <StadiumSeatMap mode="volunteer" />
        </motion.div>
      )}
    </motion.div>
  );
};