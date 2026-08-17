import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ArrowRight, RefreshCw, User } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface Player {
  id: string;
  name: string;
  country: string;
  flag: string;
  position: string;
  number: number;
  teamColors: { primary: string; secondary: string; glow: string };
  stats: { speed: number; dribbling: number; shooting: number; passing: number; defense: number };
  image: string;
  bestMove: string;
  tacticalPos: { x: number; y: number }; // Percentage coordinate on pitch
  shortPos: string;
}

const PLAYERS: Player[] = [
  {
    id: '1', name: 'Cristiano Ronaldo', country: 'Portugal', flag: '🇵🇹', position: 'Left Forward', number: 7,
    teamColors: { primary: '#B31942', secondary: '#009B3A', glow: 'rgba(179,25,66,0.15)' },
    stats: { speed: 88, dribbling: 84, shooting: 93, passing: 81, defense: 35 },
    image: '/images/player_action_collage.jpg',
    bestMove: 'Juventus Bicycle Kick (2.38m)',
    tacticalPos: { x: 35, y: 22 },
    shortPos: 'LF'
  },
  {
    id: '2', name: 'Lionel Messi', country: 'Argentina', flag: '🇦🇷', position: 'Right Forward', number: 10,
    teamColors: { primary: '#75AADB', secondary: '#FCFCFC', glow: 'rgba(117,170,219,0.15)' },
    stats: { speed: 85, dribbling: 94, shooting: 89, passing: 92, defense: 35 },
    image: '/images/hero_player_bicycle_kick.jpg',
    bestMove: 'El Clásico Solo Run & Chip',
    tacticalPos: { x: 65, y: 22 },
    shortPos: 'RF'
  },
  {
    id: '3', name: 'Neymar Jr', country: 'Brazil', flag: '🇧🇷', position: 'Left Winger', number: 10,
    teamColors: { primary: '#FFDF00', secondary: '#009B3A', glow: 'rgba(255,223,0,0.15)' },
    stats: { speed: 89, dribbling: 93, shooting: 83, passing: 88, defense: 37 },
    image: '/images/player_card_portrait.jpg',
    bestMove: 'Copa del Rey Rainbow Flick',
    tacticalPos: { x: 25, y: 35 },
    shortPos: 'LW'
  },
  {
    id: '4', name: 'Ronaldinho', country: 'Brazil', flag: '🇧🇷', position: 'Attacking Midfielder', number: 10,
    teamColors: { primary: '#009B3A', secondary: '#FFDF00', glow: 'rgba(0,155,58,0.15)' },
    stats: { speed: 87, dribbling: 95, shooting: 81, passing: 90, defense: 42 },
    image: '/images/hero_stadium_floating.jpg',
    bestMove: 'No-Look Pass & Overhead Volley',
    tacticalPos: { x: 50, y: 55 },
    shortPos: 'AM'
  },
  {
    id: '5', name: 'Kylian Mbappé', country: 'France', flag: '🇫🇷', position: 'Center Forward', number: 10,
    teamColors: { primary: '#002395', secondary: '#ED2939', glow: 'rgba(0,35,149,0.15)' },
    stats: { speed: 97, dribbling: 92, shooting: 90, passing: 83, defense: 39 },
    image: '/images/player_action_collage.jpg',
    bestMove: 'World Cup Final Volley',
    tacticalPos: { x: 50, y: 15 },
    shortPos: 'CF'
  },
  {
    id: '6', name: 'Christian Pulisic', country: 'USA', flag: '🇺🇸', position: 'Right Winger', number: 10,
    teamColors: { primary: '#0A3161', secondary: '#B31942', glow: 'rgba(10,49,97,0.15)' },
    stats: { speed: 89, dribbling: 87, shooting: 82, passing: 80, defense: 45 },
    image: '/images/player_card_portrait.jpg',
    bestMove: 'Champions League Solo Goal',
    tacticalPos: { x: 75, y: 35 },
    shortPos: 'RW'
  }
];

