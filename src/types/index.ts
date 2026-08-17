/**
 * ============================================================
 * SHARED TYPESCRIPT TYPES & INTERFACES — StadiumSync 2026
 * ============================================================
 * 
 * File: types/index.ts
 * Purpose: Centralized type definitions for all application entities.
 * This ensures type safety across the entire codebase and provides
 * a single source of truth for data structures.
 * 
 * Major Type Categories:
 *   1. Role & Access Control: Role, AlertSeverity
 *   2. Telemetry Data: GateTelemetry, FacilityTelemetry, StadiumTelemetry
 *   3. AI Analysis: CrowdAnalysis, AnalysisStep
 *   4. Alerts: AIAlert
 *   5. International: TranslationResult, SupportedLanguage
 *   6. User Features: FanRoute
 *   7. Global State: AppState (combined with AuthState in useAppStore)
 */

// ============================================================
// ROLE & ACCESS CONTROL TYPES
// ============================================================

/**
 * Role Type
 * Defines the three user roles in the application.
 * Each role has different page access and features.
 */
export type Role = 'organizer' | 'volunteer' | 'fan';

/**
 * AlertSeverity Type
 * Defines the severity levels for system alerts and notifications.
 * Used to prioritize and display alerts appropriately.
 */
export type AlertSeverity = 'critical' | 'warning' | 'info' | 'resolved';

/**
 * GateStatus Type
 * Describes the occupancy/congestion status of a stadium gate.
 * Used for real-time monitoring and status visualization.
 */
export type GateStatus = 'critical' | 'high' | 'moderate' | 'low' | 'normal';

// ============================================================
// TELEMETRY INTERFACES
// ============================================================

/**
 * GateTelemetry Interface
 * Real-time data for individual stadium gates (entry points).
 * Used by organizers to monitor crowd flow and gate efficiency.
 * 
 * @property {string} id - Unique gate identifier
 * @property {string} name - Human-readable gate name (e.g., "Gate A")
 * @property {string} location - Physical location (e.g., "North Side")
 * @property {number} capacity - Total capacity of the gate (people per hour)
 * @property {number} current - Current number of people passing through
 * @property {number} percentage - Occupancy percentage (0-100)
 * @property {GateStatus} status - Current congestion status
 * @property {'rising' | 'stable' | 'falling'} trend - Crowd flow trend
 * @property {string} lastUpdated - ISO timestamp of last data update
 */
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

/**
 * FacilityTelemetry Interface
 * Real-time data for stadium facilities (restrooms, concessions, medical, parking).
 * Helps organizers manage facility load and queue management.
 * 
 * @property {string} type - Type of facility (restroom, concession, medical, parking)
 * @property {number} queueLength - Number of people waiting
 * @property {'open' | 'busy' | 'overloaded' | 'closed'} operationalStatus
 */
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

/**
 * SecurityZone Interface
 * Data for security monitoring and incident tracking within stadium zones.
 * Used by volunteers to coordinate security responses and evacuations.
 * 
 * @property {number} crowdDensity - People per square meter
 * @property {'green' | 'yellow' | 'orange' | 'red'} riskLevel - Security risk assessment
 */
export interface SecurityZone {
  id: string;
  name: string;
  crowdDensity: number; // people per m²
  incidentCount: number;
  patrolUnits: number;
  riskLevel: 'green' | 'yellow' | 'orange' | 'red';
}

/**
 * StadiumTelemetry Interface
 * Comprehensive real-time telemetry for the entire stadium.
 * Aggregates data from all gates, facilities, and security zones.
 * Primary data source for organizer and volunteer dashboards.
 * 
 * @property {string} timestamp - Time of telemetry snapshot (ISO format)
 * @property {object} weatherConditions - Current stadium area weather
 * @property {number} medicalUnitsDeployed - Count of active medical teams
 * @property {number} activeIncidents - Count of ongoing security incidents
 */
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

// ============================================================
// AI ANALYSIS INTERFACES
// ============================================================

/**
 * AnalysisStep Interface
 * A single recommendation step from AI crowd analysis.
 * Part of a CrowdAnalysis strategy.
 * 
 * @property {number} step - Step sequence number (1, 2, 3...)
 * @property {'immediate' | 'short-term' | 'monitoring'} priority - Action urgency
 */
export interface AnalysisStep {
  step: number;
  title: string;
  action: string;
  rationale: string;
  priority: 'immediate' | 'short-term' | 'monitoring';
}

/**
 * CrowdAnalysis Interface
 * AI-generated analysis of stadium crowd conditions and recommendations.
 * Generated by Gemini API based on real-time telemetry data.
 * Primarily used by organizers and volunteers for decision-making.
 * 
 * @property {string} summary - High-level overview of crowd situation
 * @property {string[]} bottlenecks - Identified problem areas
 * @property {AnalysisStep[]} strategy - Recommended action plan
 * @property {string} riskAssessment - Overall risk level and concerns
 * @property {string} generatedAt - ISO timestamp of analysis generation
 */
export interface CrowdAnalysis {
  summary: string;
  bottlenecks: string[];
  strategy: AnalysisStep[];
  riskAssessment: string;
  generatedAt: string;
}

// ============================================================
// ALERT INTERFACE
// ============================================================

