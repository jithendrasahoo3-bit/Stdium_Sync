import type { FanRoute, StadiumTelemetry } from '../types';

interface GateMapping {
  gateId: string;
  defaultGateName: string;
  quadrant: 'North' | 'East' | 'South' | 'West';
  concourseLevel: number;
}

const GATE_LOCATIONS: GateMapping[] = [
  { gateId: 'gate-a', defaultGateName: 'Gate A — North Main', quadrant: 'North', concourseLevel: 1 },
  { gateId: 'gate-b', defaultGateName: 'Gate B — North East', quadrant: 'North', concourseLevel: 1 },
  { gateId: 'gate-c', defaultGateName: 'Gate C — East Entry', quadrant: 'East', concourseLevel: 1 },
  { gateId: 'gate-d', defaultGateName: 'Gate D — South East', quadrant: 'South', concourseLevel: 2 },
  { gateId: 'gate-e', defaultGateName: 'Gate E — South Main', quadrant: 'South', concourseLevel: 1 },
  { gateId: 'gate-f', defaultGateName: 'Gate F — West Entry', quadrant: 'West', concourseLevel: 1 },
  { gateId: 'gate-g', defaultGateName: 'Gate G — VIP North', quadrant: 'North', concourseLevel: 3 },
  { gateId: 'gate-h', defaultGateName: 'Gate H — Accessibility', quadrant: 'East', concourseLevel: 1 },
];

/**
 * Parses user seat input (e.g. "Section 105", "Sec 220, Row F", "West 310")
 * to determine stadium quadrant and concourse level.
 */
function parseSeatLocation(seatInput: string): { quadrant: 'North' | 'East' | 'South' | 'West'; level: number } {
  const normalized = seatInput.toLowerCase();

  // Extract any 3-digit section number like 102, 215, 330
  const sectionNumberMatch = normalized.match(/\b([1-3])(\d{2})\b/);

  if (sectionNumberMatch) {
    const levelDigit = parseInt(sectionNumberMatch[1], 10); // 1, 2, or 3
    const sectionNum = parseInt(sectionNumberMatch[1] + sectionNumberMatch[2], 10);

    // Section 100-115 / 200-215 / 300-315 = North
    // Section 116-130 / 216-230 / 316-330 = East
    // Section 131-145 / 231-245 / 331-345 = South
    // Remainder = West
    const lastTwo = parseInt(sectionNumberMatch[2], 10);
    let quadrant: 'North' | 'East' | 'South' | 'West' = 'North';
    if (lastTwo <= 15) quadrant = 'North';
    else if (lastTwo <= 30) quadrant = 'East';
    else if (lastTwo <= 45) quadrant = 'South';
    else quadrant = 'West';

    return { quadrant, level: levelDigit };
  }

  // Fallback string matching for directions
  if (normalized.includes('north')) return { quadrant: 'North', level: 1 };
  if (normalized.includes('east')) return { quadrant: 'East', level: 1 };
  if (normalized.includes('south')) return { quadrant: 'South', level: 1 };
  if (normalized.includes('west')) return { quadrant: 'West', level: 1 };
  if (normalized.includes('vip')) return { quadrant: 'North', level: 3 };

  return { quadrant: 'North', level: 1 };
}

/**
 * Intelligent Concourse Routing Algorithm
 * Selects optimal entry gate by balancing physical proximity against live gate congestion.
 */
export function calculateFanRoute(telemetry: StadiumTelemetry, seatSection: string): FanRoute {
  const { quadrant, level } = parseSeatLocation(seatSection);

  // Gates that are overloaded (>88% or critical)
  const congestedGates = telemetry.gates
    .filter((g) => g.status === 'critical' || g.percentage >= 88)
    .map((g) => g.name);

  // Score candidate gates: lower score is better
  // Score = proximity penalty (0 if same quadrant, 25 if adjacent, 50 if opposite) + congestion penalty (gate percentage)
  const candidates = telemetry.gates.map((gate) => {
    const mapping = GATE_LOCATIONS.find((m) => m.gateId === gate.id);
    const gateQuadrant = mapping ? mapping.quadrant : 'North';

    let proximityPenalty = 0;
    if (gateQuadrant === quadrant) {
      proximityPenalty = 0;
    } else if (
      (quadrant === 'North' && (gateQuadrant === 'East' || gateQuadrant === 'West')) ||
      (quadrant === 'South' && (gateQuadrant === 'East' || gateQuadrant === 'West')) ||
      (quadrant === 'East' && (gateQuadrant === 'North' || gateQuadrant === 'South')) ||
      (quadrant === 'West' && (gateQuadrant === 'North' || gateQuadrant === 'South'))
    ) {
      proximityPenalty = 20;
    } else {
      proximityPenalty = 45; // Opposite side of stadium
    }

    // Heavy penalty for congested gates to force rerouting
    const congestionPenalty = gate.status === 'critical' ? 100 : gate.percentage;
    const totalScore = proximityPenalty + congestionPenalty;

    return {
      gate,
      totalScore,
      proximityPenalty,
      mapping,
    };
  });

  // Sort by lowest score
  candidates.sort((a, b) => a.totalScore - b.totalScore);
  const bestCandidate = candidates[0].gate;

  // Compute realistic walk time: baseline 4 mins + 2 mins per concourse level + congestion delay
  const baseWalkTime = 4 + (level - 1) * 2;
  const queueDelay = Math.round((bestCandidate.percentage / 100) * 4);
  const estimatedWalkTime = Math.max(3, baseWalkTime + queueDelay);

  // Build turn-by-turn concourse steps
  const gateShortName = bestCandidate.name.split('—')[0].trim();
  const instructions: string[] = [
    `Arrive at ${bestCandidate.name} (current occupancy is ${bestCandidate.percentage}%).`,
    'Scan your mobile digital ticket at the turnstile and pass security checkpoint.',
    level > 1
      ? `Take the escalator on your right to Concourse Level ${level}.`
      : 'Continue along the ground concourse corridor toward the main pitch access.',
    `Follow overhead signage to ${seatSection.trim() || 'your designated sector'}. Staff stewards in green vests can assist with aisle locating.`,
  ];

  const rerouted = congestedGates.some((name) => name.toLowerCase().includes(quadrant.toLowerCase()));
  const aiNote = rerouted
    ? `Selected ${gateShortName} to bypass long turnstile delays at congested entry points in the ${quadrant} sector.`
    : `Direct entry via ${gateShortName} offers the shortest physical walking distance to your seat location.`;

  return {
    fanId: `fan-${Date.now().toString(36)}`,
    seatSection: seatSection.trim() || 'Section 105',
    recommendedGate: bestCandidate.name,
    avoidGates: congestedGates.filter((name) => name !== bestCandidate.name),
    estimatedWalkTime,
    instructions,
    aiNote,
    generatedAt: new Date().toISOString(),
  };
}
