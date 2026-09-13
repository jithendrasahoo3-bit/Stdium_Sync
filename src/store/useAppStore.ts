import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  AppState,
  Role,
  CrowdAnalysis,
  AIAlert,
  TranslationResult,
  SupportedLanguage,
  FanRoute,
} from '../types';
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

const STORAGE_KEY = 'stadiumsync_v3';

const loadAuth = (): { isAuthenticated: boolean; userProfile: UserProfile | null; activeRole: Role } => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore storage parse errors
  }
  return { isAuthenticated: false, userProfile: null, activeRole: 'organizer' };
};

const saveAuth = (isAuthenticated: boolean, userProfile: UserProfile | null, activeRole: Role) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ isAuthenticated, userProfile, activeRole }));
  } catch {
    // Fallback gracefully if storage is restricted
  }
};

const clearAuth = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Fallback gracefully
  }
};

const initial = loadAuth();

export interface AuthState {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  activeTheme: string;
  setAuthenticated: (profile: UserProfile) => void;
  setActiveTheme: (theme: string) => void;
  logout: () => void;
}

type FullState = AppState & AuthState;

export const useAppStore = create<FullState>()(
  devtools((set, get) => ({
    // Auth & theme
    isAuthenticated: initial.isAuthenticated,
    userProfile: initial.userProfile,
    activeTheme: 'default',
    setAuthenticated: (profile: UserProfile) => {
      saveAuth(true, profile, profile.role);
      set({
        isAuthenticated: true,
        userProfile: profile,
        activeRole: profile.role,
        activeTheme: profile.teamSupporting || 'default',
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
        fanRoute: null,
      });
    },

    // Role
    activeRole: initial.activeRole,
    setActiveRole: (role: Role) => set({ activeRole: role }),

    // Telemetry
    telemetry: INITIAL_TELEMETRY,
    lastRefreshed: new Date().toISOString(),
    refreshTelemetry: () => {
      const updated = generateLiveTelemetry(get().telemetry);
      set({ telemetry: updated, lastRefreshed: new Date().toISOString() });
    },

    // AI Analysis
    crowdAnalysis: null,
    isAnalyzing: false,
    analysisError: null,
    setCrowdAnalysis: (analysis: CrowdAnalysis | null) => set({ crowdAnalysis: analysis }),
    setIsAnalyzing: (v: boolean) => set({ isAnalyzing: v }),
    setAnalysisError: (e: string | null) => set({ analysisError: e }),

    // Alerts
    aiAlerts: [],
    setAiAlerts: (alerts: AIAlert[]) => set({ aiAlerts: alerts }),
    addAlert: (alert: AIAlert) => set((state) => ({ aiAlerts: [alert, ...state.aiAlerts] })),

    // Translation
    translationResult: null,
    isTranslating: false,
    translationError: null,
    selectedAlertId: null,
    selectedLanguage: null,
    setTranslationResult: (r: TranslationResult | null) => set({ translationResult: r }),
    setIsTranslating: (v: boolean) => set({ isTranslating: v }),
    setTranslationError: (e: string | null) => set({ translationError: e }),
    setSelectedAlertId: (id: string | null) => set({ selectedAlertId: id }),
    setSelectedLanguage: (lang: SupportedLanguage | null) => set({ selectedLanguage: lang }),

    // Fan Route
    fanRoute: null,
    isGeneratingRoute: false,
    routeError: null,
    fanSeatInput: '',
    setFanRoute: (route: FanRoute | null) => set({ fanRoute: route }),
    setIsGeneratingRoute: (v: boolean) => set({ isGeneratingRoute: v }),
    setRouteError: (e: string | null) => set({ routeError: e }),
    setFanSeatInput: (s: string) => set({ fanSeatInput: s }),
  }),
  {
    name: 'StadiumSyncStore',
  })
);