/**
 * AIAlert Interface
 * AI-generated alert about stadium conditions, incidents, or recommendations.
 * Alerts are translatable and can be broadcast to volunteers and fans.
 * 
 * @property {AlertSeverity} severity - Alert importance level
 * @property {string} recommendedAction - Suggested response
 * @property {Record<SupportedLanguage, string>} translatedVersions - Multi-language versions
 */
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

// ============================================================
// INTERNATIONALIZATION TYPES
// ============================================================

/**
 * SupportedLanguage Type
 * Languages supported for translation of alerts and messages.
 * Covers major World Cup attendee regions and languages.
 */
export type SupportedLanguage = 
  | 'spanish'
  | 'french'
  | 'arabic'
  | 'hindi'
  | 'portuguese'
  | 'german'
  | 'japanese'
  | 'mandarin';

/**
 * TranslationResult Interface
 * Result of translating a message to a target language.
 * Includes cultural context and formatting notes.
 * 
 * @property {string} culturalNote - Additional cultural context for the translation
 */
export interface TranslationResult {
  language: SupportedLanguage;
  languageLabel: string;
  originalText: string;
  translatedText: string;
  culturalNote?: string;
  generatedAt: string;
}

// ============================================================
// FAN FEATURES
// ============================================================

/**
 * FanRoute Interface
 * AI-generated personalized route for fans to reach their seats.
 * Takes into account current crowd conditions and gate availability.
 * 
 * @property {string} fanId - Associated fan user ID
 * @property {string} seatSection - Target seating section
 * @property {number} estimatedWalkTime - Estimated minutes to reach seat
 * @property {string[]} instructions - Step-by-step directions
 * @property {string} aiNote - Additional context or recommendations from AI
 */
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

// ============================================================
// GLOBAL APPLICATION STATE
// ============================================================

/**
 * AppState Interface
 * Defines all application state managed by Zustand store.
 * Combined with AuthState in useAppStore.
 * 
 * State is organized into logical sections:
 *   1. Role Management
 *   2. Telemetry & Data
 *   3. AI Analysis
 *   4. Alerts
 *   5. Translation
 *   6. Fan Routes
 */
export interface AppState {
  // ============================================================
  // ROLE MANAGEMENT
  // ============================================================
  /** Currently selected user role */
  activeRole: Role;
  /** Update active role */
  setActiveRole: (role: Role) => void;

  // ============================================================
  // TELEMETRY DATA & REFRESH
  // ============================================================
  /** Latest stadium telemetry snapshot */
  telemetry: StadiumTelemetry;
  /** ISO timestamp of last telemetry refresh */
  lastRefreshed: string;
  /** Function to manually refresh telemetry from API/mock data */
  refreshTelemetry: () => void;

  // ============================================================
  // AI CROWD ANALYSIS
  // ============================================================
  /** Latest AI-generated crowd analysis */
  crowdAnalysis: CrowdAnalysis | null;
  /** Loading state for analysis generation */
  isAnalyzing: boolean;
  /** Error message if analysis failed */
  analysisError: string | null;
  /** Set the crowd analysis result */
  setCrowdAnalysis: (analysis: CrowdAnalysis | null) => void;
  /** Set loading state */
  setIsAnalyzing: (v: boolean) => void;
  /** Set error message */
  setAnalysisError: (e: string | null) => void;

  // ============================================================
  // ALERTS
  // ============================================================
  /** List of active AI alerts */
  aiAlerts: AIAlert[];
  /** Replace entire alerts list */
  setAiAlerts: (alerts: AIAlert[]) => void;
  /** Add single alert to list */
  addAlert: (alert: AIAlert) => void;

  // ============================================================
  // TRANSLATION SERVICES
  // ============================================================
  /** Latest translation result */
  translationResult: TranslationResult | null;
  /** Loading state for translation */
  isTranslating: boolean;
  /** Error message if translation failed */
  translationError: string | null;
  /** Currently selected alert for translation */
  selectedAlertId: string | null;
  /** Currently selected target language */
  selectedLanguage: SupportedLanguage | null;
  /** Set translation result */
  setTranslationResult: (r: TranslationResult | null) => void;
  /** Set translation loading state */
  setIsTranslating: (v: boolean) => void;
  /** Set translation error */
  setTranslationError: (e: string | null) => void;
  /** Select an alert for translation */
  setSelectedAlertId: (id: string | null) => void;
  /** Select target language for translation */
  setSelectedLanguage: (lang: SupportedLanguage | null) => void;

  // ============================================================
  // FAN ROUTE GENERATION
  // ============================================================
  /** AI-generated personalized fan route */
  fanRoute: FanRoute | null;
  /** Loading state for route generation */
  isGeneratingRoute: boolean;
  /** Error message if route generation failed */
  routeError: string | null;
  /** Fan's input seat number/section */
  fanSeatInput: string;
  /** Set the generated fan route */
  setFanRoute: (route: FanRoute | null) => void;
  /** Set route generation loading state */
  setIsGeneratingRoute: (v: boolean) => void;
  /** Set route error message */
  setRouteError: (e: string | null) => void;
  /** Update fan seat input field */
  setFanSeatInput: (s: string) => void;
}
