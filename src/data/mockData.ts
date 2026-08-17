// ============================================================
// MOCK STADIUM TELEMETRY DATA — StadiumSync 2026
// Simulates real-time sensor data from MetLife Stadium, NJ
// FIFA World Cup 2026 - USA vs Brazil Group Stage Match
// ============================================================

import type { StadiumTelemetry } from '../types';

export const INITIAL_TELEMETRY: StadiumTelemetry = {
  stadiumName: 'MetLife Stadium',
  match: 'USA vs Brazil — Group Stage A',
  kickoffTime: '2026-07-16T19:00:00-04:00',
  totalCapacity: 82500,
  currentOccupancy: 71250,
  overallPercentage: 86,
  timestamp: new Date().toISOString(),

  gates: [
    {
      id: 'gate-a',
      name: 'Gate A — North Main',
      location: 'North Plaza, Section 100-115',
      capacity: 12000,
      current: 10200,
      percentage: 85,
      status: 'high',
      trend: 'rising',
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'gate-b',
      name: 'Gate B — North East',
      location: 'North East Plaza, Section 116-130',
      capacity: 10000,
      current: 2000,
      percentage: 20,
      status: 'low',
      trend: 'stable',
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'gate-c',
      name: 'Gate C — East Entry',
      location: 'East Side, Section 131-145',
      capacity: 11000,
      current: 9350,
      percentage: 85,
      status: 'high',
      trend: 'rising',
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'gate-d',
      name: 'Gate D — South East',
      location: 'South East, Section 200-215',
      capacity: 9500,
      current: 7885,
      percentage: 83,
      status: 'high',
      trend: 'stable',
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'gate-e',
      name: 'Gate E — South Main',
      location: 'South Plaza, Section 216-230',
      capacity: 13000,
      current: 12870,
      percentage: 99,
      status: 'critical',
      trend: 'rising',
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'gate-f',
      name: 'Gate F — West Entry',
      location: 'West Side, Section 300-315',
      capacity: 10500,
      current: 4200,
      percentage: 40,
      status: 'moderate',
      trend: 'rising',
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'gate-g',
      name: 'Gate G — VIP North',
      location: 'VIP Entrance, Level 3',
      capacity: 5000,
      current: 4250,
      percentage: 85,
      status: 'high',
      trend: 'stable',
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'gate-h',
      name: 'Gate H — Accessibility',
      location: 'East ADA Entrance, Ground Level',
      capacity: 2500,
      current: 495,
      percentage: 20,
      status: 'low',
      trend: 'stable',
      lastUpdated: new Date().toISOString(),
    },
  ],

  facilities: [
    {
      id: 'rest-c1',
      name: 'Restroom Block C1',
      type: 'restroom',
      zone: 'North Concourse',
      occupancyPercentage: 90,
      queueLength: 47,
      status: 'critical',
      operationalStatus: 'overloaded',
    },
    {
      id: 'rest-c2',
      name: 'Restroom Block C2',
      type: 'restroom',
      zone: 'East Concourse',
      occupancyPercentage: 65,
      queueLength: 22,
      status: 'moderate',
      operationalStatus: 'busy',
    },
    {
      id: 'rest-c3',
      name: 'Restroom Block C3',
      type: 'restroom',
      zone: 'West Concourse',
      occupancyPercentage: 30,
      queueLength: 4,
      status: 'low',
      operationalStatus: 'open',
    },
    {
      id: 'conc-1',
      name: 'Concession Stand Alpha',
      type: 'concession',
      zone: 'North Concourse',
      occupancyPercentage: 88,
      queueLength: 63,
      status: 'high',
      operationalStatus: 'overloaded',
    },
    {
      id: 'conc-2',
      name: 'Food Court Beta',
      type: 'concession',
      zone: 'South Concourse',
      occupancyPercentage: 71,
      queueLength: 34,
      status: 'high',
      operationalStatus: 'busy',
    },
    {
      id: 'conc-3',
      name: 'Concession Stand Delta',
      type: 'concession',
      zone: 'West Concourse',
      occupancyPercentage: 35,
      queueLength: 8,
      status: 'low',
      operationalStatus: 'open',
    },
    {
      id: 'med-1',
      name: 'Medical Station A',
      type: 'medical',
      zone: 'North Concourse',
      occupancyPercentage: 40,
      queueLength: 3,
      status: 'moderate',
      operationalStatus: 'open',
    },
    {
      id: 'park-1',
      name: 'Parking Lot P1',
      type: 'parking',
      zone: 'North External',
      occupancyPercentage: 95,
      queueLength: 120,
      status: 'critical',
      operationalStatus: 'overloaded',
    },
    {
      id: 'park-2',
      name: 'Parking Lot P3',
      type: 'parking',
      zone: 'West External',
      occupancyPercentage: 45,
      queueLength: 15,
      status: 'moderate',
      operationalStatus: 'open',
    },
  ],

  securityZones: [
    {
      id: 'sz-1',
      name: 'North Entry Plaza',
      crowdDensity: 3.8, // people/m²
      incidentCount: 2,
      patrolUnits: 8,
      riskLevel: 'orange',
    },
    {
      id: 'sz-2',
      name: 'South Gate Corridor',
      crowdDensity: 4.9,
      incidentCount: 5,
      patrolUnits: 12,
      riskLevel: 'red',
    },
    {
      id: 'sz-3',
      name: 'East Concourse',
      crowdDensity: 2.4,
      incidentCount: 0,
      patrolUnits: 6,
      riskLevel: 'yellow',
    },
    {
      id: 'sz-4',
      name: 'West Concourse',
      crowdDensity: 1.2,
      incidentCount: 0,
      patrolUnits: 4,
      riskLevel: 'green',
    },
    {
      id: 'sz-5',
      name: 'VIP & Press Zone',
      crowdDensity: 2.0,
      incidentCount: 0,
      patrolUnits: 10,
      riskLevel: 'green',
    },
  ],

  weatherConditions: {
    temperature: 28,
    humidity: 68,
    condition: 'Partly Cloudy',
  },

  medicalUnitsDeployed: 24,
  activeIncidents: 7,
};

