import { Link, useNavigate } from 'react-router-dom';
import {
  Shield, Users, Ticket, ArrowRight,
  Activity, CheckCircle2, ChevronRight, Lock,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { PlayerShowcase } from '../components/fan/PlayerShowcase';
import { StadiumSeatMap } from '../components/stadium/StadiumSeatMap';

export const HomePage = () => {
  const { isAuthenticated, userProfile } = useAppStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base tracking-tight">StadiumSync</span>
              <span className="text-[10px] font-semibold text-blue-600 block -mt-1 uppercase tracking-wider">
                FIFA World Cup 2026 Ops
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#viewports" className="hover:text-blue-600 transition-colors">Operations Hubs</a>
            <a href="#seatmap" className="hover:text-blue-600 transition-colors">Seat Heatmap</a>
            <a href="#lineup" className="hover:text-blue-600 transition-colors">Squad Lineup</a>
            <a href="#metrics" className="hover:text-blue-600 transition-colors">Venue Metrics</a>
          </nav>

          <div>
            {isAuthenticated ? (
              <button
                onClick={() => navigate(`/${userProfile?.role}`)}
                className="btn-primary"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <Link to="/login" className="btn-primary">
                <Lock className="w-3.5 h-3.5" />
                <span>Portal Access</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 px-4 sm:px-6 bg-white border-b border-slate-200 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 mb-6 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Tournament Operations Platform &bull; MetLife Stadium, NJ</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-950 tracking-tight leading-[1.1] mb-6">
            Real-Time Stadium Operations &amp; Crowd Management
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Coordinating gate turnstile velocity, concourse bottle-neck detection, multilingual volunteer dispatch, and spectator wayfinding for 82,500 fans.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/login" className="btn-primary w-full sm:w-auto text-base px-6 py-3">
              <span>Launch Operations Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#seatmap" className="btn-secondary w-full sm:w-auto text-base px-6 py-3">
              <span>View Interactive Seat Map</span>
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div id="metrics" className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-10 border-t border-slate-100 text-left">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="text-2xl font-extrabold text-slate-900">82,500</p>
              <p className="text-xs font-semibold text-slate-500 uppercase mt-0.5 tracking-wider">Total Stadium Capacity</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="text-2xl font-extrabold text-blue-600">64</p>
              <p className="text-xs font-semibold text-slate-500 uppercase mt-0.5 tracking-wider">Tournament Matches</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="text-2xl font-extrabold text-emerald-600">8</p>
              <p className="text-xs font-semibold text-slate-500 uppercase mt-0.5 tracking-wider">Languages Supported</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="text-2xl font-extrabold text-indigo-600">&lt; 1s</p>
              <p className="text-xs font-semibold text-slate-500 uppercase mt-0.5 tracking-wider">Gate Sensor Latency</p>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Viewports */}
      <section id="viewports" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">Three Unified Viewports</p>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tailored Workspaces for Every Matchday Role</h2>
          <p className="text-sm text-slate-600 mt-2">
            Each portal focuses on the operational telemetry and decisions required for safe, smooth match execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Organizer */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-5">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Organizer Command Center</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Real-time occupancy metrics across all gates and tiers. Algorithmic bottleneck detection generates prioritized operational actions to balance turnstile flow.
              </p>
              <ul className="space-y-2 mb-6 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Concourse gate flow &amp; capacity telemetry</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Automated queue bottleneck mitigation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Security patrol &amp; medical unit tracking</span>
                </li>
              </ul>
            </div>
            <Link to="/login" className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors">
              <span>Access Command Center</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Volunteer */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-5">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Volunteer Co-Pilot</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Mobile-optimized assistant for field stewards. Receive zone alerts, queue clearance tasks, and instant translation across 8 languages with cultural guidelines.
              </p>
              <ul className="space-y-2 mb-6 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Live incident feed for assigned sector</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>8-language safety announcement dictionary</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Cultural sensitivity notes for global fans</span>
                </li>
              </ul>
            </div>
            <Link to="/login" className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-800 transition-colors">
              <span>Access Volunteer Portal</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Fan */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-5">
                <Ticket className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Fan Experience &amp; Wayfinding</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Smart gate routing that automatically diverts spectators away from congested entrances, with walking times, transit updates, and seat reservations.
              </p>
              <ul className="space-y-2 mb-6 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Turn-by-turn concourse routing to seat</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Dynamic avoidance of congested turnstiles</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Interactive tier-based SVG seat reservation</span>
                </li>
              </ul>
            </div>
            <Link to="/login" className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-800 transition-colors">
              <span>Access Fan Guide</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Stadium Seat Map */}
      <section id="seatmap" className="py-20 px-4 sm:px-6 bg-white border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Live Stadium Layout</p>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Interactive Seat Reservation &amp; Heatmap</h2>
            <p className="text-sm text-slate-600 mt-2">
              Explore stadium sections across VIP, Premium, Standard, and General Admission tiers. Click on any seat to reserve and test real-time concourse pathfinding.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
            <StadiumSeatMap mode="fan" />
          </div>
        </div>
      </section>

      {/* Lineup & Match Telemetry */}
      <section id="lineup" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <PlayerShowcase />
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-900 text-sm">StadiumSync</span>
            <span>&bull; FIFA World Cup 2026 Operations</span>
          </div>
          <p>&copy; {new Date().getFullYear()} StadiumSync. Built for high-density tournament venue coordination.</p>
        </div>
      </footer>
    </div>
  );
};

