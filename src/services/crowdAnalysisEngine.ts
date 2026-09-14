import type { CrowdAnalysis, StadiumTelemetry, AIAlert } from '../types';

/**
 * Deterministic Crowd Analysis Engine
 * Evaluates real-time gate throughput, queue ratios, and facility pressure
 * to detect bottlenecks and generate operational re-routing strategies.
 */
export function calculateCrowdAnalysis(telemetry: StadiumTelemetry): CrowdAnalysis {
  const gates = telemetry.gates;
  const criticalGates = gates.filter((g) => g.percentage >= 90 || g.status === 'critical');
  const highGates = gates.filter((g) => g.percentage >= 80 && g.percentage < 90);
  const lowGates = gates.filter((g) => g.percentage <= 40);

  // Identify specific physical bottlenecks
  const bottlenecks: string[] = [];

  criticalGates.forEach((gate) => {
    bottlenecks.push(`${gate.name}: Ingress at ${gate.percentage}% capacity (${gate.current.toLocaleString()} / ${gate.capacity.toLocaleString()} queued)`);
  });

  const overloadedFacilities = telemetry.facilities.filter(
    (f) => f.operationalStatus === 'overloaded' || f.occupancyPercentage >= 85
  );
  overloadedFacilities.forEach((fac) => {
    bottlenecks.push(`${fac.name} in ${fac.zone}: Queue length ${fac.queueLength} (${fac.occupancyPercentage}% full)`);
  });

  const highRiskZones = telemetry.securityZones.filter(
    (z) => z.riskLevel === 'red' || z.riskLevel === 'orange' || z.crowdDensity >= 3.5
  );
  highRiskZones.forEach((z) => {
    bottlenecks.push(`${z.name}: High crowd density at ${z.crowdDensity} people/m²`);
  });

  if (bottlenecks.length === 0) {
    bottlenecks.push('No severe bottlenecks detected. Ingress traffic is currently balanced.');
  }

  // Generate prioritized operational strategy
  const strategy = [];

  if (criticalGates.length > 0 && lowGates.length > 0) {
    const fromGate = criticalGates[0].name.split('—')[0].trim();
    const toGate = lowGates[0].name.split('—')[0].trim();
    strategy.push({
      step: 1,
      title: `Redirect Inbound Flow from ${fromGate} to ${toGate}`,
      action: `Deploy digital signages on outer concourse directing approaching fans from ${fromGate} toward ${toGate} (current load is only ${lowGates[0].percentage}%).`,
      rationale: `${fromGate} has reached operational limits (${criticalGates[0].percentage}%). Rerouting 25% of approaching traffic stabilizes turnstile validation.`,
      priority: 'immediate' as const,
    });
  } else {
    strategy.push({
      step: 1,
      title: 'Maintain Active Turnstile Cadence',
      action: 'Keep all standard turnstiles and security lanes active to sustain steady inbound velocity.',
      rationale: 'Overall stadium capacity is well within manageable thresholds.',
      priority: 'immediate' as const,
    });
  }

  if (highRiskZones.length > 0) {
    strategy.push({
      step: 2,
      title: `Reinforce Safety Stewards in ${highRiskZones[0].name}`,
      action: `Reallocate 4 safety stewards from low-density sectors to ${highRiskZones[0].name} to manage line discipline.`,
      rationale: `Density in ${highRiskZones[0].name} is ${highRiskZones[0].crowdDensity} p/m² with ${highRiskZones[0].incidentCount} reported incidents. Active steward presence calms choke points.`,
      priority: 'short-term' as const,
    });
  } else {
    strategy.push({
      step: 2,
      title: 'Routine Concourse Patrols',
      action: 'Maintain standard perimeter monitoring across concourse corridors.',
      rationale: 'Density metrics across all security zones remain within safe operational levels.',
      priority: 'short-term' as const,
    });
  }

  if (overloadedFacilities.length > 0) {
    strategy.push({
      step: 3,
      title: `Concession & Restroom Balance Alert`,
      action: `Broadcast notifications on fan mobile screens recommending alternative facilities in East/West concourses.`,
      rationale: `${overloadedFacilities[0].name} has an estimated queue of ${overloadedFacilities[0].queueLength} fans. Directing fans to adjacent blocks evens the load.`,
      priority: 'monitoring' as const,
    });
  } else {
    strategy.push({
      step: 3,
      title: 'Facility Load Monitoring',
      action: 'Track turnstile and concession usage rates as kickoff approaches.',
      rationale: 'Queue lengths are currently balanced with no facility over-capacity.',
      priority: 'monitoring' as const,
    });
  }

  // Summary and Risk assessment
  const overallRisk =
    criticalGates.length >= 2 || telemetry.activeIncidents >= 8
      ? 'High Risk: Multiple entry gates are at operational saturation. Coordinated rerouting required.'
      : criticalGates.length === 1 || telemetry.activeIncidents >= 4
      ? 'Moderate Risk: Isolated bottleneck at main entry gates. Managed flow recommended.'
      : 'Normal Risk: Gate flow rates and concourse densities are stable.';

  const summary = `Stadium operations are currently tracking at ${telemetry.overallPercentage}% capacity (${telemetry.currentOccupancy.toLocaleString()} / ${telemetry.totalCapacity.toLocaleString()} fans). ${
    criticalGates.length > 0
      ? `High congestion observed at ${criticalGates.map((g) => g.name.split('—')[0].trim()).join(', ')}.`
      : 'All primary access gates are functioning within standard flow rates.'
  } Weather is ${telemetry.weatherConditions.temperature}°C (${telemetry.weatherConditions.condition}).`;

  return {
    summary,
    bottlenecks,
    strategy,
    riskAssessment: overallRisk,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Generates automated alerts based on live sensor thresholds
 */
export function calculateAlerts(telemetry: StadiumTelemetry): AIAlert[] {
  const alerts: AIAlert[] = [];

  telemetry.gates.forEach((gate) => {
    if (gate.status === 'critical' || gate.percentage >= 92) {
      alerts.push({
        id: `alert-gate-${gate.id}`,
        severity: 'critical',
        title: `Congestion Alert: ${gate.name}`,
        description: `Queue occupancy is at ${gate.percentage}% (${gate.current.toLocaleString()} fans). Flow trend is ${gate.trend}.`,
        affectedArea: gate.name,
        recommendedAction: `Direct incoming fans to adjacent entry points and open auxiliary validation scanners.`,
        timestamp: new Date().toISOString(),
      });
    } else if (gate.percentage >= 80 && gate.trend === 'rising') {
      alerts.push({
        id: `alert-gate-warning-${gate.id}`,
        severity: 'warning',
        title: `Gate Approaching Capacity: ${gate.name}`,
        description: `Inflow rate rising rapidly at ${gate.percentage}% capacity.`,
        affectedArea: gate.name,
        recommendedAction: `Deploy line management stanchions to organize turnstile queues.`,
        timestamp: new Date().toISOString(),
      });
    }
  });

  telemetry.facilities.forEach((fac) => {
    if (fac.operationalStatus === 'overloaded' || fac.occupancyPercentage >= 90) {
      alerts.push({
        id: `alert-facility-${fac.id}`,
        severity: 'warning',
        title: `Facility Overload: ${fac.name}`,
        description: `Queue has reached ${fac.queueLength} people with ${fac.occupancyPercentage}% capacity utilized.`,
        affectedArea: `${fac.zone} - ${fac.name}`,
        recommendedAction: `Direct fans via digital signage to nearby facilities on Concourse Level 2.`,
        timestamp: new Date().toISOString(),
      });
    }
  });

  if (telemetry.activeIncidents >= 5) {
    alerts.push({
      id: `alert-security-incidents`,
      severity: 'critical',
      title: `Elevated Incident Count (${telemetry.activeIncidents} Active)`,
      description: `Higher than normal incident volume reported across perimeter security sectors.`,
      affectedArea: `Perimeter Security & Concourse`,
      recommendedAction: `Coordinate response with stadium medical and safety teams.`,
      timestamp: new Date().toISOString(),
    });
  }

  // Always ensure at least one informational alert if operations are nominal
  if (alerts.length === 0) {
    alerts.push({
      id: `alert-nominal-status`,
      severity: 'info',
      title: 'Stadium Operations Nominal',
      description: `All gate entries and concourse facilities are operating within normal queue parameters.`,
      affectedArea: 'All Stadium Sectors',
      recommendedAction: 'Continue standard monitoring protocol.',
      timestamp: new Date().toISOString(),
    });
  }

  return alerts;
}
