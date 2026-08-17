/**
 * ============================================================
 * GLOBAL STATE MANAGEMENT — Zustand Store
 * ============================================================
 * 
 * File: store/useAppStore.ts
 * Purpose: Centralized state management for the entire application using Zustand.
 * Combines authentication state, telemetry data, AI analysis results, alerts,
 * translations, and fan route generation.
 * 
 * Architecture:
 *   - Uses Zustand for lightweight, performant state management
 *   - Devtools middleware for Redux DevTools debugging
 *   - Synchronous localStorage for persistence (no hydration issues)
 *   - Organized into logical sections: Auth, Telemetry, AI, Alerts, Translation, Routes
 * 
 * Key Features:
 *   1. Persistent Authentication (localStorage)
 *   2. Real-time Telemetry Management
 *   3. AI Analysis & Alerts
 *   4. Multi-language Support
 *   5. Role-based Access Control
 *   6. Fan Route Generation
 * 
 * Usage:
 *   const { isAuthenticated, telemetry, refreshTelemetry } = useAppStore();
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AppState, Role, CrowdAnalysis, AIAlert, TranslationResult, SupportedLanguage, FanRoute } from '../types';
import { INITIAL_TELEMETRY, generateLiveTelemetry } from '../data/mockData';

// ============================================================
// USER PROFILE INTERFACE
// ============================================================

/**
 * UserProfile Interface
 * Represents an authenticated user's profile information.
 * Contains role, department, language preferences, and seat information.
 * 
 * @property {Role} role - User's role (organizer, volunteer, fan)
 * @property {string} department - Department/team assignment (for organizers/volunteers)
 * @property {string} zone - Stadium zone assignment
 * @property {string[]} languages - Languages the volunteer speaks
 * @property {string} seatSection - Seat location (for fans)
 * @property {string} teamSupporting - Team the fan supports (used for theming)
 * @property {string} accessLevel - Access permission level (admin, staff, user)
 */
export interface UserProfile {
  name: string;
  role: Role;
  department?: string;
  zone?: string;
  languages?: string[];
  seatSection?: string;
  teamSupporting?: string;
  accessLevel?: string;
}

// ============================================================
// LOCAL STORAGE HELPERS
// ============================================================

/**
 * LocalStorage Key
 * Version-based key to support multiple schema versions
 */
const LS_KEY = 'stadiumsync_v3';

/**
 * loadAuth Function
 * Synchronously loads authentication state from localStorage.
 * Returns default unauthenticated state if load fails or no data exists.
 * 
 * Benefits of sync approach:
 *   - Avoids React hydration mismatches
 *   - Immediate state availability on app load
 *   - No async loading waterfalls
 * 
 * @returns {Object} Auth state with isAuthenticated, userProfile, activeRole
 */
const loadAuth = (): { isAuthenticated: boolean; userProfile: UserProfile | null; activeRole: Role } => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore localStorage read errors (e.g. sandboxed environment, quota exceeded)
  }
  return { isAuthenticated: false, userProfile: null, activeRole: 'organizer' };
};

/**
 * saveAuth Function
 * Synchronously persists authentication state to localStorage.
 * Gracefully handles write failures (quota exceeded, privacy mode, etc.)
 */
const saveAuth = (isAuthenticated: boolean, userProfile: UserProfile | null, activeRole: Role) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ isAuthenticated, userProfile, activeRole }));
  } catch {
    // Ignore localStorage write failures (quota exceeded, privacy mode)
  }
};

/**
 * clearAuth Function
 * Synchronously removes authentication state from localStorage.
 * Called on logout to ensure clean state.
 */
const clearAuth = () => {
  try {
    localStorage.removeItem(LS_KEY);
  } catch {
    // Ignore localStorage clear failures
  }
};

// Load initial auth state on module import
const initial = loadAuth();

// ============================================================
// AUTHENTICATION STATE INTERFACE
// ============================================================

/**
 * AuthState Interface
 * Authentication and theme management state.
 * Combined with AppState to form FullState for the store.
 */
export interface AuthState {
  /** Whether user is currently authenticated */
  isAuthenticated: boolean;
  /** Currently logged-in user's profile */
  userProfile: UserProfile | null;
  /** Currently active theme (country/team name) */
  activeTheme: string; // 'default' | 'Portugal' | 'Argentina' | 'Brazil' | 'France' | 'USA'
  /** Login action - sets user profile and authentication flag */
  setAuthenticated: (profile: UserProfile) => void;
  /** Change active theme */
  setActiveTheme: (theme: string) => void;
  /** Logout action - clears auth and resets application state */
  logout: () => void;
}

/**
 * FullState Type
 * Union of AppState and AuthState for complete application state.
 */
type FullState = AppState & AuthState;

// ============================================================
// ZUSTAND STORE CREATION
// ============================================================

/**
 * useAppStore Hook
 * Main Zustand store for global application state.
 * Configured with devtools middleware for debugging.
 * 
 * Usage:
 *   const store = useAppStore();
 *   const { isAuthenticated, telemetry } = useAppStore();
 *   const refreshTelemetry = useAppStore(state => state.refreshTelemetry);
 */
