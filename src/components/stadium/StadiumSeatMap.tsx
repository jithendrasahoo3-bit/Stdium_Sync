import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Ticket, Shield, Users, ChevronRight, Zap, MapPin } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

/* ────────── Types ────────── */
type SeatStatus = 'available' | 'taken' | 'selected' | 'vip' | 'disabled' | 'aisle';
type ViewMode = 'fan' | 'organizer' | 'volunteer';

interface Section {
  id: string;
  label: string;
  tier: 'vip' | 'premium' | 'standard' | 'general';
  rows: number;
  seatsPerRow: number;
  price: number;
  color: string;
  glowColor: string;
  occupancyPct: number;
  svgPath: string;
  textX: number;
  textY: number;
}

interface SeatInfo {
  id: string;
  row: string;
  num: number;
  status: SeatStatus;
}

/* ────────── Stadium Sections ────────── */
const SECTIONS: Section[] = [
  { id: 'A', label: 'VIP NORTH', tier: 'vip', rows: 6, seatsPerRow: 12, price: 850, color: '#F5C842', glowColor: 'rgba(245,200,66,0.35)', occupancyPct: 95, svgPath: 'M 185 95 A 115 70 0 0 1 315 95 L 295 125 A 95 50 0 0 0 205 125 Z', textX: 250, textY: 108 },
  { id: 'B', label: 'PREMIUM EAST', tier: 'premium', rows: 8, seatsPerRow: 16, price: 480, color: '#E06B6B', glowColor: 'rgba(224,107,107,0.3)', occupancyPct: 82, svgPath: 'M 355 140 A 70 115 0 0 1 355 260 L 325 250 A 45 85 0 0 0 325 150 Z', textX: 360, textY: 200 },
  { id: 'C', label: 'PREMIUM WEST', tier: 'premium', rows: 8, seatsPerRow: 16, price: 480, color: '#E06B6B', glowColor: 'rgba(224,107,107,0.3)', occupancyPct: 78, svgPath: 'M 145 140 A 70 115 0 0 0 145 260 L 175 250 A 45 85 0 0 1 175 150 Z', textX: 140, textY: 200 },
  { id: 'D', label: 'VIP SOUTH', tier: 'vip', rows: 6, seatsPerRow: 12, price: 850, color: '#F5C842', glowColor: 'rgba(245,200,66,0.35)', occupancyPct: 90, svgPath: 'M 185 305 A 115 70 0 0 0 315 305 L 295 275 A 95 50 0 0 1 205 275 Z', textX: 250, textY: 293 },
  { id: 'E', label: 'STANDARD NE', tier: 'standard', rows: 10, seatsPerRow: 20, price: 280, color: '#AB74C7', glowColor: 'rgba(171,116,199,0.3)', occupancyPct: 70, svgPath: 'M 315 95 A 115 70 0 0 1 380 140 L 355 140 A 95 50 0 0 0 295 125 Z', textX: 347, textY: 118 },
  { id: 'F', label: 'STANDARD NW', tier: 'standard', rows: 10, seatsPerRow: 20, price: 280, color: '#AB74C7', glowColor: 'rgba(171,116,199,0.3)', occupancyPct: 68, svgPath: 'M 185 95 A 115 70 0 0 0 120 140 L 145 140 A 95 50 0 0 1 205 125 Z', textX: 153, textY: 118 },
  { id: 'G', label: 'GENERAL SE', tier: 'general', rows: 12, seatsPerRow: 24, price: 120, color: '#6AB482', glowColor: 'rgba(106,180,130,0.3)', occupancyPct: 55, svgPath: 'M 355 260 A 70 115 0 0 1 315 305 L 295 275 A 45 85 0 0 0 325 250 Z', textX: 347, textY: 284 },
  { id: 'H', label: 'GENERAL SW', tier: 'general', rows: 12, seatsPerRow: 24, price: 120, color: '#6AB482', glowColor: 'rgba(106,180,130,0.3)', occupancyPct: 52, svgPath: 'M 145 260 A 70 115 0 0 0 185 305 L 205 275 A 45 85 0 0 1 175 250 Z', textX: 153, textY: 284 },
];

