
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Activity, Shield, Users, Ticket, Brain, Globe,
  ArrowRight, ChevronDown, Zap, Radio, Star, Lock,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { PlayerShowcase } from '../components/fan/PlayerShowcase';
import { StadiumSeatMap } from '../components/stadium/StadiumSeatMap';

const RAINBOW = ['#E06B6B','#AB74C7','#6AB482','#E09255','#E05A47'];
const HexCard = ({
  title, description, href, color, delay, flag,
}: {
  icon: typeof Shield; title: string; description: string;
  href: string; color: string; delay: number; flag: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.4, ease: 'easeOut' }}
    className="group relative"
  >
    <Link to={href}>
      <motion.div
        className="relative overflow-hidden rounded-xl border bg-[#FFE3E1]/40 flex flex-col items-center justify-center p-6 text-center min-h-[200px] cursor-pointer pop-card"
        style={{ borderColor: 'rgba(255,148,148,0.2)' }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-3xl mb-3">{flag}</span>
        <h3 className="font-display font-semibold text-sm text-theme-text-dark mb-1 tracking-wide">{title}</h3>
        <p className="font-body text-theme-text-muted text-xs leading-relaxed font-bold">{description}</p>
        <div className="mt-3 flex items-center gap-1 text-[10px] font-display font-semibold text-theme-text-muted opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }}>
          Access Portal <ArrowRight className="w-3 h-3" />
        </div>
      </motion.div>
    </Link>
  </motion.div>
);
// It is a stat itaem compomnent the 
const StatItem = ({ value, label, color, flag, delay }: { value: string; label: string; color: string; flag: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.4 }}
    className="text-center cursor-default"
  >
    <div className="text-2xl mb-1">{flag}</div>
    <p className="font-display text-3xl font-bold mb-0.5 leading-none" style={{ color }}>{value}</p>
    <p className="font-display text-theme-text-muted text-[10px] tracking-wider uppercase font-bold">{label}</p>
  </motion.div>
);
// it is a feature row component that displays 
const FeatureRow = ({ icon: Icon, title, desc, color, delay }: {
  icon: typeof Brain; title: string; desc: string; color: string; delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.3 }}
    className="flex items-start gap-4 group cursor-default"
  >
    <div
      className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center border border-glass-border bg-glass-bg"
      style={{ boxShadow: '0 2px 8px rgba(74,53,53,0.03)' }}
    >
      <Icon className="w-4 h-4" style={{ color }} />
    </div>
    <div>
      <p className="font-display font-semibold text-theme-text-dark text-xs mb-0.5 tracking-wide">{title}</p>
      <p className="font-body text-theme-text-muted text-xs leading-relaxed font-bold">{desc}</p>
    </div>
  </motion.div>
);