export const useAppStore = create<FullState>()(
  devtools((set, get) => ({
    // ============================================================
    // AUTHENTICATION & THEME STATE
    // ============================================================
    
    /** Initial authentication flag from localStorage */
    isAuthenticated: initial.isAuthenticated,
    
    /** Initial user profile from localStorage */
    userProfile: initial.userProfile,
    
    /** Default theme (can be switched based on team) */
    activeTheme: 'default',
    
    /**
     * setAuthenticated Action
     * Marks user as authenticated, stores profile, sets theme based on team.
     * Persists auth state to localStorage.
     * 
     * @param {UserProfile} profile - The authenticated user's profile
     */
    setAuthenticated: (profile: UserProfile) => {
      saveAuth(true, profile, profile.role);
      set({
        isAuthenticated: true,
        userProfile: profile,
        activeRole: profile.role,
        activeTheme: profile.teamSupporting || 'default'
      });
    },
    
    /**
     * setActiveTheme Action
     * Changes the application theme (country/team colors and typography).
     */
    setActiveTheme: (theme: string) => set({ activeTheme: theme }),
    
    /**
     * logout Action
     * Clears all authentication and application data.
     * Resets state to initial values.
     * Clears localStorage.
     */
    logout: () => {
      clearAuth();
      set({
        isAuthenticated: false,
        userProfile: null,
        activeTheme: 'default',
        crowdAnalysis: null,
        aiAlerts: [],
        translationResult: null,
        fanRoute: null
      });
    },

    // ============================================================
    // ROLE MANAGEMENT
    // ============================================================
    
    /** Currently selected/active user role */
    activeRole: initial.activeRole,
    
    /**
     * setActiveRole Action
     * Switches between organizer, volunteer, and fan roles.
     */
    setActiveRole: (role: Role) => set({ activeRole: role }),

    // ============================================================
    // TELEMETRY & DATA MANAGEMENT
    // ============================================================
    
    /** Real-time stadium telemetry data (gates, facilities, security zones) */
    telemetry: INITIAL_TELEMETRY,
    
    /** ISO timestamp of last telemetry refresh */
    lastRefreshed: new Date().toISOString(),
    
    /**
     * refreshTelemetry Action
     * Fetches new telemetry data (from mock generator in this demo).
     * In production, would call real API endpoint.
     * Updates both telemetry and lastRefreshed timestamp.
     */
    refreshTelemetry: () => {
      const updated = generateLiveTelemetry(get().telemetry);
      set({ telemetry: updated, lastRefreshed: new Date().toISOString() });
    },

    // ============================================================
    // AI CROWD ANALYSIS
    // ============================================================
    
    /** Latest AI-generated crowd analysis from Gemini */
    crowdAnalysis: null,
    
    /** Loading indicator for analysis generation */
    isAnalyzing: false,
    
    /** Error message if analysis failed */
    analysisError: null,
    
    /** Set the crowd analysis result */
    setCrowdAnalysis: (analysis: CrowdAnalysis | null) => set({ crowdAnalysis: analysis }),
    
    /** Set loading state during analysis generation */
    setIsAnalyzing: (v: boolean) => set({ isAnalyzing: v }),
    
    /** Set error message */
    setAnalysisError: (e: string | null) => set({ analysisError: e }),

    // ============================================================
    // ALERTS
    // ============================================================
    
    /** List of active AI alerts and warnings */
    aiAlerts: [],
    
    /** Replace entire alerts list */
    setAiAlerts: (alerts: AIAlert[]) => set({ aiAlerts: alerts }),
    
    /** Add new alert to front of list */
    addAlert: (alert: AIAlert) => set(state => ({ aiAlerts: [alert, ...state.aiAlerts] })),

    // ============================================================
    // TRANSLATION SERVICES
    // ============================================================
    
    /** Latest translation result from Gemini */
    translationResult: null,
    
    /** Loading indicator for translation */
    isTranslating: false,
    
    /** Error message if translation failed */
    translationError: null,
    
    /** ID of currently selected alert for translation */
    selectedAlertId: null,
    
    /** Target language for translation */
    selectedLanguage: null,
    
    /** Set translation result */
    setTranslationResult: (r: TranslationResult | null) => set({ translationResult: r }),
    
    /** Set translation loading state */
    setIsTranslating: (v: boolean) => set({ isTranslating: v }),
    
    /** Set translation error */
    setTranslationError: (e: string | null) => set({ translationError: e }),
    
    /** Select alert by ID for translation */
    setSelectedAlertId: (id: string | null) => set({ selectedAlertId: id }),
    
    /** Select target language for translation */
    setSelectedLanguage: (lang: SupportedLanguage | null) => set({ selectedLanguage: lang }),

    // ============================================================
    // FAN ROUTE GENERATION
    // ============================================================
    
    /** AI-generated personalized route to fan's seat */
    fanRoute: null,
    
    /** Loading indicator for route generation */
    isGeneratingRoute: false,
    
    /** Error message if route generation failed */
    routeError: null,
    
    /** Fan's input seat section (e.g., "A-12") */
    fanSeatInput: '',
    
    /** Set generated fan route */
    setFanRoute: (route: FanRoute | null) => set({ fanRoute: route }),
    
    /** Set route generation loading state */
    setIsGeneratingRoute: (v: boolean) => set({ isGeneratingRoute: v }),
    
    /** Set route generation error */
    setRouteError: (e: string | null) => set({ routeError: e }),
    
    /** Update fan seat input field */
    setFanSeatInput: (s: string) => set({ fanSeatInput: s }),
  }),
  {
    // Zustand devtools configuration
    // Enables Redux DevTools integration for debugging store state changes
    name: 'StadiumSync2026Store'
  })
);