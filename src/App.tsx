import { useEffect, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppNavBar } from './components/layout/AppNavBar';
import { ChatBot } from './components/chatbot/ChatBot';
import { useAppStore } from './store/useAppStore';

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const OrganizerPage = lazy(() => import('./pages/OrganizerPage').then(m => ({ default: m.OrganizerPage })));
const VolunteerPage = lazy(() => import('./pages/VolunteerPage').then(m => ({ default: m.VolunteerPage })));
const FanPage = lazy(() => import('./pages/FanPage').then(m => ({ default: m.FanPage })));

const PageFallback = () => (
  <div className="min-h-screen bg-[#FFF5E4] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-cyber-teal border-t-transparent rounded-full animate-spin" />
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="cyber-bg min-h-screen">
    <AppNavBar />
    <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 pt-[90px] pb-12">
      {children}
    </main>
    <footer className="relative z-10 border-t border-glass-border/30 py-3 px-6">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4 flex-wrap">
        <p className="font-mono text-xs text-slate-600">StadiumSync 2026 - Powered by Gemini 2.5 Flash - FIFA World Cup</p>
        <p className="font-mono text-xs text-slate-700">Demonstration only</p>
      </div>
    </footer>
    
    <ChatBot />
  </div>
);

const THEMES: Record<string, { primary: string; secondary: string; glow: string; text: string; font: string }> = {
  default: { primary: '#E06B6B', secondary: '#FFE3E1', glow: 'rgba(224,107,107,0.12)', text: '#E06B6B', font: "'Syne', sans-serif" },
  Portugal: { primary: '#B31942', secondary: '#009B3A', glow: 'rgba(179,25,66,0.15)', text: '#B31942', font: "'Outfit', sans-serif" },
  Argentina: { primary: '#75AADB', secondary: '#FCFCFC', glow: 'rgba(117,170,219,0.15)', text: '#75AADB', font: "'Playfair Display', serif" },
  Brazil: { primary: '#009B3A', secondary: '#FFDF00', glow: 'rgba(0,155,58,0.15)', text: '#009B3A', font: "'Montserrat', sans-serif" },
  France: { primary: '#002395', secondary: '#ED2939', glow: 'rgba(0,35,149,0.15)', text: '#002395', font: "'Prata', serif" },
  USA: { primary: '#0A3161', secondary: '#B31942', glow: 'rgba(10,49,97,0.15)', text: '#0A3161', font: "'Orbitron', sans-serif" },
};

function App() {
  const { refreshTelemetry, isAuthenticated, activeTheme } = useAppStore();

  useEffect(() => {
    const t = THEMES[activeTheme] || THEMES.default;
    document.documentElement.style.setProperty('--theme-primary', t.primary);
    document.documentElement.style.setProperty('--theme-secondary', t.secondary);
    document.documentElement.style.setProperty('--theme-glow', t.glow);
    document.documentElement.style.setProperty('--theme-text', t.text);
    document.documentElement.style.setProperty('--theme-font', t.font);
  }, [activeTheme]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(refreshTelemetry, 30000);
    return () => clearInterval(interval);
  }, [refreshTelemetry, isAuthenticated]);

  return (
    <HashRouter>
      <Suspense fallback={<PageFallback />}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/organizer" element={<ProtectedRoute><AppLayout><OrganizerPage /></AppLayout></ProtectedRoute>} />
            <Route path="/volunteer" element={<ProtectedRoute><AppLayout><VolunteerPage /></AppLayout></ProtectedRoute>} />
            <Route path="/fan" element={<ProtectedRoute><AppLayout><FanPage /></AppLayout></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </HashRouter>
  );
}

export default App;
