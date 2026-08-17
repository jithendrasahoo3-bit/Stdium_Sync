import { motion } from 'framer-motion';
import { Shield, Users, Ticket, Activity, Wifi, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { Role } from '../../types';

const ROLES: { id: Role; label: string; icon: typeof Shield; description: string }[] = [
  { id: 'organizer', label: 'Organizer', icon: Shield, description: 'Command Center' },
  { id: 'volunteer', label: 'Volunteer', icon: Users, description: 'Field Operations' },
  { id: 'fan', label: 'Fan', icon: Ticket, description: 'My Experience' },
];

export const NavBar = () => {
  const { activeRole, setActiveRole, telemetry, lastRefreshed } = useAppStore();

  const refreshedTime = new Date(lastRefreshed).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Background */}
      <div className="absolute inset-0 bg-cyber-dark/90 backdrop-blur-xl border-b border-glass-border" />
      
      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-teal-gradient flex items-center justify-center shadow-cyber">
                <Activity className="w-5 h-5 text-cyber-dark" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyber-green animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <p className="font-display text-white font-bold text-lg leading-none tracking-wider">StadiumSync</p>
              <p className="font-mono text-cyber-teal text-xs tracking-widest">2026 ◆ FIFA WORLD CUP</p>
            </div>
          </motion.div>

          {/* Role Switcher */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center bg-cyber-blue/50 rounded-xl p-1 border border-glass-border"
          >
            {ROLES.map(role => {
              const Icon = role.icon;
              const isActive = activeRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setActiveRole(role.id)}
                  aria-label={`Switch to ${role.label} view`}
                  className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-body font-semibold transition-all duration-200 ${
                    isActive
                      ? 'text-cyber-dark'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeRoleIndicator"
                      className="absolute inset-0 bg-teal-gradient rounded-lg shadow-cyber"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10 hidden sm:inline">{role.label}</span>
                </button>
              );
            })}
          </motion.nav>

          {/* Live Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="hidden md:flex flex-col items-end">
              <p className="font-body text-xs text-slate-400">{telemetry.match}</p>
              <p className="font-mono text-cyber-green text-xs flex items-center gap-1">
                <Wifi className="w-3 h-3" />
                LIVE · {refreshedTime}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-cyber-green/10 border border-cyber-green/20 rounded-lg px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
              <span className="font-mono text-cyber-green text-xs font-semibold">
                {telemetry.overallPercentage}% FULL
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sub-header for current role context */}
      <div className="relative bg-cyber-navy/60 border-b border-glass-border/50 px-4 sm:px-6 py-1.5">
        <div className="max-w-[1600px] mx-auto flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span className="text-cyber-teal">StadiumSync</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-300">{ROLES.find(r => r.id === activeRole)?.label}</span>
          <ChevronRight className="w-3 h-3" />
          <span>{ROLES.find(r => r.id === activeRole)?.description}</span>
          <span className="ml-auto text-slate-600">{telemetry.stadiumName} · {telemetry.match}</span>
        </div>
      </div>
    </header>
  );
};
