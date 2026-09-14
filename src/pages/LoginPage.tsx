import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield, Users, Ticket, ArrowRight, ArrowLeft, Check,
  Activity, User, ChevronDown, Lock,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { Role } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';

type Step = 1 | 2 | 3;

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

const INITIAL_FORM: FormData = {
  role: null, name: '', department: '', accessLevel: 'standard',
  zone: '', languages: [], seatSection: '', teamSupporting: '', language: 'english',
};

const RoleCard = ({
  title, description, features, selected, onClick, flag,
}: {
  title: string; description: string;
  features: string[];
  selected: boolean; onClick: () => void; flag: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative w-full text-left rounded-xl border p-5 transition-all duration-150 cursor-pointer ${
      selected
        ? 'bg-blue-50/70 border-blue-600 ring-1 ring-blue-600 shadow-sm'
        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
    }`}
  >
    {selected && (
      <div className="absolute top-3.5 right-3.5 w-5 h-5 rounded-full flex items-center justify-center bg-blue-600 text-white">
        <Check className="w-3.5 h-3.5" />
      </div>
    )}
    <span className="text-2xl block mb-2">{flag}</span>
    <h3 className="font-bold text-sm text-slate-900 mb-1">{title}</h3>
    <p className="text-slate-500 text-xs mb-3 leading-relaxed">{description}</p>
    <ul className="space-y-1">
      {features.map(f => (
        <li key={f} className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
          <span>{f}</span>
        </li>
      ))}
    </ul>
  </button>
);

const SelectField = ({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) => {
  const fieldId = label.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return (
    <div>
      <label htmlFor={fieldId} className="text-xs font-bold text-slate-600 mb-1.5 block uppercase tracking-wider">{label}</label>
      <div className="relative">
        <select id={fieldId} value={value} onChange={e => onChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-lg px-3.5 py-2.5 text-slate-900 text-xs font-semibold outline-none appearance-none transition-all cursor-pointer">
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
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
      <label htmlFor={fieldId} className="text-xs font-bold text-slate-600 mb-1.5 block uppercase tracking-wider">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
        <input id={fieldId} type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className={`w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-lg py-2.5 text-slate-900 text-xs font-semibold outline-none transition-all ${Icon ? 'pl-9 pr-4' : 'px-4'}`}
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
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0 ${
            step > s
              ? 'bg-blue-600 text-white'
              : step === s
              ? 'bg-blue-50 border-2 border-blue-600 text-blue-700'
              : 'bg-slate-100 text-slate-400 border border-slate-200'
          }`}
        >
          {step > s ? <Check className="w-4 h-4" /> : s}
        </div>
        {i < 2 && (
          <div className="flex-1 h-1 rounded-full overflow-hidden bg-slate-200">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: step > s ? '100%' : '0%' }}
            />
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
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Activity className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-900 text-base">StadiumSync</span>
        </Link>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tournament Access Portal</span>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-2 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
              <Lock className="w-3 h-3 text-blue-600" />
              <span>Identity &amp; Role Setup</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Sign in to StadiumSync</h1>
            <p className="text-xs text-slate-500 mt-1">Configure your matchday viewport credentials</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <ProgressBar step={step} />

            {/* Step 1: Role Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-base text-slate-900 mb-1">Select Your Viewport</h3>
                  <p className="text-xs text-slate-500">Choose the operational role that matches your assignment</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <RoleCard flag="🛡️" title="ORGANIZER" description="Venue Command Center"
                    features={['Gate throughput grid','Bottleneck response','Resource tracking']}
                    selected={form.role === 'organizer'} onClick={() => update('role', 'organizer')} />
                  <RoleCard flag="🦺" title="VOLUNTEER" description="Concourse Steward"
                    features={['Sector alert feed','8-Language assistant','Zone assignments']}
                    selected={form.role === 'volunteer'} onClick={() => update('role', 'volunteer')} />
                  <RoleCard flag="⚽" title="SPECTATOR" description="Fan Matchday Guide"
                    features={['Turn-by-turn routing','Lowest-wait gates','Seat reservations']}
                    selected={form.role === 'fan'} onClick={() => update('role', 'fan')} />
                </div>
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!canProceedStep1}
                    className="btn-primary"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Configuration */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-base text-slate-900 mb-1">Profile Details</h3>
                  <p className="text-xs text-slate-500">Enter your operational identification</p>
                </div>
                <div className="space-y-4">
                  <TextField label="Full Name" placeholder="e.g. Alex Morgan" value={form.name} onChange={v => update('name', v)} icon={User} />
                  {form.role === 'organizer' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <SelectField label="Department" value={form.department} onChange={v => update('department', v)}
                        options={[{ value:'security', label:'🛡️ Security & Safety' },{ value:'medical', label:'🏥 Medical Operations' },{ value:'logistics', label:'📦 Crowd Flow Logistics' },{ value:'media', label:'📺 Media & Venue Relations' }]} />
                      <SelectField label="Access Tier" value={form.accessLevel} onChange={v => update('accessLevel', v)}
                        options={[{ value:'administrator', label:'👑 Administrator Access' },{ value:'standard', label:'⭐ Standard Access' },{ value:'read-only', label:'👁️ Observer Access' }]} />
                    </div>
                  )}
                  {form.role === 'volunteer' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <SelectField label="Assigned Zone" value={form.zone} onChange={v => update('zone', v)}
                        options={[{ value:'Gate A (North)', label:'🔵 Gate A (North)' },{ value:'Gate B (Northeast)', label:'🟢 Gate B (Northeast)' },{ value:'Gate E (South)', label:'🔴 Gate E (South)' },{ value:'Concourse Level 1', label:'🟡 Concourse Level 1' },{ value:'Concourse Level 2', label:'🟠 Concourse Level 2' }]} />
                      <div>
                        <label className="text-xs font-bold text-slate-600 mb-2 block uppercase tracking-wider">Languages Spoken</label>
                        <div className="flex flex-wrap gap-1.5">
                          {['Spanish','French','Arabic','Hindi','Japanese','Mandarin'].map((lang) => {
                            const active = form.languages.includes(lang);
                            return (
                              <button
                                key={lang}
                                type="button"
                                onClick={() => { const next = active ? form.languages.filter(l => l !== lang) : [...form.languages, lang]; update('languages', next); }}
                                className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
                                  active
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                {lang}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  {form.role === 'fan' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <TextField label="Seat Section" placeholder="e.g. Section 203, Row F" value={form.seatSection} onChange={v => update('seatSection', v)} />
                      <TextField label="Supporting" placeholder="e.g. Portugal / USA" value={form.teamSupporting} onChange={v => update('teamSupporting', v)} />
                      <SelectField label="Primary Language" value={form.language} onChange={v => update('language', v)}
                        options={[{ value:'english', label:'🇬🇧 English' },{ value:'spanish', label:'🇪🇸 Español' },{ value:'french', label:'🇫🇷 Français' },{ value:'arabic', label:'🇸🇦 العربية' }]} />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-secondary"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!canProceedStep2}
                    className="btn-primary"
                  >
                    <span>Confirm</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="space-y-6 text-center">
                <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center bg-blue-50 border border-blue-200 text-blue-600">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1">Verify Operational Profile</h3>
                  <p className="text-xs text-slate-500">Confirm your matchday viewport access</p>
                </div>
                <div className="max-w-md mx-auto rounded-xl p-5 text-left space-y-3 border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <p className="text-xs font-bold text-blue-700 uppercase">ROLE: {form.role?.toUpperCase()}</p>
                    <StatusBadge status="normal" label="AUTHORIZED" size="sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><p className="text-[10px] font-bold text-slate-400 uppercase">NAME</p><p className="font-semibold text-slate-900 mt-0.5">{form.name}</p></div>
                    {form.role === 'organizer' && (<><div><p className="text-[10px] font-bold text-slate-400 uppercase">DEPT</p><p className="font-semibold text-slate-900 capitalize mt-0.5">{form.department}</p></div><div><p className="text-[10px] font-bold text-slate-400 uppercase">TIER</p><p className="font-semibold text-slate-900 capitalize mt-0.5">{form.accessLevel}</p></div></>)}
                    {form.role === 'volunteer' && (<><div><p className="text-[10px] font-bold text-slate-400 uppercase">ZONE</p><p className="font-semibold text-slate-900 mt-0.5">{form.zone}</p></div><div className="col-span-2"><p className="text-[10px] font-bold text-slate-400 uppercase">LANGUAGES</p><p className="font-semibold text-slate-900 mt-0.5">{form.languages.join(', ') || 'English'}</p></div></>)}
                    {form.role === 'fan' && (<><div><p className="text-[10px] font-bold text-slate-400 uppercase">SEAT</p><p className="font-semibold text-slate-900 mt-0.5">{form.seatSection}</p></div><div><p className="text-[10px] font-bold text-slate-400 uppercase">TEAM</p><p className="font-semibold text-slate-900 mt-0.5">{form.teamSupporting}</p></div></>)}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-secondary"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleEnter}
                    className="btn-primary"
                  >
                    <span>Enter Operations Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