const NATIONS = [
  { flag: '🇵🇹', label: 'Portugal', colors: { primary: '#B31942', secondary: '#009B3A' }, slogan: 'Força Portugal' },
  { flag: '🇦🇷', label: 'Argentina', colors: { primary: '#75AADB', secondary: '#FCFCFC' }, slogan: 'Vamos Argentina' },
  { flag: '🇧🇷', label: 'Brazil', colors: { primary: '#009B3A', secondary: '#FFDF00' }, slogan: 'Ordem e Progresso' },
  { flag: '🇫🇷', label: 'France', colors: { primary: '#002395', secondary: '#ED2939' }, slogan: 'Allez Les Bleus' },
  { flag: '🇺🇸', label: 'USA', colors: { primary: '#0A3161', secondary: '#B31942' }, slogan: 'One Nation. One Team.' },
];

export const PlayerShowcase = () => {
  const { userProfile } = useAppStore();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string>('');
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // Sync with userProfile supporting team if available
  useEffect(() => {
    if (userProfile && userProfile.teamSupporting) {
      const team = userProfile.teamSupporting;
      const matched = NATIONS.find(n => n.label.toLowerCase() === team.toLowerCase());
      if (matched) {
        setSelectedCountry(matched.label);
      }
    }
  }, [userProfile]);

  // Filter players by selected country
  const filteredPlayers = useMemo(() => PLAYERS.filter(p => p.country === selectedCountry), [selectedCountry]);

  // Set default selected player when country changes
  useEffect(() => {
    if (filteredPlayers.length > 0) {
      setSelectedId(filteredPlayers[0].id);
    } else {
      setSelectedId('');
    }
  }, [selectedCountry, filteredPlayers]);

  const selectedPlayer = PLAYERS.find(p => p.id === selectedId) || filteredPlayers[0];
  const statKeys: (keyof typeof selectedPlayer.stats)[] = ['speed', 'dribbling', 'shooting', 'passing', 'defense'];
  
  const offsetPositions = [
    { x: -105, y: -45 },
    { x: 105, y: -45 },
    { x: -105, y: 45 },
    { x: 105, y: 45 },
    { x: 0, y: 100 },
  ];

  const matchedNation = NATIONS.find(n => n.label === selectedCountry);

  return (
    <div className="space-y-6 relative overflow-hidden pb-4">
      {/* Settings / Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-3 border-b border-glass-border">
        <div>
          <h2 className="font-display text-base font-bold tracking-tight text-theme-text-dark flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyber-teal-dim" />
            NATIONAL TEAM ROSTERS
          </h2>
          <p className="font-body text-xs text-theme-text-muted font-bold">FIFA World Cup 2026 Spectator Viewports</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedCountry && (
            <button
              onClick={() => setSelectedCountry(null)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-glass-border text-xs font-semibold hover:bg-glass-bg text-theme-text-muted"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Swap Team
            </button>
          )}
          <button
            onClick={() => setReducedMotion(!reducedMotion)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-200 ${
              reducedMotion
                ? 'bg-cyber-purple/10 border-cyber-purple text-cyber-purple'
                : 'border-glass-border hover:bg-glass-bg text-theme-text-muted'
            }`}
          >
            {reducedMotion ? 'Static Mode Active' : 'Motion Mode Active'}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!selectedCountry ? (
          /* STEP 1: Country Selector */
          <motion.div
            key="selector"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-panel p-8 pop-card bg-[#FFE3E1]/20 border border-glass-border text-center max-w-2xl mx-auto"
          >
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center bg-cyber-blue/40 border border-glass-border mb-4">
              <Globe className="w-6 h-6 text-cyber-teal-dim" />
            </div>
            <h3 className="font-display font-semibold text-lg text-theme-text-dark mb-1">SELECT YOUR COUNTRY</h3>
            <p className="font-body text-theme-text-muted text-xs font-bold mb-6">Choose your national team to load tailored player visual configurations</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {NATIONS.map((nation) => (
                <motion.button
                  key={nation.label}
                  onClick={() => setSelectedCountry(nation.label)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 rounded-xl border border-glass-border bg-glass-bg text-left hover:border-cyber-teal flex flex-col justify-between pop-card cursor-pointer min-h-[110px]"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-3xl">{nation.flag}</span>
                    <ArrowRight className="w-4 h-4 text-theme-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="mt-3">
                    <p className="font-display font-bold text-xs text-theme-text-dark">{nation.label.toUpperCase()}</p>
                    <p className="font-mono text-[9px] text-slate-500 font-bold">{nation.slogan}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          /* STEP 2: Showcase Board */
          <motion.div
            key="showcase"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch animate-pop-in"
          >
            {/* Tactics Pitch Board (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between glass-panel p-5 min-h-[500px] relative bg-cyber-gradient border border-glass-border">
              {/* Team color accent glow line */}
              <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: matchedNation?.colors.primary }} />

              <div className="flex items-center justify-between mb-4 relative z-10 border-b border-glass-border/30 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{matchedNation?.flag}</span>
                  <span className="font-display text-xs text-theme-text-dark font-bold tracking-wide">{matchedNation?.label.toUpperCase()} LINEUP</span>
                </div>
                <span className="font-mono text-[9px] text-slate-500">{matchedNation?.slogan}</span>
              </div>

              {/* Pitch */}
              <div className="relative flex-1 rounded-xl border border-glass-border/40 overflow-hidden min-h-[380px] bg-cyber-navy/10 flex items-center justify-center">
                {/* Field outlines */}
                <div className="absolute inset-0 pointer-events-none select-none opacity-20 z-0">
                  <div className="absolute inset-4 border border-theme-text-dark/40" />
                  <div className="absolute top-1/2 left-4 right-4 h-px bg-theme-text-dark/40" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-theme-text-dark/40" />
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-20 border-b border-l border-r border-theme-text-dark/40" />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-20 border-t border-l border-r border-theme-text-dark/40" />
                </div>

                {/* Team Player Pins */}
                {filteredPlayers.map((player) => {
                  const isSel = player.id === selectedId;
                  return (
                    <motion.button
                      key={player.id}
                      onClick={() => setSelectedId(player.id)}
                      className="absolute z-20 focus:outline-none cursor-pointer"
                      style={{ left: `${player.tacticalPos.x}%`, top: `${player.tacticalPos.y}%`, transform: 'translate(-50%, -50%)' }}
                      whileHover={{ scale: 1.08 }}
                    >
                      <div className="flex flex-col items-center">
                        <div className="relative w-12 h-12 rounded-full border-2 bg-glass-bg flex items-center justify-center transition-all duration-300 shadow-sm"
                          style={{
                            borderColor: isSel ? player.teamColors.primary : 'rgba(74, 53, 53, 0.2)',
                            boxShadow: isSel ? `0 0 15px ${player.teamColors.glow}` : 'none'
                          }}
                        >
                          <span className="font-display text-[10px] font-bold text-theme-text-dark">#{player.number}</span>
                          {isSel && (
                            <motion.span layoutId="tacticalHighlight" className="absolute inset-0 rounded-full border border-theme-text-dark/60 opacity-60"
                              transition={{ type: 'spring', stiffness: 300, damping: 25 }} />
                          )}
                        </div>
                        <span className={`mt-1 font-display text-[9px] font-bold px-2 py-0.5 rounded border transition-colors ${
                          isSel 
                            ? 'bg-theme-text-dark text-white border-theme-text-dark' 
                            : 'bg-glass-bg text-slate-500 border-glass-border'
                        }`}>{player.name.split(' ').pop()}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="border-t border-glass-border/30 pt-3 mt-4 text-center">
                <span className="font-mono text-[9px] text-slate-500 uppercase font-bold">Select players on the board to inspect metrics</span>
              </div>
            </div>

            {/* Tactical Stats Display (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between glass-panel p-5 min-h-[500px] relative bg-cyber-gradient border border-glass-border">
              {selectedPlayer ? (
                <>
                  <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ border: `1px solid ${selectedPlayer.teamColors.primary}20`, boxShadow: `inset 0 0 35px ${selectedPlayer.teamColors.glow}` }} />

                  {/* Header */}
                  <div className="relative z-10 flex items-center justify-between border-b border-glass-border/30 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{selectedPlayer.flag}</span>
                      <div>
                        <p className="font-display text-sm font-bold text-theme-text-dark">{selectedPlayer.name}</p>
                        <p className="font-mono text-[10px] text-theme-text-muted font-bold">{selectedPlayer.position} · #{selectedPlayer.number}</p>
                      </div>
                    </div>
                  </div>

                  {/* Levitating Card */}
                  <div className="relative flex-1 flex items-center justify-center min-h-[240px]">
                    <AnimatePresence>
                      {statKeys.map((key, si) => {
                        const statVal = selectedPlayer.stats[key];
                        const pos = offsetPositions[si];
                        return (
                          <motion.div
                            key={key}
                            className="absolute z-20 flex flex-col items-center justify-center w-12 h-12 rounded-xl border border-glass-border bg-glass-bg shadow-sm"
                            style={{ left: `calc(50% + ${pos.x}px - 24px)`, top: `calc(50% + ${pos.y}px - 24px)` }}
                            initial={reducedMotion ? { scale: 1 } : { scale: 0 }}
                            animate={reducedMotion ? { scale: 1 } : {
                              scale: 1,
                              y: [0, -3, 3, 0],
                              transition: { duration: 4 + si, repeat: Infinity, ease: 'easeInOut' }
                            }}
                            exit={{ scale: 0 }}
                          >
                            <span className="font-mono text-[8px] text-slate-500 font-bold uppercase">{key.substring(0, 3)}</span>
                            <span className="font-display text-xs font-bold text-theme-text-dark leading-none">{statVal}%</span>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>

                    <motion.div
                      className="w-32 h-40 rounded-2xl border overflow-hidden shadow-cyber z-10 flex flex-col justify-end p-3 relative bg-cover bg-center"
                      style={{
                        borderColor: selectedPlayer.teamColors.primary,
                        backgroundImage: `url(${selectedPlayer.image})`
                      }}
                      animate={reducedMotion ? {} : { y: [0, -4, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-theme-text-dark/90 via-transparent to-transparent pointer-events-none" />
                      <div className="relative z-10 text-left">
                        <span className="font-display text-lg text-[#FFF5E4] font-bold block leading-none">#{selectedPlayer.number}</span>
                        <span className="font-mono text-[9px] text-slate-300 uppercase block">{selectedPlayer.country}</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Best move badge */}
                  <div className="px-3 py-2 rounded-lg border text-center font-mono text-[9px] font-bold text-[#4A3535] bg-cyber-blue/30 border-glass-border mb-4">
                    ⭐️ SIGNATURE MOVE: {selectedPlayer.bestMove}
                  </div>

                  {/* Stat Progress Bars */}
                  <div className="border-t border-glass-border/30 pt-3 flex flex-col gap-2 relative z-10">
                    {statKeys.slice(0, 3).map(key => {
                      const val = selectedPlayer.stats[key];
                      return (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between text-[10px] font-display font-bold">
                            <span className="text-theme-text-muted uppercase tracking-wider">{key}</span>
                            <span className="text-theme-text-dark">{val}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-cyber-blue/30 border border-glass-border overflow-hidden">
                            <motion.div className="h-full rounded-full"
                              style={{ backgroundColor: selectedPlayer.teamColors.primary }}
                              initial={{ width: 0 }}
                              animate={{ width: `${val}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 text-theme-text-muted">
                  <User className="w-8 h-8 opacity-40 mb-2" />
                  <p className="font-body text-xs font-bold">No player selected</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
