/**
 * ============================================================
 * MAIN APPLICATION COMPONENT — StadiumSync 2026
 * ============================================================
 * 
 * File: App.tsx
 * Purpose: Root application component that manages routing, authentication,
 * theming, and layout for all pages. Handles user role-based access control
 * and real-time telemetry data refresh.
 * 
 * Key Responsibilities:
 *   1. Route management for different user roles (organizer, volunteer, fan)
 *   2. Authentication state checking and route protection
 *   3. Dynamic theme application based on user selection
 *   4. Telemetry data refresh every 30 seconds
 *   5. Layout wrapping with navbar, footer, and chatbot
 * 
 * Technologies:
 *   - React Router: Client-side routing with HashRouter for SPA
 *   - Framer Motion: Animations for page transitions
 *   - Zustand: Global state management (useAppStore)
 */

import { useEffect, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppNavBar } from './components/layout/AppNavBar';
import { ChatBot } from './components/chatbot/ChatBot';
import { useAppStore } from './store/useAppStore';

// ============================================================
// LAZY-LOADED PAGE COMPONENTS
// ============================================================
// Pages are lazy-loaded to improve initial bundle size and
// performance. Dynamic imports are wrapped to ensure proper exports.

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const OrganizerPage = lazy(() => import('./pages/OrganizerPage').then(m => ({ default: m.OrganizerPage })));
const VolunteerPage = lazy(() => import('./pages/VolunteerPage').then(m => ({ default: m.VolunteerPage })));
const FanPage = lazy(() => import('./pages/FanPage').then(m => ({ default: m.FanPage })));

/**
 * PageFallback Component
 * Displays a loading spinner while lazy-loaded pages are being fetched.
 * Uses CSS animation for smooth spinning effect.
 */
const PageFallback = () => (
  <div className="min-h-screen bg-[#FFF5E4] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-cyber-teal border-t-transparent rounded-full animate-spin" />
  </div>
);

/**
 * ProtectedRoute Component
 * Guards routes that require authentication.
 * Redirects unauthenticated users to the login page.
 * 
 * @param {React.ReactNode} children - The component to render if authenticated
 * @returns {JSX.Element} Protected route or redirect to login
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppStore();
  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

/**
 * AppLayout Component
 * Wraps page content with consistent layout including navbar, footer, and chatbot.
 * Creates a container with proper spacing and styling for all authenticated pages.
 * 
 * @param {React.ReactNode} children - Page content to be displayed in main area
 */
const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="cyber-bg min-h-screen">
    {/* Navigation bar visible on all pages */}
    <AppNavBar />
    
    {/* Main content area with responsive padding and max-width container */}
    <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 pt-[90px] pb-12">
      {children}
    </main>
    
    {/* Footer with branding and disclaimer */}
    <footer className="relative z-10 border-t border-glass-border/30 py-3 px-6">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4 flex-wrap">
        <p className="font-mono text-xs text-slate-600">StadiumSync 2026 - Powered by Gemini 2.5 Flash - FIFA World Cup</p>
        <p className="font-mono text-xs text-slate-700">Demonstration only</p>
      </div>
    </footer>
    
    {/* AI Chatbot component for user assistance */}
    <ChatBot />
  </div>
);

/**
 * THEMES Object
 * Centralized theme configuration for different country teams.
 * Each theme includes primary/secondary colors, glow effects, and typography.
 * Supports: default, Portugal, Argentina, Brazil, France, USA
 * 
 * Structure: { primary, secondary, glow, text, font }
 * - primary: Main brand color
 * - secondary: Accent color
 * - glow: CSS color with alpha for shadow effects
 * - text: Text color matching the theme
 * - font: Google Fonts name for typography
 */
const THEMES: Record<string, { primary: string; secondary: string; glow: string; text: string; font: string }> = {
  default: { primary: '#E06B6B', secondary: '#FFE3E1', glow: 'rgba(224,107,107,0.12)', text: '#E06B6B', font: "'Syne', sans-serif" },
  Portugal: { primary: '#B31942', secondary: '#009B3A', glow: 'rgba(179,25,66,0.15)', text: '#B31942', font: "'Outfit', sans-serif" },
  Argentina: { primary: '#75AADB', secondary: '#FCFCFC', glow: 'rgba(117,170,219,0.15)', text: '#75AADB', font: "'Playfair Display', serif" },
  Brazil: { primary: '#009B3A', secondary: '#FFDF00', glow: 'rgba(0,155,58,0.15)', text: '#009B3A', font: "'Montserrat', sans-serif" },
  France: { primary: '#002395', secondary: '#ED2939', glow: 'rgba(0,35,149,0.15)', text: '#002395', font: "'Prata', serif" },
  USA: { primary: '#0A3161', secondary: '#B31942', glow: 'rgba(10,49,97,0.15)', text: '#0A3161', font: "'Orbitron', sans-serif" },
};

/**
 * App Component
 * Main application root that sets up routing and theme management.
 * 
 * Features:
 *   1. Dynamic theme application via CSS custom properties
 *   2. Telemetry refresh interval when authenticated
 *   3. Role-based route protection
 *   4. Suspense boundaries for lazy-loaded pages
 *   5. Animation context for page transitions
 */
function App() {
  const { refreshTelemetry, isAuthenticated, activeTheme } = useAppStore();

  // ============================================================
  // EFFECT: Apply theme to document root
  // ============================================================
  // Updates CSS custom properties when active theme changes.
  // These properties are used throughout the application via Tailwind config.
  useEffect(() => {
    const t = THEMES[activeTheme] || THEMES.default;
    document.documentElement.style.setProperty('--theme-primary', t.primary);
    document.documentElement.style.setProperty('--theme-secondary', t.secondary);
    document.documentElement.style.setProperty('--theme-glow', t.glow);
    document.documentElement.style.setProperty('--theme-text', t.text);
    document.documentElement.style.setProperty('--theme-font', t.font);
  }, [activeTheme]);

  // ============================================================
  // EFFECT: Auto-refresh telemetry data
  // ============================================================
  // Sets up a 30-second interval to fetch fresh telemetry data
  // when user is authenticated. Clears interval on component unmount.
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(refreshTelemetry, 30000);
    return () => clearInterval(interval);
  }, [refreshTelemetry, isAuthenticated]);

  return (
    <HashRouter>
      {/* Suspense provides loading fallback for lazy-loaded pages */}
      <Suspense fallback={<PageFallback />}>
        {/* AnimatePresence enables exit animations for page transitions */}
        <AnimatePresence mode="wait">
          {/* Route definitions for all application pages */}
          <Routes>
            {/* Public routes - no authentication required */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes - require authentication and wrap in layout */}
            <Route path="/organizer" element={<ProtectedRoute><AppLayout><OrganizerPage /></AppLayout></ProtectedRoute>} />
            <Route path="/volunteer" element={<ProtectedRoute><AppLayout><VolunteerPage /></AppLayout></ProtectedRoute>} />
            <Route path="/fan" element={<ProtectedRoute><AppLayout><FanPage /></AppLayout></ProtectedRoute>} />
            
            {/* Catch-all route - redirects unknown paths to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </HashRouter>
  );
}

export default App;