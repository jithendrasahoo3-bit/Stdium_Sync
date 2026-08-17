/**
 * ============================================================
 * APP NAVIGATION BAR COMPONENT — Application Header
 * ============================================================
 * 
 * File: components/layout/AppNavBar.tsx
 * Purpose: Top navigation bar for authenticated users displaying
 * current role, telemetry status, theme switcher, and logout.
 * 
 * Features:
 *   - Role-based navigation labels (Command Center, Copilot, Fan)
 *   - Real-time telemetry stats and last refresh time
 *   - Theme switcher with 6 country/team options
 *   - User profile display
 *   - Logout functionality with navigation
 *   - Responsive design with grid layout
 * 
 * Data Displayed:
 *   - Stadium occupancy percentage
 *   - Active incidents count
 *   - Last telemetry refresh time
 *   - Current user name and role
 *   - Selected theme/country
n */

import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, LogOut, User, Shield, Users, Ticket, Wifi } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

/**
 * ROLE_NAV Configuration
 * Maps user roles to their navigation labels, icons, and theme colors
 */
const ROLE_NAV = {
  organizer: { label: 'Command Center', icon: Shield, color: 'var(--theme-primary)', bg: 'bg-teal-gradient' },
  volunteer: { label: 'Volunteer Copilot', icon: Users, color: 'var(--theme-primary)', bg: 'bg-amber-gradient' },
  fan: { label: 'Fan Experience', icon: Ticket, color: 'var(--theme-primary)', bg: 'bg-green-gradient' },
};

/**
 * COUNTRIES Configuration
 * Available theme options showing country flag and display label
 */
const COUNTRIES = [
  { name: 'default', flag: '🌐', label: 'Default' },
  { name: 'Portugal', flag: '🇵🇹', label: 'Portugal' },
  { name: 'Argentina', flag: '🇦🇷', label: 'Argentina' },
  { name: 'Brazil', flag: '🇧🇷', label: 'Brazil' },
  { name: 'France', flag: '🇫🇷', label: 'France' },
  { name: 'USA', flag: '🇺🇸', label: 'USA' },
];

/**
 * AppNavBar Component
 * Main navigation bar for authenticated pages
 */
export const AppNavBar = () => {
  const { userProfile, logout, telemetry, lastRefreshed, activeTheme, setActiveTheme } = useAppStore();
  const navigate = useNavigate();

  // Handle logout - clear auth and redirect to home
  const handleLogout = () => { logout(); navigate('/'); };
  const role = userProfile?.role ?? 'fan';
  const cfg = ROLE_NAV[role];
  const Icon = cfg.icon;

  // Format last refresh time for display
  const refreshedTime = new Date(lastRefreshed).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 backdrop-blur-xl border-b border-glass-border"
        style={{ background: 'rgba(255,245,228,0.92)' }} />
      <div className="relative max-w-[1600px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`w-8 h-8 rounded-lg bg-glass-bg flex items-center justify-center border theme-border-color`}>
              <Activity className="w-4 h-4 theme-text-color" />
            </div>
            <div>
              <p className="font-display text-theme-text-dark font-bold text-sm leading-none tracking-tight">StadiumSync</p>
              <p className="font-mono text-theme-text-muted text-[8px] tracking-widest font-bold">2026 ◆ FIFA WORLD CUP</p>
            </div>
          </Link>

          {/* Centre: role + live status */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-glass-border theme-bg-glow">
              <Icon className="w-3.5 h-3.5 theme-text-color" />
              <span className="font-display text-[10px] font-bold theme-text-color">{cfg.label.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-glass-border px-3 py-1"
              style={{ backgroundColor: 'rgba(106,180,130,0.06)' }}>
              <Wifi className="w-3.5 h-3.5 text-cyber-green animate-pulse" />
              <span className="font-display text-[10px] font-bold text-cyber-green">
                {telemetry.overallPercentage}% LIVE
              </span>
            </div>
          </div>

          {/* Right: Dynamic Team Theme Selector + User + Logout */}
          <div className="flex items-center gap-3">
            {/* National Team Switcher circles */}
            <div className="flex items-center gap-1 border border-glass-border rounded-lg p-1 bg-glass-bg">
              {COUNTRIES.map(c => (
                <button
                  key={c.name}
                  onClick={() => setActiveTheme(c.name)}
                  title={`Switch theme: ${c.label}`}
                  aria-label={`Switch theme to ${c.label}`}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                    activeTheme === c.name 
                      ? 'bg-glass-bg border border-theme-primary scale-110 shadow-sm' 
                      : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  {c.flag}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 rounded-lg border border-glass-border px-3 py-1 theme-bg-glow">
              <User className="w-3.5 h-3.5 theme-text-color" />
              <span className="font-display text-[10px] font-bold text-theme-text-dark hidden sm:block">{userProfile?.name ?? 'Guest'}</span>
            </div>
            <motion.button
              onClick={handleLogout}
              whileHover={{ translateY: -1 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Logout"
              className="flex items-center gap-1 px-3 py-1 rounded-lg border text-xs font-semibold text-cyber-red transition-all"
              style={{ borderColor: 'rgba(224,90,71,0.2)', backgroundColor: 'rgba(224,90,71,0.05)' }}
            >
              <LogOut className="w-3 h-3" />
              <span className="hidden sm:inline">Exit</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Subtle bottom line */}
      <div className="relative border-b border-glass-border px-6 py-1 overflow-hidden bg-glass-bg">
        <div className="relative max-w-[1600px] mx-auto flex items-center gap-3 text-[8px] font-display text-theme-text-muted">
          <span className="font-bold theme-text-color">{telemetry.stadiumName}</span>
          <span>·</span>
          <span className="font-bold">{telemetry.match}</span>
          <span className="ml-auto font-bold">Telemetry Refreshed {refreshedTime}</span>
        </div>
      </div>
    </header>
  );
};