// Simulate live telemetry by adding small random variance
/**\n * generateLiveTelemetry Function\n * Creates realistic simulated real-time telemetry updates from baseline data.\n * Used in production when live sensor data is unavailable, and for demonstrations.\n * \n * Simulation Approach:\n *   1. Adds random variance to crowd occupancy\n *   2. Updates gate percentages and congestion status\n *   3. Simulates facility queue changes\n *   4. Varies active incidents (safety events)\n *   5. Updates all timestamps to current time\n * \n * Variance Ranges:\n *   - Overall occupancy: ±200-300 people per update\n *   - Gate traffic: ±50-100 people per gate\n *   - Facility queues: ±5-8 people per facility\n *   - Incidents: -1 to +2 (resolving or escalating)\n * \n * Status Determination Logic:\n *   - Critical: >= 95% capacity\n *   - High: >= 80% capacity\n *   - Moderate: >= 60% capacity\n *   - Low: >= 30% capacity\n *   - Normal: < 30% capacity\n * \n * @param {StadiumTelemetry} base - Baseline telemetry to vary from\n * @returns {StadiumTelemetry} Updated telemetry with simulated changes\n */\nexport const generateLiveTelemetry = (base: StadiumTelemetry): StadiumTelemetry => {
  // Utility to generate random integer within range
  const variance = (min: number, max: number) => 
    Math.floor(Math.random() * (max - min + 1)) + min;

  return {
    ...base,
    timestamp: new Date().toISOString(),
    currentOccupancy: base.currentOccupancy + variance(-200, 300),
    activeIncidents: Math.max(0, base.activeIncidents + variance(-1, 2)),
    gates: base.gates.map(gate => {
      const delta = variance(-50, 100);
      const newCurrent = Math.min(gate.capacity, Math.max(0, gate.current + delta));
      const newPct = Math.round((newCurrent / gate.capacity) * 100);
      return {
        ...gate,
        current: newCurrent,
        percentage: newPct,
        status: newPct >= 95 ? 'critical' : newPct >= 80 ? 'high' : newPct >= 60 ? 'moderate' : newPct >= 30 ? 'low' : 'normal',
        trend: delta > 20 ? 'rising' : delta < -20 ? 'falling' : 'stable',
        lastUpdated: new Date().toISOString(),
      };
    }),
    facilities: base.facilities.map(fac => {
      const delta = variance(-5, 10);
      const newPct = Math.min(100, Math.max(0, fac.occupancyPercentage + delta));
      return {
        ...fac,
        occupancyPercentage: newPct,
        queueLength: Math.max(0, fac.queueLength + variance(-5, 8)),
        operationalStatus: newPct >= 90 ? 'overloaded' : newPct >= 60 ? 'busy' : fac.operationalStatus === 'closed' ? 'closed' : 'open',
      };
    }),
  };
};

/**\n * SUPPORTED_LANGUAGES Constant\n * Configuration for all languages supported by the AI translation service.\n * Used to populate language selector UI in the translation assistant.\n * \n * Each language includes:\n *   - id: Identifier matching SupportedLanguage type\n *   - label: Display name in English\n *   - flag: Unicode flag emoji for visual identification\n *   - nativeName: Official name in the native language\n * \n * Covers major World Cup regions and languages:\n *   - Europe: Spanish, French, German, Portuguese\n *   - Middle East: Arabic\n *   - South Asia: Hindi\n *   - East Asia: Japanese, Mandarin\n */\nexport const SUPPORTED_LANGUAGES = [
  { id: 'spanish', label: 'Español', flag: '🇪🇸', nativeName: 'Spanish' },
  { id: 'french', label: 'Français', flag: '🇫🇷', nativeName: 'French' },
  { id: 'arabic', label: 'العربية', flag: '🇸🇦', nativeName: 'Arabic' },
  { id: 'hindi', label: 'हिंदी', flag: '🇮🇳', nativeName: 'Hindi' },
  { id: 'portuguese', label: 'Português', flag: '🇧🇷', nativeName: 'Portuguese' },
  { id: 'german', label: 'Deutsch', flag: '🇩🇪', nativeName: 'German' },
  { id: 'japanese', label: '日本語', flag: '🇯🇵', nativeName: 'Japanese' },
  { id: 'mandarin', label: '普通话', flag: '🇨🇳', nativeName: 'Mandarin' },
] as const;
