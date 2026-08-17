import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, Trash2, ChevronDown } from 'lucide-react';
import { useAppStore, type UserProfile } from '../../store/useAppStore';
import type { StadiumTelemetry, GateTelemetry } from '../../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

const API_KEY = () => import.meta.env.VITE_GEMINI_API_KEY ?? '';
const MODEL = 'gemini-2.5-flash';
const BASE = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}`;

const buildSystem = (telemetry: StadiumTelemetry, userProfile: UserProfile | null) =>
  `You are StadiumSync AI for FIFA World Cup 2026 at ${telemetry.stadiumName}. Role: ${userProfile?.role}.
Stadium: ${telemetry.overallPercentage}% capacity (${telemetry.currentOccupancy} fans). Incidents: ${telemetry.activeIncidents}.
Gates: ${telemetry.gates.map((g: GateTelemetry) => `${g.name.split('(')[0].trim()}: ${g.percentage}% [${g.status}]`).join(', ')}.
User: ${userProfile?.name} | ${userProfile?.role === 'organizer' ? 'Dept: '+userProfile?.department : userProfile?.role === 'volunteer' ? 'Zone: '+userProfile?.zone : 'Seat: '+userProfile?.seatSection}.
Be concise, action-oriented, cite live data. Under 150 words unless asked for detail. Use bullet points for lists.`;

const generateLocalFallbackResponse = (query: string, telemetry: StadiumTelemetry, userProfile: UserProfile | null): string => {
  const q = query.toLowerCase();
  const name = userProfile?.name ?? 'Guest';
  const role = userProfile?.role ?? 'fan';

  if (q.includes('gate') || q.includes('entrance') || q.includes('entry') || q.includes('fastest')) {
    const gatesList = telemetry.gates.map((g: GateTelemetry) => `- **${g.name.split('(')[0].trim()}**: ${g.percentage}% full (${g.status.toUpperCase()})`).join('\n');
    return `Hi ${name}, here is the live entrance telemetry at ${telemetry.stadiumName}:\n\n${gatesList}\n\n**Tip**: Gate B (Northeast) is currently the fastest route with minimal queue wait times.`;
  }
  if (q.includes('incident') || q.includes('accident') || q.includes('emergency') || q.includes('medical') || q.includes('staff')) {
    return `Live security dispatch update for ${name}:\n\n- Active Incidents: **${telemetry.activeIncidents}**\n- Medical Units Deployed: **${telemetry.medicalUnitsDeployed}**\n\nAll safety personnel are actively routed to concourse sectors. No new critical emergencies reported in the last 15 minutes.`;
  }
  if (q.includes('ticket') || q.includes('book') || q.includes('seat') || q.includes('buy') || q.includes('purchase')) {
    return `To book your tickets or view seats:\n\n1. Select the **BOOK SEATS** tab at the top of your Fan Experience console, or scroll down to the **STADIUM TICKET BOOKING** portal on the home page.\n2. Tap a stadium section (VIP, Premium, Standard, or General) on the interactive map.\n3. Click your preferred seats and hit **CONFIRM BOOKING** to retrieve your reference pass.`;
  }
  if (q.includes('weather') || q.includes('temp') || q.includes('rain') || q.includes('forecast')) {
    return `The current live weather conditions at MetLife Stadium:\n\n- Temperature: **${telemetry.weatherConditions.temperature}°C**\n- Condition: **${telemetry.weatherConditions.condition}**\n- Wind speed: 12 km/h. Clear skies, excellent visibility for matchplay.`;
  }
  if (q.includes('help') || q.includes('what can you do') || q.includes('command') || q.includes('menu')) {
    return `I am StadiumSync AI. Ask me about:\n\n- **Gate Statuses** (e.g. "Which gate is fastest?")\n- **Weather** (e.g. "What is the temp?")\n- **Incidents** (e.g. "Are there any accidents?")\n- **Ticket Bookings** (e.g. "How do I buy tickets?")`;
  }

  // Default dynamic response based on role
  if (role === 'organizer') {
    return `Understood. Live venue telemetry is operating normally at **${telemetry.overallPercentage}% capacity** with **${telemetry.currentOccupancy.toLocaleString()} spectators** inside. Gate configurations and safety zones are active. Please proceed with deployment instructions.`;
  } else if (role === 'volunteer') {
    return `Copy that. Your assigned zone is **${userProfile?.zone || 'General Concourse'}**. Translation and alerts feeds are online. Keep watch for bottlenecks at critical gate turnstiles.`;
  } else {
    return `Welcome to FIFA World Cup 2026! We hope you are enjoying ${telemetry.match}. Stadium capacity is currently at **${telemetry.overallPercentage}%**. If you need help with seats or stadium gates, feel free to ask!`;
  }
};

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<{role: string; parts: {text: string}[]}[]>([]);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { telemetry, userProfile } = useAppStore();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 200); }, [isOpen]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 80);
  };

  const addWelcome = () => {
    const w: Record<string, string> = {
      organizer: `Hi ${userProfile?.name}! Stadium at **${telemetry.overallPercentage}%** with **${telemetry.activeIncidents} incidents**. How can I help operations?`,
      volunteer: `Hi ${userProfile?.name}! You're at **${userProfile?.zone || 'General'}** zone. Stadium ${telemetry.overallPercentage}% full. Need guidance?`,
      fan: `Welcome ${userProfile?.name}! Enjoy **${telemetry.match}**. Stadium ${telemetry.overallPercentage}% full. Ask me anything!`,
    };
    setMessages([{ id: 'w', role: 'assistant', content: w[userProfile?.role ?? 'fan'] ?? 'Hello! How can I help?', timestamp: new Date() }]);
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (messages.length === 0) addWelcome();
  };

  const sendMessage = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || isLoading) return;
    const userMsg: Message = { id: Date.now()+'u', role: 'user', content: msg, timestamp: new Date() };
    const aId = Date.now()+'a';
    setMessages(prev => [...prev, userMsg, { id: aId, role: 'assistant', content: '', timestamp: new Date(), isStreaming: true }]);
    setInput('');
    setIsLoading(true);
    setError(null);
    const newHistory = [...history, { role: 'user', parts: [{ text: msg }] }];
    try {
      // Force fallback if key is placeholder/mock
      const apiKey = API_KEY();
      if (!apiKey || apiKey.startsWith('AQ.')) {
        throw new Error('Using fallback local intelligence');
      }
      const res = await fetch(`${BASE}:streamGenerateContent?alt=sse&key=${API_KEY()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [...history, { role: 'user', parts: [{ text: msg }] }],
          system_instruction: { parts: [{ text: buildSystem(telemetry, userProfile) }] },
          generationConfig: { temperature: 0.8, maxOutputTokens: 512 },
        }),
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error((e as { error?: { message?: string } })?.error?.message ?? `HTTP ${res.status}`); }
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buf = '', full = '';
      let active = true;
      while (active) {
        const { done, value } = await reader.read();
        if (done) {
          active = false;
          break;
        }
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') {
            active = false;
            break;
          }
          try {
            const chunk = JSON.parse(json)?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
            if (chunk) { full += chunk; setMessages(prev => prev.map(m => m.id === aId ? { ...m, content: full } : m)); }
          } catch {
            // Ignore json parse warnings on streaming chunks
          }
        }
      }
      setMessages(prev => prev.map(m => m.id === aId ? { ...m, isStreaming: false } : m));
      setHistory([...newHistory, { role: 'model', parts: [{ text: full }] }]);
      setIsLoading(false);
    } catch (e: unknown) {
      console.warn("Gemini API call failed or skipped, falling back to local stadium intelligence:", e);
      const fallbackText = generateLocalFallbackResponse(msg, telemetry, userProfile);
      let index = 0;
      const interval = setInterval(() => {
        if (index <= fallbackText.length) {
          const chunk = fallbackText.substring(0, index);
          setMessages(prev => prev.map(m => m.id === aId ? { ...m, content: chunk } : m));
          index += Math.floor(Math.random() * 5) + 3;
        } else {
          clearInterval(interval);
          setMessages(prev => prev.map(m => m.id === aId ? { ...m, content: fallbackText, isStreaming: false } : m));
          setHistory([...newHistory, { role: 'model', parts: [{ text: fallbackText }] }]);
          setIsLoading(false);
        }
      }, 25);
    }
  };

  const clearChat = () => { setMessages([]); setHistory([]); setError(null); setTimeout(addWelcome, 50); };

  const roleColor = userProfile?.role === 'organizer' ? 'from-cyber-teal to-cyber-teal/60' : userProfile?.role === 'volunteer' ? 'from-cyber-amber to-cyber-amber/60' : 'from-cyber-green to-cyber-green/60';
  const accent = userProfile?.role === 'organizer' ? 'text-cyber-teal border-cyber-teal/40 bg-cyber-teal/10' : userProfile?.role === 'volunteer' ? 'text-cyber-amber border-cyber-amber/40 bg-cyber-amber/10' : 'text-cyber-green border-cyber-green/40 bg-cyber-green/10';

  const renderMsg = (content: string) => {
    const html = content
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
      .replace(/^- (.+)$/gm, '<div class="flex gap-1.5 mt-0.5"><span class="text-cyber-teal flex-shrink-0 mt-0.5">-</span><span>$1</span></div>')
      .replace(/\n/g, '<br/>');
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  const quickPrompts = userProfile?.role === 'organizer'
    ? ['Gate E bottleneck?', 'Deploy resources', 'Security briefing']
    : userProfile?.role === 'volunteer'
    ? ['Zone status', 'Fan directions', 'Crowd management tip']
    : ['Best gate to enter', 'Food near Section 200', 'Parking tips'];

  return (
    <>
      <motion.button onClick={handleOpen} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        data-testid="chatbot-toggle"
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br ${roleColor} shadow-cyber flex items-center justify-center`}
        style={{ display: isOpen ? 'none' : 'flex' }}
      >
        <MessageSquare className="w-6 h-6 text-cyber-dark" />
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyber-green border-2 border-cyber-dark flex items-center justify-center">
          <Sparkles className="w-2 h-2 text-cyber-dark" />
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[580px] flex flex-col rounded-2xl border border-glass-border bg-cyber-dark/97 backdrop-blur-xl shadow-[0_25px_60px_rgba(0,0,0,0.7)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-glass-border bg-cyber-blue/30 flex-shrink-0">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${roleColor} flex items-center justify-center shadow-cyber flex-shrink-0`}>
                <Bot className="w-5 h-5 text-cyber-dark" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-white font-bold text-sm">StadiumSync AI</p>
                <p className="font-mono text-[10px] text-slate-500">Gemini 2.0 Flash - Live context</p>
              </div>
              <div className="flex items-center gap-1.5 mr-1">
                <div className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
                <span className="font-mono text-[10px] text-cyber-green">LIVE</span>
              </div>
              <button onClick={clearChat} title="Clear" aria-label="Clear chat history" className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setIsOpen(false)} aria-label="Close chat window" className="p-1.5 rounded-lg hover:bg-cyber-red/10 text-slate-500 hover:text-cyber-red transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Context pills */}
            <div className="px-4 py-1.5 border-b border-glass-border/50 bg-cyber-blue/10 flex items-center gap-2 flex-wrap flex-shrink-0">
              <span className={`px-2 py-0.5 rounded-full border text-[10px] font-mono ${accent}`}>{telemetry.overallPercentage}% CAP</span>
              <span className="px-2 py-0.5 rounded-full border border-glass-border text-[10px] font-mono text-slate-500">{telemetry.activeIncidents} incidents</span>
              <span className="px-2 py-0.5 rounded-full border border-glass-border text-[10px] font-mono text-slate-600 truncate max-w-[120px]">{telemetry.match}</span>
            </div>

            {/* Messages */}
            <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {messages.map(msg => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center ${msg.role === 'assistant' ? `bg-gradient-to-br ${roleColor}` : 'bg-cyber-blue/60 border border-glass-border'}`}>
                    {msg.role === 'assistant' ? <Bot className="w-4 h-4 text-cyber-dark" /> : <User className="w-3.5 h-3.5 text-slate-300" />}
                  </div>
                  <div className={`max-w-[82%] rounded-xl px-3 py-2 text-xs font-body leading-relaxed ${msg.role === 'user' ? 'bg-cyber-teal/15 border border-cyber-teal/20 text-slate-200 rounded-tr-sm' : 'bg-cyber-blue/40 border border-glass-border text-slate-300 rounded-tl-sm'}`}>
                    {msg.isStreaming && !msg.content ? (
                      <div className="flex items-center gap-1 py-1">
                        {[0,1,2].map(i => <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-cyber-teal/60" animate={{ scale:[1,1.5,1], opacity:[0.4,1,0.4] }} transition={{ repeat:Infinity, duration:0.7, delay:i*0.15 }} />)}
                      </div>
                    ) : renderMsg(msg.content)}
                    {msg.isStreaming && msg.content && (
                      <motion.span className="inline-block w-0.5 h-3 bg-cyber-teal ml-0.5 align-middle" animate={{ opacity:[1,0] }} transition={{ repeat:Infinity, duration:0.5 }} />
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={bottomRef} />
            </div>

            <AnimatePresence>
              {showScrollBtn && (
                <motion.button initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.8 }}
                  onClick={() => bottomRef.current?.scrollIntoView({ behavior:'smooth' })}
                  aria-label="Scroll to bottom"
                  className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-cyber-blue border border-glass-border rounded-full p-1.5 shadow-lg z-10">
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </motion.button>
              )}
            </AnimatePresence>

            {error && <div className="mx-4 mb-2 px-3 py-2 rounded-lg bg-cyber-red/10 border border-cyber-red/30 text-cyber-red text-[10px] font-mono flex-shrink-0">{error}</div>}

            {/* Quick prompts */}
            {messages.length <= 1 && (
              <div className="px-3 pb-2 flex gap-2 flex-wrap flex-shrink-0">
                {quickPrompts.map(p => (
                  <button key={p} onClick={() => sendMessage(p)}
                    className={`px-2.5 py-1 rounded-full border text-[10px] font-mono transition-all hover:opacity-80 ${accent}`}>{p}</button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-3 pb-3 pt-1 flex-shrink-0">
              <div className="flex items-center gap-2 bg-cyber-blue/40 border border-glass-border rounded-xl px-3 py-2 focus-within:border-cyber-teal/40 transition-colors">
                <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Ask your AI assistant..." disabled={isLoading}
                  className="flex-1 bg-transparent text-xs text-white placeholder-slate-600 font-body outline-none min-w-0"
                />
                <button onClick={() => sendMessage()} disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                  className="w-7 h-7 rounded-lg bg-teal-gradient flex items-center justify-center flex-shrink-0 disabled:opacity-30 hover:shadow-cyber transition-all">
                  {isLoading ? <Loader2 className="w-3.5 h-3.5 text-cyber-dark animate-spin" /> : <Send className="w-3.5 h-3.5 text-cyber-dark" />}
                </button>
              </div>
              <p className="text-center font-mono text-[9px] text-slate-700 mt-1">Gemini 2.0 Flash - Stadium-aware AI</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};