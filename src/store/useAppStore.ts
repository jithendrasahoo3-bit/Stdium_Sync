
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AppState, Role, CrowdAnalysis, AIAlert, TranslationResult, SupportedLanguage, FanRoute } from '../types';
import { INITIAL_TELEMETRY, generateLiveTelemetry } from '../data/mockData';
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
const LS_KEY = 'stadiumsync_v3';
const loadAuth = (): { isAuthenticated: boolean; userProfile: UserProfile | null; activeRole: Role } => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
  }
  return { isAuthenticated: false, userProfile: null, activeRole: 'organizer' };
};

const saveAuth = (isAuthenticated: boolean, userProfile: UserProfile | null, activeRole: Role) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ isAuthenticated, userProfile, activeRole }));
  } catch {
    // Ignore localStorage write failures (quota exceeded, privacy mode)
  }
};

const clearAuth = () => {
  try {
    localStorage.removeItem(LS_KEY);
  } catch {
  }
};


const initial = loadAuth();
export interface AuthState {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  activeTheme: string; // 'default' | 'Portugal' | 'Argentina' | 'Brazil' | 'France' | 'USA'
  setAuthenticated: (profile: UserProfile) => void;
  setActiveTheme: (theme: string) => void;
  logout: () => void;
}

type FullState = AppState & AuthState;

export const useAppStore = create<FullState>()(
  devtools((set, get) => ({
    userProfile: initial.userProfile,
    activeTheme: 'default',
    setAuthenticated: (profile: UserProfile) => {
      saveAuth(true, profile, profile.role);
      set({
        isAuthenticated: true,
        userProfile: profile,
        activeRole: profile.role,
        activeTheme: profile.teamSupporting || 'default'
      });
    },
    setActiveTheme: (theme: string) => set({ activeTheme: theme }),
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
    activeRole: initial.activeRole,
    setActiveRole: (role: Role) => set({ activeRole: role }),
    telemetry: INITIAL_TELEMETRY,
    lastRefreshed: new Date().toISOString(),
    refreshTelemetry: () => {
      const updated = generateLiveTelemetry(get().telemetry);
      set({ telemetry: updated, lastRefreshed: new Date().toISOString() });
    },
    crowdAnalysis: null,
    isAnalyzing: false,
    analysisError: null,
    setCrowdAnalysis: (analysis: CrowdAnalysis | null) => set({ crowdAnalysis: analysis }),
    setIsAnalyzing: (v: boolean) => set({ isAnalyzing: v }),
    setAnalysisError: (e: string | null) => set({ analysisError: e }),
    aiAlerts: [],
    setAiAlerts: (alerts: AIAlert[]) => set({ aiAlerts: alerts }),
    addAlert: (alert: AIAlert) => set(state => ({ aiAlerts: [alert, ...state.aiAlerts] })),
    translationResult: null,
    isTranslating: false,
    translationError: null,
    selectedLanguage: null,
    setRouteError: (e: string | null) => set({ routeError: e }),
    setFanSeatInput: (s: string) => set({ fanSeatInput: s }),
  }),
  {
    name: 'StadiumSync2026Store'
  })
);