/* ────────── Helpers ────────── */
const ROWS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateSeats(section: Section, selectedIds: Set<string>): SeatInfo[] {
  const seats: SeatInfo[] = [];
  for (let r = 0; r < section.rows; r++) {
    for (let s = 1; s <= section.seatsPerRow; s++) {
      const id = `${section.id}-${ROWS[r]}${s}`;
      const rand = (id.charCodeAt(0) + id.charCodeAt(2) * 7 + s * 13) % 100;
      let status: SeatStatus =
        rand < section.occupancyPct ? 'taken' :
        s === Math.floor(section.seatsPerRow / 2) ? 'aisle' :
        section.tier === 'vip' && r < 2 ? 'vip' : 'available';
      if (selectedIds.has(id)) status = 'selected';
      seats.push({ id, row: ROWS[r], num: s, status });
    }
  }
  return seats;
}

const SEAT_COLORS: Record<SeatStatus, string> = {
  available: '#6AB482',
  taken: '#4A3535',
  selected: '#F5C842',
  vip: '#E09255',
  disabled: '#8A6E6E',
  aisle: 'transparent',
};

/* ────────── Sub-components ────────── */

// ── Tier badge
const TierBadge = ({ tier }: { tier: Section['tier'] }) => {
  const cfg = { vip: { label: '★ VIP', bg: '#F5C842', text: '#4A3535' }, premium: { label: '◆ PREMIUM', bg: '#E06B6B', text: '#FFF5E4' }, standard: { label: '● STANDARD', bg: '#AB74C7', text: '#FFF5E4' }, general: { label: '○ GENERAL', bg: '#6AB482', text: '#FFF5E4' } }[tier];
  return <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold tracking-wider" style={{ backgroundColor: cfg.bg, color: cfg.text }}>{cfg.label}</span>;
};

// ── Stadium SVG overview
const StadiumOverview = ({ sections, selected, onSelect, mode }: { sections: Section[]; selected: string | null; onSelect: (id: string) => void; mode: ViewMode }) => {
  const getOccupancyColor = (pct: number) => pct >= 90 ? '#E05A47' : pct >= 70 ? '#E09255' : pct >= 50 ? '#F5C842' : '#6AB482';

  return (
    <div className="relative w-full flex items-center justify-center">
      <svg viewBox="0 0 500 400" className="w-full max-w-[520px]" style={{ filter: 'drop-shadow(0 8px 32px rgba(74,53,53,0.12))' }}>
        {/* Outer stadium shell */}
        <ellipse cx="250" cy="200" rx="230" ry="185" fill="rgba(255,227,225,0.18)" stroke="rgba(255,148,148,0.25)" strokeWidth="1.5" />

        {/* Field */}
        <ellipse cx="250" cy="200" rx="110" ry="82" fill="#2d6a3f" />
        <ellipse cx="250" cy="200" rx="90" ry="65" fill="#35804c" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
        {/* Centre circle */}
        <circle cx="250" cy="200" r="22" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
        <circle cx="250" cy="200" r="2" fill="rgba(255,255,255,0.4)" />
        {/* Penalty areas */}
        <rect x="212" y="173" width="76" height="48" rx="1" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
        <rect x="212" y="190" width="20" height="20" rx="1" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
        <rect x="268" y="190" width="20" height="20" rx="1" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
        {/* Centre line */}
        <line x1="250" y1="135" x2="250" y2="265" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
        {/* Pitch label */}
        <text x="250" y="204" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="JetBrains Mono" letterSpacing="2">METLIFE STADIUM</text>

        {/* Seat sections */}
        {sections.map((sec) => {
          const fillColor = mode === 'fan' ? sec.color :
            mode === 'organizer' ? getOccupancyColor(sec.occupancyPct) :
            getOccupancyColor(sec.occupancyPct);
          const isSelected = selected === sec.id;
          const alpha = isSelected ? '0.95' : '0.72';
          return (
            <g key={sec.id} onClick={() => onSelect(sec.id)} style={{ cursor: 'pointer' }}>
              <path
                d={sec.svgPath}
                fill={fillColor}
                fillOpacity={alpha}
                stroke={isSelected ? '#FFF5E4' : 'rgba(255,255,255,0.2)'}
                strokeWidth={isSelected ? 2 : 0.8}
                style={{ transition: 'all 0.2s ease', filter: isSelected ? `drop-shadow(0 0 8px ${sec.glowColor})` : 'none' }}
              />
              {/* Section label */}
              <text
                x={sec.textX} y={sec.textY}
                textAnchor="middle" fill="#FFF5E4"
                fontSize={isSelected ? "7.5" : "6.5"}
                fontFamily="JetBrains Mono" fontWeight="700"
                letterSpacing="0.5"
                style={{ pointerEvents: 'none' }}
              >
                {sec.id}
              </text>
            </g>
          );
        })}

        {/* North/South/East/West labels */}
        {[['N', 250, 18], ['S', 250, 390], ['E', 486, 204], ['W', 14, 204]].map(([dir, x, y]) => (
          <text key={dir as string} x={x as number} y={y as number} textAnchor="middle" fill="rgba(74,53,53,0.35)" fontSize="9" fontFamily="JetBrains Mono" fontWeight="700">{dir}</text>
        ))}

        {/* Live pulse dot */}
        <circle cx="470" cy="20" r="4" fill="#6AB482">
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x="460" y="24" textAnchor="end" fill="#6AB482" fontSize="7" fontFamily="JetBrains Mono" fontWeight="700">LIVE</text>
      </svg>
    </div>
  );
};

