
export type Role = 'organizer' | 'volunteer' | 'fan';
export type AlertSeverity = 'critical' | 'warning' | 'info' | 'resolved';
export type GateStatus = 'critical' | 'high' | 'moderate' | 'low' | 'normal';
export interface GateTelemetry {
  id: string;
  name: string;
  location: string;
  capacity: number;
  current: number;
  percentage: number;
  status: GateStatus;
  trend: 'rising' | 'stable' | 'falling';
  lastUpdated: string;
}

export interface FacilityTelemetry {
  id: string;
  name: string;
  type: 'restroom' | 'concession' | 'medical' | 'parking';
  zone: string;
  occupancyPercentage: number;
  queueLength: number;
  status: GateStatus;
  operationalStatus: 'open' | 'busy' | 'overloaded' | 'closed';
}
export interface SecurityZone {
  id: string;
  name: string;
  crowdDensity: number; // people per m²
  incidentCount: number;
  patrolUnits: number;
  riskLevel: 'green' | 'yellow' | 'orange' | 'red';
}

export interface StadiumTelemetry {
  stadiumName: string;
  match: string;
  kickoffTime: string;
  totalCapacity: number;
  currentOccupancy: number;
  overallPercentage: number;
  timestamp: string;
  gates: GateTelemetry[];
  facilities: FacilityTelemetry[];
  securityZones: SecurityZone[];
  weatherConditions: {
    temperature: number;
    humidity: number;
    condition: string;
  };
  medicalUnitsDeployed: number;
  activeIncidents: number;
}
export interface AnalysisStep {
  step: number;
  title: string;
  action: string;
  rationale: string;
  priority: 'immediate' | 'short-term' | 'monitoring';
}

export interface CrowdAnalysis {
  summary: string;
  bottlenecks: string[];
  strategy: AnalysisStep[];
  riskAssessment: string;
  generatedAt: string;
}
export interface AIAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  affectedArea: string;
  recommendedAction: string;
  timestamp: string;
  translatedVersions?: Record<SupportedLanguage, string>;
}

export type SupportedLanguage = 
  | 'spanish'
  | 'french'
  | 'arabic'
  | 'hindi'
  | 'portuguese'
  | 'german'
  | 'japanese'
  | 'mandarin';
export interface TranslationResult {
  language: SupportedLanguage;
  languageLabel: string;
  originalText: string;
  translatedText: string;
  culturalNote?: string;
  generatedAt: string;
}

export interface FanRoute {
  fanId: string;
  seatSection: string;
  recommendedGate: string;
  avoidGates: string[];
  estimatedWalkTime: number;
  instructions: string[];
  aiNote: string;
  generatedAt: string;
}
export interface AppState {
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  telemetry: StadiumTelemetry;
  lastRefreshed: string;
  refreshTelemetry: () => void;
  crowdAnalysis: CrowdAnalysis | null;
  analysisError: string | null;
  setCrowdAnalysis: (analysis: CrowdAnalysis | null) => void;
  setIsAnalyzing: (v: boolean) => void;
  setAnalysisError: (e: string | null) => void;
  aiAlerts: AIAlert[];
  setAiAlerts: (alerts: AIAlert[]) => void;
  addAlert: (alert: AIAlert) => void;
  translationResult: TranslationResult | null;
  isTranslating: boolean;
  translationError: string | null;
  setTranslationResult: (r: TranslationResult | null) => void;
  setSelectedLanguage: (lang: SupportedLanguage | null) => void;
  fanRoute: FanRoute | null;
  isGeneratingRoute: boolean;
  routeError: string | null;
  fanSeatInput: string;  
  setFanRoute: (route: FanRoute | null) => void;
  setIsGeneratingRoute: (v: boolean) => void;
  setRouteError: (e: string | null) => void;
  setFanSeatInput: (s: string) => void;
}
