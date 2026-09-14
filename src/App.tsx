import { useEffect, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppNavBar } from './components/layout/AppNavBar';
import { ChatBot } from './components/chatbot/ChatBot';
import { useAppStore } from './store/useAppStore';

const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const OrganizerPage = lazy(() => import('./pages/OrganizerPage').then((m) => ({ default: m.OrganizerPage })));
const VolunteerPage = lazy(() => import('./pages/VolunteerPage').then((m) => ({ default: m.VolunteerPage })));
const FanPage = lazy(() => import('./pages/FanPage').then((m) => ({ default: m.FanPage })));

const PageFallback = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center">
    <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-slate-50 text-slate-900">
    <AppNavBar />
    <main className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-[88px] pb-12">
      {children}
    </main>
    <footer className="border-t border-slate-200 bg-white py-4 px-6">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4 flex-wrap text-xs text-slate-500">
        <p className="font-medium">StadiumSync 2026 &bull; Real-time Operations &amp; Crowd Management</p>
        <p>FIFA World Cup Tournament Operations</p>
      </div>
    </footer>
    <ChatBot />
  </div>
);

const THEMES: Record<string, { primary: string; secondary: string; text: string }> = {
  default: { primary: '#2563eb', secondary: '#eff6ff', text: '#1d4ed8' },
  Portugal: { primary: '#b91c1c', secondary: '#fef2f2', text: '#991b1b' },
  Argentina: { primary: '#0284c7', secondary: '#f0f9ff', text: '#0369a1' },
  Brazil: { primary: '#15803d', secondary: '#f0fdf4', text: '#166534' },
  France: { primary: '#1d4ed8', secondary: '#eff6ff', text: '#1e40af' },
  USA: { primary: '#1e3a8a', secondary: '#f1f5f9', text: '#172554' },
};

export function App() {
  const { refreshTelemetry, isAuthenticated, activeTheme } = useAppStore();

  useEffect(() => {
    const t = THEMES[activeTheme] || THEMES.default;
    document.documentElement.style.setProperty('--theme-primary', t.primary);
    document.documentElement.style.setProperty('--theme-secondary', t.secondary);
    document.documentElement.style.setProperty('--theme-text', t.text);
    document.documentElement.style.setProperty('--theme-font', "'Inter', system-ui, sans-serif");
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
            <Route
              path="/organizer"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <OrganizerPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/volunteer"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <VolunteerPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/fan"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <FanPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </HashRouter>
  );
}

export default App;
