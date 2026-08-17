/**
 * ============================================================
 * LOGIN PAGE COMPONENT — Multi-Role Authentication & Onboarding
 * ============================================================
 * 
 * File: pages/LoginPage.tsx
 * Purpose: Handles user authentication and role selection.
 * Customized onboarding flows for each role.
 * 
 * Features:
 *   - Step-by-step multi-step form (3 steps)
 *   - Role-specific data collection
 *   - Theme selection based on team preference
 *   - Animated step transitions
 *   - Mock authentication (always succeeds)
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Users, Ticket, ArrowRight, ArrowLeft, Check,
  Activity, User, ChevronDown, Zap,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { Role } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';

/** Step type for form flow (1-3 steps) */
type Step = 1 | 2 | 3;

/**
 * FormData Interface
 * Collects user profile information across all steps
 */
interface FormData {
  role: Role | null;
  name: string;
  department: string;
  accessLevel: string;
  zone: string;
  languages: string[];
  seatSection: string;
  teamSupporting: string;
  language: string;
}

/** Initial empty form state */
const INITIAL_FORM: FormData = {
  role: null, name: '', department: '', accessLevel: 'standard',
  zone: '', languages: [], seatSection: '', teamSupporting: '', language: 'english',
};

/**
 * RoleCard Component
 * Interactive card for role selection in Step 1
 */
const RoleCard = ({
  title, description, features, color, selected, onClick, flag,
}: {
  icon: typeof Shield; title: string; description: string;
  features: string[]; color: string; gradient: string;
  selected: boolean; onClick: () => void; flag: string;
}) => (
  <motion.button
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="relative w-full text-left rounded-xl border p-5 transition-all duration-200 overflow-hidden cursor-pointer pop-card"
    style={selected ? {
      background: 'rgba(255,148,148,0.06)',
      borderColor: '#FF9494',
    } : { borderColor: 'rgba(255,148,148,0.2)', background: 'rgba(255,245,228,0.4)' }}
  >
    {selected && (
      <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center bg-cyber-teal border border-glass-border">
        <Check className="w-3 h-3 text-[#FFF5E4]" />
      </div>
    )}
    <div className="w-10 h-10 rounded-xl bg-glass-bg flex items-center justify-center mb-3 border border-glass-border">
      <span className="text-xl">{flag}</span>
    </div>
    <h3 className="font-display font-semibold text-sm mb-1 text-theme-text-dark tracking-wide">{title}</h3>
    <p className="font-body text-theme-text-muted text-xs mb-3 leading-relaxed font-bold">{description}</p>
    <ul className="space-y-1">
      {features.map(f => (
        <li key={f} className="flex items-center gap-2 text-[10px] text-theme-text-muted font-body font-bold">
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
          {f}
        </li>
      ))}
    </ul>
  </motion.button>
);