// ── Individual seat grid
const SeatGrid = ({ section, selectedIds, onToggle, mode }: { section: Section; selectedIds: Set<string>; onToggle: (id: string) => void; mode: ViewMode }) => {
  const seats = useMemo(() => generateSeats(section, selectedIds), [section, selectedIds]);

  return (
    <div className="space-y-3">
      {/* Screen / Field direction indicator */}
      <div className="flex items-center justify-center mb-4">
        <div className="h-1 rounded-full w-48 opacity-60" style={{ background: `linear-gradient(90deg, transparent, ${section.color}, transparent)` }} />
        <span className="font-mono text-[9px] tracking-widest text-slate-500 mx-3 uppercase">← FIELD VIEW →</span>
        <div className="h-1 rounded-full w-48 opacity-60" style={{ background: `linear-gradient(90deg, transparent, ${section.color}, transparent)` }} />
      </div>

      {/* Seat rows */}
      <div className="space-y-1.5 overflow-y-auto max-h-[340px] pr-1">
        {Array.from({ length: section.rows }, (_, r) => {
          const rowSeats = seats.filter(s => s.row === ROWS[r]);
          return (
            <div key={r} className="flex items-center gap-1">
              <span className="font-mono text-[9px] text-slate-500 w-4 flex-shrink-0 font-bold">{ROWS[r]}</span>
              <div className="flex gap-0.5 flex-wrap">
                {rowSeats.map(seat => {
                  if (seat.status === 'aisle') return <div key={seat.id} className="w-3 h-3" />;
                  const isInteractive = mode === 'fan' && (seat.status === 'available' || seat.status === 'vip' || seat.status === 'selected');
                  return (
                    <motion.button
                      key={seat.id}
                      whileHover={isInteractive ? { scale: 1.3, y: -1 } : {}}
                      whileTap={isInteractive ? { scale: 0.9 } : {}}
                      onClick={() => isInteractive && onToggle(seat.id)}
                      disabled={!isInteractive}
                      title={`Row ${seat.row}, Seat ${seat.num} — ${seat.status}`}
                      className="w-3.5 h-3 rounded-sm transition-all duration-150"
                      style={{
                        backgroundColor: SEAT_COLORS[seat.status],
                        opacity: seat.status === 'taken' ? 0.45 : 1,
                        cursor: isInteractive ? 'pointer' : 'default',
                        border: seat.status === 'selected' ? '1px solid #FFF5E4' : '1px solid transparent',
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Legend
const Legend = ({ mode }: { mode: ViewMode }) => {
  const items = mode === 'fan'
    ? [
        { color: '#6AB482', label: 'Available' },
        { color: '#E09255', label: 'VIP' },
        { color: '#F5C842', label: 'Selected' },
        { color: 'rgba(74,53,53,0.45)', label: 'Taken' },
      ]
    : [
        { color: '#6AB482', label: '< 50% Full' },
        { color: '#F5C842', label: '50–70% Full' },
        { color: '#E09255', label: '70–90% Full' },
        { color: '#E05A47', label: '> 90% Critical' },
      ];

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {items.map(({ color, label }) => (
        <div key={label} className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
          <span className="font-mono text-[9px] text-slate-500 tracking-wide">{label}</span>
        </div>
      ))}
    </div>
  );
};

// ── Booking summary panel
const BookingPanel = ({ section, selectedIds, onConfirm, onClear }: {
  section: Section; selectedIds: Set<string>; onConfirm: () => void; onClear: () => void;
}) => {
  const count = selectedIds.size;
  const total = count * section.price;

  if (count === 0) return (
    <div className="rounded-xl border border-glass-border bg-glass-bg p-5 text-center space-y-2">
      <MapPin className="w-6 h-6 mx-auto text-slate-400" />
      <p className="font-mono text-[10px] text-slate-400 tracking-wider">SELECT SEATS ON THE MAP</p>
      <p className="font-body text-xs text-slate-400">Tap a green or gold seat to select it</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border p-5 space-y-4"
      style={{ borderColor: section.color + '55', background: section.glowColor }}>
      <div className="flex items-center gap-2">
        <Ticket className="w-4 h-4" style={{ color: section.color }} />
        <span className="font-mono text-[10px] font-bold tracking-widest" style={{ color: section.color }}>BOOKING SUMMARY</span>
      </div>

      <div className="space-y-2">
        {Array.from(selectedIds).map(sid => {
          const [, seatCode] = sid.split('-');
          return (
            <div key={sid} className="flex items-center justify-between">
              <span className="font-mono text-xs text-theme-text-dark font-bold">
                {section.label} · Row {seatCode[0]}, Seat {seatCode.slice(1)}
              </span>
              <span className="font-mono text-xs font-bold" style={{ color: section.color }}>${section.price}</span>
            </div>
          );
        })}
      </div>

      <div className="border-t border-glass-border/40 pt-3 flex items-center justify-between">
        <div>
          <p className="font-mono text-[9px] text-slate-500 tracking-wider">{count} SEAT{count > 1 ? 'S' : ''} SELECTED</p>
          <p className="font-mono text-xl font-bold text-theme-text-dark">${total.toLocaleString()}</p>
        </div>
        <div className="flex flex-col gap-2">
          <motion.button whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }} onClick={onConfirm}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg font-mono text-xs font-bold text-white"
            style={{ backgroundColor: section.color, boxShadow: `0 4px 16px ${section.glowColor}` }}>
            <Zap className="w-3.5 h-3.5" /> CONFIRM BOOKING
          </motion.button>
          <button onClick={onClear} className="text-[10px] font-mono text-slate-400 hover:text-slate-600 transition-colors">
            Clear selection
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ── Section info card
const SectionInfoCard = ({ section, mode }: { section: Section; mode: ViewMode }) => (
  <div className="rounded-xl border border-glass-border bg-glass-bg p-4 space-y-3">
    <div className="flex items-center justify-between">
      <div>
        <p className="font-mono text-[9px] text-slate-500 tracking-wider mb-0.5">SECTION</p>
        <p className="font-display text-base font-bold text-theme-text-dark">{section.label}</p>
      </div>
      <TierBadge tier={section.tier} />
    </div>
    <div className="grid grid-cols-3 gap-3">
      {mode === 'fan' ? (
        <>
          <div className="text-center">
            <p className="font-mono text-lg font-bold" style={{ color: section.color }}>${section.price}</p>
            <p className="font-mono text-[8px] text-slate-500 tracking-wider">PER SEAT</p>
          </div>
          <div className="text-center">
            <p className="font-mono text-lg font-bold text-theme-text-dark">{section.rows * section.seatsPerRow}</p>
            <p className="font-mono text-[8px] text-slate-500 tracking-wider">TOTAL SEATS</p>
          </div>
          <div className="text-center">
            <p className="font-mono text-lg font-bold" style={{ color: section.occupancyPct >= 90 ? '#E05A47' : '#6AB482' }}>
              {100 - section.occupancyPct}%
            </p>
            <p className="font-mono text-[8px] text-slate-500 tracking-wider">AVAILABLE</p>
          </div>
        </>
      ) : (
        <>
          <div className="text-center">
            <p className="font-mono text-lg font-bold" style={{ color: section.occupancyPct >= 90 ? '#E05A47' : section.occupancyPct >= 70 ? '#E09255' : '#6AB482' }}>{section.occupancyPct}%</p>
            <p className="font-mono text-[8px] text-slate-500 tracking-wider">OCCUPIED</p>
          </div>
          <div className="text-center">
            <p className="font-mono text-lg font-bold text-theme-text-dark">{section.rows}</p>
            <p className="font-mono text-[8px] text-slate-500 tracking-wider">ROWS</p>
          </div>
          <div className="text-center">
            <p className="font-mono text-lg font-bold text-theme-text-dark">{Math.round(section.rows * section.seatsPerRow * section.occupancyPct / 100)}</p>
            <p className="font-mono text-[8px] text-slate-500 tracking-wider">FANS SEATED</p>
          </div>
        </>
      )}
    </div>
    {/* Occupancy bar */}
    <div>
      <div className="flex justify-between mb-1">
        <span className="font-mono text-[8px] text-slate-500 tracking-wider">OCCUPANCY</span>
        <span className="font-mono text-[8px] font-bold" style={{ color: section.color }}>{section.occupancyPct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-glass-border overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ backgroundColor: section.color }}
          initial={{ width: 0 }} animate={{ width: `${section.occupancyPct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} />
      </div>
    </div>
  </div>
);

// ── Booking success modal
const BookingSuccess = ({ section, count, onClose }: { section: Section; count: number; onClose: () => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: 'rgba(74,53,53,0.6)', backdropFilter: 'blur(8px)' }}>
    <motion.div initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 20 }}
      className="bg-[#FFF5E4] rounded-2xl border border-glass-border p-8 max-w-sm w-full text-center space-y-5 shadow-2xl">
      <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 0.5 }}
        className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
        style={{ backgroundColor: section.color + '22', border: `2px solid ${section.color}` }}>
        <Check className="w-8 h-8" style={{ color: section.color }} />
      </motion.div>
      <div>
        <h3 className="font-display text-xl font-bold text-theme-text-dark mb-1">SEATS BOOKED!</h3>
        <p className="font-mono text-[10px] text-slate-500 tracking-wider">{count} seat{count > 1 ? 's' : ''} in {section.label}</p>
      </div>
      <div className="rounded-xl p-4 space-y-1" style={{ background: section.glowColor }}>
        <p className="font-mono text-[9px] text-slate-500 tracking-wider">YOUR BOOKING REFERENCE</p>
        <p className="font-mono text-lg font-bold tracking-widest" style={{ color: section.color }}>
          SS-{Math.random().toString(36).slice(2, 8).toUpperCase()}
        </p>
        <p className="font-mono text-[9px] text-slate-500">Present at gate for entry</p>
      </div>
      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onClose}
        className="w-full py-3 rounded-xl font-mono font-bold text-sm text-white"
        style={{ backgroundColor: section.color }}>
        DONE
      </motion.button>
    </motion.div>
  </motion.div>
);

/* ────────── Main Export ────────── */
export const StadiumSeatMap = ({ mode = 'fan' }: { mode?: ViewMode }) => {
  const { telemetry } = useAppStore();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
  const [showSuccess, setShowSuccess] = useState(false);
  const [view, setView] = useState<'map' | 'seats'>('map');

  const section = SECTIONS.find(s => s.id === selectedSection) ?? null;

  const handleSectionSelect = (id: string) => {
    setSelectedSection(id);
    setSelectedSeats(new Set());
    setView('seats');
  };

  const handleSeatToggle = (id: string) => {
    setSelectedSeats(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else if (next.size < 8) next.add(id);
      return next;
    });
  };

  const handleConfirm = () => { setShowSuccess(true); };
  const handleSuccessClose = () => { setShowSuccess(false); setSelectedSeats(new Set()); setView('map'); setSelectedSection(null); };

  const modeConfig = {
    fan: { icon: Ticket, label: 'BOOK YOUR SEATS', color: '#6AB482', sub: 'Select a section to browse available seats' },
    organizer: { icon: Shield, label: 'CAPACITY HEATMAP', color: '#E06B6B', sub: 'Real-time occupancy across all stadium sections' },
    volunteer: { icon: Users, label: 'ZONE MONITOR', color: '#AB74C7', sub: 'Crowd density and alert levels by zone' },
  }[mode];

  const ModeIcon = modeConfig.icon;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center border border-glass-border"
            style={{ backgroundColor: modeConfig.color + '18' }}>
            <ModeIcon className="w-4 h-4" style={{ color: modeConfig.color }} />
          </div>
          <div>
            <h2 className="font-display text-sm font-bold text-theme-text-dark tracking-wider">{modeConfig.label}</h2>
            <p className="font-mono text-[9px] text-slate-500 tracking-wider">{modeConfig.sub}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Live badge */}
          <div className="flex items-center gap-1.5 rounded-full px-3 py-1 border border-glass-border bg-glass-bg">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
            <span className="font-mono text-[9px] text-cyber-green font-bold tracking-wider">{telemetry.overallPercentage}% FULL</span>
          </div>
          {/* Back button when in seat view */}
          {view === 'seats' && (
            <motion.button initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              onClick={() => { setView('map'); setSelectedSection(null); setSelectedSeats(new Set()); }}
              className="flex items-center gap-1 px-3 py-1 rounded-lg border border-glass-border bg-glass-bg font-mono text-[9px] text-slate-500 hover:text-theme-text-dark transition-colors">
              ← OVERVIEW
            </motion.button>
          )}
        </div>
      </div>

      {/* Section quick-select pills */}
      <div className="flex gap-2 flex-wrap">
        {SECTIONS.map(sec => (
          <motion.button key={sec.id} whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.96 }}
            onClick={() => handleSectionSelect(sec.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-mono text-[9px] font-bold tracking-wider transition-all"
            style={selectedSection === sec.id
              ? { backgroundColor: sec.color, borderColor: sec.color, color: '#FFF5E4' }
              : { borderColor: sec.color + '50', color: sec.color, backgroundColor: sec.color + '12' }}>
            {sec.id} <span className="opacity-60 hidden sm:inline">· {sec.tier.toUpperCase()}</span>
            {mode !== 'fan' && <span className="ml-1">{sec.occupancyPct}%</span>}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {view === 'map' ? (
          <motion.div key="map" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
            {/* Stadium SVG */}
            <div className="rounded-2xl border border-glass-border bg-glass-bg p-4 pop-card">
              <StadiumOverview sections={SECTIONS} selected={selectedSection} onSelect={handleSectionSelect} mode={mode} />
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <Legend mode={mode} />
              <span className="font-mono text-[9px] text-slate-400 tracking-wider">TAP A SECTION TO EXPLORE</span>
            </div>

            {/* All sections grid summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SECTIONS.map(sec => (
                <motion.button key={sec.id} whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                  onClick={() => handleSectionSelect(sec.id)}
                  className="rounded-xl border p-3 text-left transition-all pop-card"
                  style={{ borderColor: sec.color + '40', background: sec.color + '08' }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[9px] font-bold tracking-wider" style={{ color: sec.color }}>{sec.id}</span>
                    <TierBadge tier={sec.tier} />
                  </div>
                  <p className="font-display text-[10px] text-theme-text-dark font-bold mb-1 truncate">{sec.label}</p>
                  <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: sec.color + '22' }}>
                    <div className="h-full rounded-full" style={{ width: `${sec.occupancyPct}%`, backgroundColor: sec.color }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="font-mono text-[8px] text-slate-400">{sec.occupancyPct}% full</span>
                    {mode === 'fan' && <span className="font-mono text-[8px] font-bold" style={{ color: sec.color }}>${sec.price}</span>}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : section ? (
          <motion.div key="seats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Seat grid */}
            <div className="lg:col-span-2 rounded-2xl border border-glass-border bg-glass-bg p-5 pop-card">
              <div className="flex items-center gap-2 mb-4 border-b border-glass-border/30 pb-3">
                <div className="w-6 h-6 rounded flex items-center justify-center font-mono text-[10px] font-bold text-white"
                  style={{ backgroundColor: section.color }}>
                  {section.id}
                </div>
                <div>
                  <p className="font-display text-sm font-bold text-theme-text-dark">{section.label}</p>
                  <p className="font-mono text-[8px] text-slate-500 tracking-wider">{section.rows} ROWS · {section.seatsPerRow} SEATS PER ROW</p>
                </div>
                <TierBadge tier={section.tier} />
              </div>
              <SeatGrid section={section} selectedIds={selectedSeats} onToggle={handleSeatToggle} mode={mode} />
              <div className="mt-3 pt-3 border-t border-glass-border/30">
                <Legend mode={mode} />
              </div>
            </div>

            {/* Right panel */}
            <div className="space-y-3">
              <SectionInfoCard section={section} mode={mode} />
              {mode === 'fan' && (
                <BookingPanel section={section} selectedIds={selectedSeats} onConfirm={handleConfirm} onClear={() => setSelectedSeats(new Set())} />
              )}
              {mode === 'organizer' && (
                <div className="rounded-xl border border-glass-border bg-glass-bg p-4 space-y-2">
                  <p className="font-mono text-[9px] font-bold tracking-wider text-cyber-red">ADMIN ACTIONS</p>
                  {['Lock Section', 'Redirect Flow', 'Deploy Staff', 'Raise Alert'].map(action => (
                    <motion.button key={action} whileHover={{ x: 2 }} className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-glass-border bg-glass-bg text-xs font-display text-theme-text-dark hover:border-cyber-red/40 transition-all">
                      {action} <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </motion.button>
                  ))}
                </div>
              )}
              {mode === 'volunteer' && (
                <div className="rounded-xl border border-glass-border bg-glass-bg p-4 space-y-2">
                  <p className="font-mono text-[9px] font-bold tracking-wider text-cyber-purple">ZONE ACTIONS</p>
                  {['Request Backup', 'Report Incident', 'Mark Zone Clear', 'Contact Medical'].map(action => (
                    <motion.button key={action} whileHover={{ x: 2 }} className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-glass-border bg-glass-bg text-xs font-display text-theme-text-dark hover:border-cyber-purple/40 transition-all">
                      {action} <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Booking success modal */}
      <AnimatePresence>
        {showSuccess && section && (
          <BookingSuccess section={section} count={selectedSeats.size} onClose={handleSuccessClose} />
        )}
      </AnimatePresence>
    </div>
  );
};