export const HomePage = () => {
  const { isAuthenticated, userProfile } = useAppStore();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 80]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const [colorIdx, setColorIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setColorIdx(i => (i + 1) % RAINBOW.length), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="home-page bg-[#FFF5E4] min-h-screen overflow-x-hidden text-theme-text-dark">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 backdrop-blur-xl border-b border-glass-border" style={{ background: 'rgba(255,245,228,0.92)' }} />
        <div className="relative max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-gradient flex items-center justify-center border border-[#4A3535]">
              <Activity className="w-4 h-4 text-cyber-dark" />
            </div>
            <span className="hero-title-word text-theme-text-dark text-sm">StadiumSync</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['ABOUT US', 'SERVICES', 'BOOK TICKETS'].map((item, i) => (
              <a key={item} href={item === 'BOOK TICKETS' ? '#booking' : '#features'}
                className="font-display text-xs text-theme-text-muted font-bold tracking-widest transition-colors hover:text-theme-text-dark"
                onMouseEnter={e => (e.currentTarget.style.color = RAINBOW[i % RAINBOW.length])}
                onMouseLeave={e => (e.currentTarget.style.color = '')}
              >{item}</a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate(`/${userProfile?.role}`)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-display font-semibold text-xs border border-glass-border bg-glass-bg hover:bg-glass-bg/80 text-theme-text-dark"
              >DASHBOARD <ArrowRight className="w-3.5 h-3.5" /></button>
            ) : (
              <Link to="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border font-display font-semibold text-xs transition-all bg-glass-bg border-glass-border hover:border-cyber-teal-dim/40 text-theme-text-dark"
              >
                <Lock className="w-3.5 h-3.5" /> ACCESS PORTAL
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-multiply pointer-events-none select-none"
            style={{ backgroundImage: `url("${import.meta.env.BASE_URL}images/hero_stadium_floating.jpg")` }} />
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,148,148,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,148,148,0.02) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          {/* Live badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border"
            style={{ background: 'rgba(255,148,148,0.08)', borderColor: 'rgba(255,148,148,0.2)' }}
          >
            <span className="w-2 h-2 rounded-full bg-cyber-green" />
            <span className="font-display text-[10px] tracking-wider font-semibold uppercase" style={{ color: RAINBOW[colorIdx] }}>
              Live · FIFA World Cup 2026 Operations
            </span>
          </div>

          {/* Premium Title */}
          <h1 className="leading-none mb-6">
            <span className="block text-5xl sm:text-7xl md:text-8xl hero-title-word hero-title-outline">Stadium</span>
            <span className="block text-5xl sm:text-7xl md:text-8xl hero-title-word hero-title-gradient mt-1">Intelligence</span>
          </h1>

          <p className="hero-sub-label text-theme-text-muted max-w-md mx-auto mb-8 leading-loose">
            AI-driven venue telemetry · crowd coordination · organizers, safety teams & fans
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login"
              className="group flex items-center gap-2 px-6 py-3 rounded-lg font-display font-semibold text-xs btn-crazy"
            >
              <Zap className="w-4 h-4" />
              ACCESS PLATFORM
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a href="#booking"
              className="flex items-center gap-1.5 px-6 py-3 rounded-lg border font-display font-semibold text-xs transition-all bg-glass-bg border-glass-border hover:border-cyber-teal-dim/30 text-theme-text-muted"
            >BOOK TICKETS</a>
          </div>

          <motion.div
            animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}
            className="mt-12 flex flex-col items-center gap-1.5"
          >
            <span className="hero-sub-label text-theme-text-muted">SCROLL TO DISCOVER</span>
            <ChevronDown className="w-4 h-4 text-theme-text-muted" />
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Cards Section */}
      <section id="features" className="relative py-20 px-6 max-w-6xl mx-auto border-t border-glass-border/30">
        <div className="text-center mb-12">
          <p className="font-display text-xs text-theme-text-muted tracking-widest mb-2 font-bold uppercase">
            Three Domains · One Platform
          </p>
          <h2 className="font-display text-2xl font-bold text-theme-text-dark tracking-tight">OPERATIONAL VIEWPORTS</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <HexCard flag="🛡️" icon={Shield} title="ORGANIZER COMMAND" description="Real-time venue occupancy dashboard, crowd strategy updates, and active incident response." href="/login" color="#E06B6B" delay={0} />
          <HexCard flag="🦺" icon={Users} title="VOLUNTEER PORTAL" description="Live task coordinator feed with instant multi-language translation and incident reports." href="/login" color="#E09255" delay={0.1} />
          <HexCard flag="⚽" icon={Ticket} title="FAN EXPERIENCE" description="Personalized gate queue alerts, navigation assistance, and real-time gate redirection." href="/login" color="#6AB482" delay={0.2} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-xl mx-auto">
          <HexCard flag="🧠" icon={Brain} title="EXPLAINABLE AI" description="Understand the reasoning and context behind crowd routing and medical recommendations." href="/login" color="#AB74C7" delay={0.3} />
          <HexCard flag="🌍" icon={Globe} title="SQUAD TELEMETRY" description="Track tactical configurations, roster stats, and spectator demographics." href="/login" color="#E05A47" delay={0.4} />
        </div>
      </section>

      {/* Player Roster Showcase Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto border-t border-glass-border/30">
        <PlayerShowcase />
      </section>

      {/* Dynamic Ticket Booking Portal */}
      <section id="booking" className="py-20 px-6 max-w-6xl mx-auto border-t border-glass-border/30">
        <div className="text-center mb-12">
          <p className="font-display text-xs text-theme-text-muted tracking-widest mb-2 font-bold uppercase">
            ⚡ Secure Your Seats Live
          </p>
          <h2 className="font-display text-3xl font-bold text-theme-text-dark tracking-tight">STADIUM TICKET BOOKING</h2>
          <p className="font-body text-theme-text-muted text-xs mt-2 max-w-md mx-auto font-bold leading-relaxed">
            Select your preferred tier (VIP, Premium, Standard, or General admission) on the interactive map below, pick your seats, and secure your tickets instantly.
          </p>
        </div>
        <div className="glass-panel p-6 pop-card">
          <StadiumSeatMap mode="fan" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 border-t border-glass-border/30" style={{ background: 'rgba(255,227,225,0.1)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-center text-lg font-bold text-theme-text-dark mb-12 tracking-wide uppercase">VENUE CAPACITY METRICS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem value="82,500" label="Total Capacity" color="#E06B6B" flag="🏟️" delay={0} />
            <StatItem value="64" label="Scheduled Matches" color="#6AB482" flag="⚽" delay={0.1} />
            <StatItem value="8" label="Supported Languages" color="#E09255" flag="🌍" delay={0.2} />
            <StatItem value="<1s" label="Telemetry Latency" color="#AB74C7" flag="⚡" delay={0.3} />
          </div>
        </div>
      </section>

      {/* Features Detail Section */}
      <section className="py-20 px-6 border-t border-glass-border/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-display text-xs text-theme-text-muted font-bold tracking-widest mb-2 uppercase">Platform Details</p>
            
            <div className="mb-6 rounded-xl border border-glass-border overflow-hidden relative shadow-sm">
              <img src={`${import.meta.env.BASE_URL}images/hero_player_bicycle_kick.jpg`} className="w-full h-44 object-cover" alt="Antigravity Action" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4A3535]/80 to-transparent flex items-end p-4">
                <span className="font-display text-xs text-[#FFF5E4] font-semibold">FIFA Telemetry Integration</span>
              </div>
            </div>

            <h2 className="font-display text-theme-text-dark font-bold text-xl mb-4 leading-tight">
              VENUE INTELLIGENCE SYSTEMS
            </h2>
            <p className="font-body text-theme-text-muted text-xs leading-relaxed mb-6 font-bold">
              StadiumSync offers AI-driven coordination connecting all key personas of FIFA World Cup 2026.
              Powered by Gemini 2.5 Flash for explaining routing and crowd management recommendations.
            </p>
            <Link to="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-display font-semibold text-xs transition-all bg-glass-bg border-glass-border hover:border-cyber-teal-dim/30 text-theme-text-dark"
            >
              ACCESS PORTAL NOW <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-5">
            <FeatureRow icon={Brain} title="Explainable Recommendations" desc="AI-driven crowd suggestions detail reasoning metrics so operations teams can proceed with confidence." color="#E06B6B" delay={0} />
            <FeatureRow icon={Globe} title="Contextual Localization" desc="Automatic translation with cultural guidelines for Spanish, French, Portuguese, Arabic, and Hindi speakers." color="#E09255" delay={0.1} />
            <FeatureRow icon={Radio} title="Sensor Fusion Telemetry" desc="Fuses parking grid states, turnstile checks, and seat densities into a unified dashboard." color="#6AB482" delay={0.2} />
            <FeatureRow icon={Star} title="Role-Specific Hubs" desc="Dedicated views customized for command room managers, active field volunteers, and match spectators." color="#AB74C7" delay={0.3} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-glass-border/30 py-12 px-6" style={{ background: 'rgba(255,227,225,0.1)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {[
              { title: '🏟️ ABOUT US', links: ['Vision', 'Leadership', 'Our Stadiums', 'World Cup News'] },
              { title: '⚡ SERVICES', links: ['System Design', 'AI Telemetry', 'Multilingual Support', 'Integration'] },
              { title: '🎯 PRODUCTS', links: ['Command Center', 'Volunteer Copilot', 'Fan Experience'] },
              { title: '🆘 SUPPORT', links: ['Inquiries', 'Documentation', 'Contact Team'] },
            ].map((col) => (
              <div key={col.title}>
                <p className="font-display text-xs font-bold text-theme-text-dark tracking-wider mb-4 uppercase">{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" className="font-body text-theme-text-muted text-xs font-bold hover:text-cyber-teal-dim transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-glass-border/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-display text-[10px] text-theme-text-muted font-bold">© 2026 StadiumSync · FIFA World Cup Intelligence Platform</p>
            <div className="flex gap-4">
              {['Terms', 'Privacy'].map(t => (
                <a key={t} href="#" className="font-display text-[10px] text-theme-text-muted font-bold hover:text-theme-text-dark transition-colors">{t}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// this is end of the home page component