const SelectField = ({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) => {
  const fieldId = label.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return (
    <div>
      <label htmlFor={fieldId} className="font-display text-xs text-theme-text-muted mb-1.5 block tracking-widest font-bold">{label}</label>
      <div className="relative">
        <select id={fieldId} value={value} onChange={e => onChange(e.target.value)}
          className="w-full bg-[#FFF5E4] border border-glass-border focus:border-cyber-teal/60 rounded-lg px-4 py-2.5 text-theme-text-dark font-display text-xs outline-none appearance-none transition-all duration-200 cursor-pointer font-semibold">
          {options.map(o => <option key={o.value} value={o.value} className="bg-[#FFF5E4]">{o.label}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-text-muted pointer-events-none" />
      </div>
    </div>
  );
};

const TextField = ({ label, placeholder, value, onChange, icon: Icon }: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; icon?: typeof User;
}) => {
  const fieldId = label.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return (
    <div>
      <label htmlFor={fieldId} className="font-display text-xs text-theme-text-muted mb-1.5 block tracking-widest font-bold">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-text-muted" />}
        <input id={fieldId} type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className={`w-full bg-[#FFF5E4] border border-glass-border focus:border-cyber-teal/60 rounded-lg py-2.5 text-theme-text-dark font-display text-xs outline-none transition-all duration-200 font-semibold ${Icon ? 'pl-9 pr-4' : 'px-4'}`}
        />
      </div>
    </div>
  );
};

const ProgressBar = ({ step }: { step: Step }) => (
  <div className="flex items-center gap-3 mb-8">
    {([1, 2, 3] as Step[]).map((s, i) => (
      <div key={s} className="flex items-center gap-3 flex-1 last:flex-none">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center font-display text-xs font-bold transition-all duration-300 flex-shrink-0 border"
          style={step > s
            ? { background: 'linear-gradient(135deg,#FF9494,#E06B6B)', color: '#FFF5E4', borderColor: 'rgba(74, 53, 53, 0.1)' }
            : step === s
            ? { background: 'rgba(255,148,148,0.12)', color: '#E06B6B', borderColor: '#FF9494' }
            : { background: '#FFE3E1', color: '#8A6E6E', borderColor: 'rgba(255,148,148,0.2)' }}
        >
          {step > s ? <Check className="w-4 h-4" /> : s}
        </div>
        {i < 2 && (
          <div className="flex-1 h-1.5 rounded-full overflow-hidden border border-glass-border" style={{ background: 'rgba(255,209,209,0.3)' }}>
            <motion.div className="h-full rainbow-bar" initial={{ scaleX: 0 }}
              animate={{ scaleX: step > s ? 1 : 0 }} style={{ originX: 0 }}
              transition={{ duration: 0.4 }} />
          </div>
        )}
      </div>
    ))}
  </div>
);

export const LoginPage = () => {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const { setAuthenticated } = useAppStore();
  const navigate = useNavigate();

  const update = (key: keyof FormData, value: string | string[]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleEnter = () => {
    if (!form.role || !form.name.trim()) return;
    setAuthenticated({
      name: form.name, role: form.role, department: form.department,
      zone: form.zone, languages: form.languages,
      seatSection: form.seatSection, teamSupporting: form.teamSupporting,
      accessLevel: form.accessLevel,
    });
    navigate(`/${form.role}`);
  };

  const canProceedStep1 = !!form.role;
  const canProceedStep2 = form.name.trim().length >= 2;

  return (
    <div className="login-page min-h-screen bg-[#FFF5E4] relative overflow-hidden flex flex-col text-theme-text-dark">
      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-glass-border" style={{ background: 'rgba(255,245,228,0.92)', backdropFilter: 'blur(12px)' }}>
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-teal-gradient flex items-center justify-center border border-glass-border">
            <Activity className="w-4 h-4" style={{ color: '#FFF5E4' }} />
          </div>
          <span className="hero-title-word text-theme-text-dark text-sm">StadiumSync</span>
        </Link>
        <p className="login-badge-label text-theme-text-muted">Access Portal</p>
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 mb-3 border border-[#FF9494]"
              style={{ background: 'rgba(255,148,148,0.08)' }}>
              <Shield className="w-3.5 h-3.5 text-cyber-teal-dim" />
              <span className="login-badge-label text-cyber-teal-dim">Secure Access Authorization</span>
            </div>
            <h2 className="login-title text-3xl text-theme-text-dark">WELCOME TO STADIUMSYNC</h2>
            <p className="hero-sub-label text-theme-text-muted mt-2">Configure your operational portal credentials</p>
          </div>

          <div className="glass-panel p-8 pop-card bg-[#FFE3E1]/20">
            <ProgressBar step={step} />

            <AnimatePresence mode="wait">
              {/* Step 1: Role Selection */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity:0, y: 10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y: -10 }} transition={{ duration: 0.25 }} className="space-y-6">
                  <div>
                    <h3 className="login-step-heading text-base text-theme-text-dark mb-1">Select Access Viewport</h3>
                    <p className="hero-sub-label text-theme-text-muted">Choose your workspace dashboard below</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <RoleCard flag="🛡️" icon={Shield} title="ORGANIZER" description="Venue Command Center View"
                      features={['Live Telemetry Dashboard','AI Incident Strategy Panel','Resource Management']}
                      color="#E06B6B" gradient="bg-teal-gradient" selected={form.role === 'organizer'} onClick={() => update('role', 'organizer')} />
                    <RoleCard flag="🦺" icon={Users} title="VOLUNTEER" description="On-Ground Support Companion"
                      features={['Dynamic Crowd Alert Feed','8-Language AI Translation','Zone Coordination']}
                      color="#E09255" gradient="bg-amber-gradient" selected={form.role === 'volunteer'} onClick={() => update('role', 'volunteer')} />
                    <RoleCard flag="⚽" icon={Ticket} title="FAN EXPERIENCE" description="Matchday Companion Guidance"
                      features={['Turn-by-Turn Safe Routing','Interactive Facility Maps','Live Match Statistics']}
                      color="#6AB482" gradient="bg-green-gradient" selected={form.role === 'fan'} onClick={() => update('role', 'fan')} />
                  </div>
                  <div className="flex justify-end pt-4 border-t border-glass-border/30">
                    <motion.button onClick={() => setStep(2)} disabled={!canProceedStep1}
                      whileHover={canProceedStep1 ? { translateY: -1 } : {}} whileTap={{ scale:0.98 }}
                      className="group flex items-center gap-1.5 px-6 py-2.5 rounded-lg font-display font-semibold text-xs disabled:opacity-40 transition-all btn-crazy"
                    >CONTINUE <ArrowRight className="w-3.5 h-3.5" /></motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Configuration */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity:0, y: 10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y: -10 }} transition={{ duration: 0.25 }} className="space-y-6">
                  <div>
                    <h3 className="font-display font-semibold text-base text-theme-text-dark mb-1">Operational Profile Setup</h3>
                    <p className="font-body text-theme-text-muted text-xs font-bold">Input your deployment details</p>
                  </div>
                  <div className="space-y-4">
                    <TextField label="YOUR NAME" placeholder="e.g. John Doe" value={form.name} onChange={v => update('name', v)} icon={User} />
                    {form.role === 'organizer' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectField label="DEPARTMENT" value={form.department} onChange={v => update('department', v)}
                          options={[{ value:'security', label:'🛡️ Security & Safety' },{ value:'medical', label:'🏥 Medical Operations' },{ value:'logistics', label:'📦 Crowd Flow Logistics' },{ value:'media', label:'📺 Media & Venue Relations' }]} />
                        <SelectField label="ACCESS LEVEL" value={form.accessLevel} onChange={v => update('accessLevel', v)}
                          options={[{ value:'administrator', label:'👑 Administrator Access' },{ value:'standard', label:'⭐ Standard Access' },{ value:'read-only', label:'👁️ Observer Access' }]} />
                      </div>
                    )}
                    {form.role === 'volunteer' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectField label="ASSIGNED ZONE" value={form.zone} onChange={v => update('zone', v)}
                          options={[{ value:'Gate A (North)', label:'🔵 Gate A (North)' },{ value:'Gate B (Northeast)', label:'🟢 Gate B (Northeast)' },{ value:'Gate E (South)', label:'🔴 Gate E (South)' },{ value:'Concourse Level 1', label:'🟡 Concourse Level 1' },{ value:'Concourse Level 2', label:'🟠 Concourse Level 2' }]} />
                        <div>
                          <label className="font-display text-xs text-theme-text-muted mb-2 block tracking-widest font-bold">LANGUAGES SPOKEN</label>
                          <div className="flex flex-wrap gap-2">
                            {['Spanish','French','Arabic','Hindi','Japanese','Mandarin'].map((lang) => {
                              const active = form.languages.includes(lang);
                              return (
                                <motion.button key={lang} whileHover={{ translateY: -1 }} whileTap={{ scale: 0.96 }}
                                  onClick={() => { const next = active ? form.languages.filter(l => l !== lang) : [...form.languages, lang]; update('languages', next); }}
                                  className="px-3 py-1 rounded-lg border text-xs font-display transition-all font-semibold"
                                  style={active
                                    ? { backgroundColor: '#FF9494', color: '#FFF5E4', borderColor: 'rgba(74, 53, 53, 0.1)' }
                                    : { backgroundColor: 'rgba(255,148,148,0.06)', color: '#8A6E6E', borderColor: 'rgba(255,148,148,0.2)' }}
                                >{lang}</motion.button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                    {form.role === 'fan' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <TextField label="🪑 SEAT SECTION" placeholder="e.g. Sec 205, Row F" value={form.seatSection} onChange={v => update('seatSection', v)} />
                        <TextField label="🏆 TEAM SUPPORTING" placeholder="e.g. USA / Mexico" value={form.teamSupporting} onChange={v => update('teamSupporting', v)} />
                        <SelectField label="🌐 LANGUAGE" value={form.language} onChange={v => update('language', v)}
                          options={[{ value:'english', label:'🇬🇧 English' },{ value:'spanish', label:'🇪🇸 Español' },{ value:'french', label:'🇫🇷 Français' },{ value:'arabic', label:'🇸🇦 العربية' }]} />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-glass-border/30">
                    <button onClick={() => setStep(1)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-glass-border text-theme-text-muted font-display font-semibold text-xs transition-all hover:bg-glass-bg">
                      <ArrowLeft className="w-3.5 h-3.5" /> BACK
                    </button>
                    <motion.button onClick={() => setStep(3)} disabled={!canProceedStep2}
                      whileHover={canProceedStep2 ? { translateY: -1 } : {}} whileTap={{ scale:0.98 }}
                      className="group flex items-center gap-1.5 px-6 py-2.5 rounded-lg font-display font-semibold text-xs disabled:opacity-40 transition-all btn-crazy"
                    >CONFIRM <ArrowRight className="w-3.5 h-3.5" /></motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity:0, y: 10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y: -10 }} transition={{ duration: 0.25 }} className="space-y-6 text-center">
                  <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center border border-glass-border"
                    style={{ background: 'rgba(255,148,148,0.1)' }}>
                    <Zap className="w-8 h-8 text-cyber-teal-dim" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-theme-text-dark mb-1">PROFILE COMPILED</h3>
                    <p className="font-body text-theme-text-muted text-xs font-bold">Please verify your deployment credentials</p>
                  </div>
                  <div className="max-w-md mx-auto rounded-xl p-5 text-left space-y-4 border border-glass-border bg-[#FFF5E4]/80">
                    <div className="flex items-center justify-between border-b border-glass-border/30 pb-2">
                      <p className="font-display text-[10px] font-bold tracking-wider" style={{ color: '#E06B6B' }}>ROLE: {form.role?.toUpperCase()}</p>
                      <StatusBadge status="normal" label="READY" size="sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div><p className="font-display text-[9px] text-theme-text-muted font-bold">NAME</p><p className="font-display font-semibold text-theme-text-dark mt-0.5">{form.name}</p></div>
                      {form.role === 'organizer' && (<><div><p className="font-display text-[9px] text-theme-text-muted font-bold">DEPT</p><p className="font-display font-semibold text-theme-text-dark capitalize mt-0.5">{form.department}</p></div><div><p className="font-display text-[9px] text-theme-text-muted font-bold">ACCESS</p><p className="font-display font-semibold text-theme-text-dark capitalize mt-0.5">{form.accessLevel}</p></div></>)}
                      {form.role === 'volunteer' && (<><div><p className="font-display text-[9px] text-theme-text-muted font-bold">ZONE</p><p className="font-display font-semibold text-theme-text-dark mt-0.5">{form.zone}</p></div><div className="col-span-2"><p className="font-display text-[9px] text-theme-text-muted font-bold">LANGUAGES</p><p className="font-display font-semibold text-theme-text-dark mt-0.5">{form.languages.join(', ') || 'English'}</p></div></>)}
                      {form.role === 'fan' && (<><div><p className="font-display text-[9px] text-theme-text-muted font-bold">SEAT</p><p className="font-display font-semibold text-theme-text-dark mt-0.5">{form.seatSection}</p></div><div><p className="font-display text-[9px] text-theme-text-muted font-bold">TEAM</p><p className="font-display font-semibold text-theme-text-dark mt-0.5">{form.teamSupporting}</p></div></>)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-glass-border/30">
                    <button onClick={() => setStep(2)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-glass-border text-theme-text-muted font-display font-semibold text-xs transition-all hover:bg-glass-bg">
                      <ArrowLeft className="w-3.5 h-3.5" /> BACK
                    </button>
                    <motion.button onClick={handleEnter}
                      whileHover={{ translateY: -1 }} whileTap={{ scale:0.98 }}
                      className="group flex items-center gap-1.5 px-8 py-3 rounded-lg font-display font-semibold text-xs btn-crazy"
                    >
                      ENTER PORTAL <ArrowRight className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};