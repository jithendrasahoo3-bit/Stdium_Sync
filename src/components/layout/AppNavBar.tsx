import { Link, useNavigate } from 'react-router-dom';
import { Activity, LogOut, User, Shield, Users, Ticket, Wifi } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const ROLE_NAV = {
  organizer: { label: 'Command Center', icon: Shield, badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  volunteer: { label: 'Volunteer Copilot', icon: Users, badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  fan: { label: 'Fan Guide', icon: Ticket, badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

const TEAMS = [
  { name: 'default', flag: '⚽', label: 'Match Theme' },
  { name: 'Portugal', flag: '🇵🇹', label: 'Portugal' },
  { name: 'Argentina', flag: '🇦🇷', label: 'Argentina' },
  { name: 'Brazil', flag: '🇧🇷', label: 'Brazil' },
  { name: 'France', flag: '🇫🇷', label: 'France' },
  { name: 'USA', flag: '🇺🇸', label: 'USA' },
];

export const AppNavBar = () => {
  const { userProfile, logout, telemetry, lastRefreshed, activeTheme, setActiveTheme } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const role = userProfile?.role ?? 'fan';
  const cfg = ROLE_NAV[role];
  const RoleIcon = cfg.icon;

  const refreshedTime = new Date(lastRefreshed).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-base leading-tight tracking-tight">StadiumSync</p>
              <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Match Operations 2026</p>
            </div>
          </Link>

          {/* Center stats */}
          <div className="hidden md:flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${cfg.badge}`}>
              <RoleIcon className="w-3.5 h-3.5" />
              <span>{cfg.label}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <Wifi className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>{telemetry.overallPercentage}% Ingress Active</span>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Team theme pills */}
            <div className="flex items-center gap-1 border border-slate-200 rounded-full p-1 bg-slate-50">
              {TEAMS.map((t) => (
                <button
                  type="button"
                  key={t.name}
                  onClick={() => setActiveTheme(t.name)}
                  title={`Select ${t.label} palette`}
                  aria-label={`Select ${t.label} palette`}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${
                    activeTheme === t.name
                      ? 'bg-white shadow-sm border border-slate-300 scale-110'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  {t.flag}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 bg-slate-50 text-xs font-medium text-slate-700">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">{userProfile?.name ?? 'Guest Operator'}</span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Info Sub-bar */}
      <div className="border-t border-slate-100 bg-slate-50/80 px-4 sm:px-6 py-1.5 text-xs text-slate-600">
        <div className="max-w-[1600px] mx-auto flex items-center gap-3 text-[11px]">
          <span className="font-semibold text-slate-900">{telemetry.stadiumName}</span>
          <span>&bull;</span>
          <span>{telemetry.match}</span>
          <span className="ml-auto text-slate-400">Telemetry updated: {refreshedTime}</span>
        </div>
      </div>
    </header>
  );
};