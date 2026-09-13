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
      current: 12610,
      percentage: 97,
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
      crowdDensity: 3.8,
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

// Simulates periodic sensor fluctuations for live demo
export const generateLiveTelemetry = (base: StadiumTelemetry): StadiumTelemetry => {
  const rand = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  return {
    ...base,
    timestamp: new Date().toISOString(),
    currentOccupancy: base.currentOccupancy + rand(-200, 300),
    activeIncidents: Math.max(0, base.activeIncidents + rand(-1, 2)),
    gates: base.gates.map((gate) => {
      const delta = rand(-50, 100);
      const current = Math.min(gate.capacity, Math.max(0, gate.current + delta));
      const percentage = Math.round((current / gate.capacity) * 100);
      const status =
        percentage >= 95
          ? 'critical'
          : percentage >= 80
          ? 'high'
          : percentage >= 60
          ? 'moderate'
          : percentage >= 30
          ? 'low'
          : 'normal';

      return {
        ...gate,
        current,
        percentage,
        status,
        trend: delta > 20 ? 'rising' : delta < -20 ? 'falling' : 'stable',
        lastUpdated: new Date().toISOString(),
      };
    }),
    facilities: base.facilities.map((facility) => {
      const delta = rand(-5, 10);
      const occupancyPercentage = Math.min(100, Math.max(0, facility.occupancyPercentage + delta));
      return {
        ...facility,
        occupancyPercentage,
        queueLength: Math.max(0, facility.queueLength + rand(-5, 8)),
        operationalStatus:
          occupancyPercentage >= 90
            ? 'overloaded'
            : occupancyPercentage >= 60
            ? 'busy'
            : facility.operationalStatus === 'closed'
            ? 'closed'
            : 'open',
      };
    }),
  };
};

export const SUPPORTED_LANGUAGES = [
  { id: 'spanish', label: 'Español', flag: '🇪🇸', nativeName: 'Spanish' },
  { id: 'french', label: 'Français', flag: '🇫🇷', nativeName: 'French' },
  { id: 'arabic', label: 'العربية', flag: '🇸🇦', nativeName: 'Arabic' },
  { id: 'hindi', label: 'हिंदी', flag: '🇮🇳', nativeName: 'Hindi' },
  { id: 'portuguese', label: 'Português', flag: '🇧🇷', nativeName: 'Portuguese' },
  { id: 'german', label: 'Deutsch', flag: '🇩🇪', nativeName: 'German' },
  { id: 'japanese', label: '日本語', flag: '🇯🇵', nativeName: 'Japanese' },
  { id: 'mandarin', label: '普通话', flag: '🇨🇳', nativeName: 'Mandarin' },
] as const;
