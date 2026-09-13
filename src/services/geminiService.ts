import type {
  AIAlert,
  CrowdAnalysis,
  FanRoute,
  StadiumTelemetry,
  SupportedLanguage,
  TranslationResult,
} from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? '';
const MODEL = 'gemini-2.5-flash';
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}`;

export const isConfigured = (): boolean =>
  Boolean(API_KEY && API_KEY !== 'your_gemini_api_key_here');

function parseJSON<T>(text: string, fallback: T): T {
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // If the model wrapped JSON in additional prose or double fences
    const match = cleaned.match(/\{[\s\S]*\}/) || cleaned.match(/\[[\s\S]*\]/);
    if (match) {
      try {
        return JSON.parse(match[0]) as T;
      } catch {
        // Fall through to default fallback
      }
    }
    return fallback;
  }
}

async function callGemini(prompt: string, systemInstruction?: string): Promise<string> {
  if (!isConfigured()) {
    throw new Error('VITE_GEMINI_API_KEY is not configured in .env');
  }

  const body: Record<string, unknown> = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
  };

  if (systemInstruction) {
    body.system_instruction = { parts: [{ text: systemInstruction }] };
  }

  const res = await fetch(`${BASE_URL}:generateContent?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
    throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

export async function callGeminiStream(
  prompt: string,
  systemInstruction: string,
  onChunk: (text: string) => void
): Promise<void> {
  if (!isConfigured()) {
    throw new Error('VITE_GEMINI_API_KEY is not configured in .env');
  }

  const body: Record<string, unknown> = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    system_instruction: { parts: [{ text: systemInstruction }] },
    generationConfig: { temperature: 0.8, maxOutputTokens: 1024 },
  };

  const res = await fetch(`${BASE_URL}:streamGenerateContent?alt=sse&key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
    throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
  }

  const reader = res.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = '';
  let active = true;

  while (active) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const json = line.slice(6).trim();
      if (json === '[DONE]') {
        active = false;
        return;
      }
      try {
        const parsed = JSON.parse(json);
        const chunk = parsed?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
        if (chunk) onChunk(chunk);
      } catch {
        // Stream fragment may be split across lines
      }
    }
  }
}

export async function analyzeCrowd(telemetry: StadiumTelemetry): Promise<CrowdAnalysis> {
  if (!isConfigured()) {
    return getMockCrowdAnalysis(telemetry);
  }

  const telemetryJson = JSON.stringify({
    stadium: telemetry.stadiumName,
    match: telemetry.match,
    overallOccupancy: `${telemetry.overallPercentage}% (${telemetry.currentOccupancy}/${telemetry.totalCapacity})`,
    activeIncidents: telemetry.activeIncidents,
    gates: telemetry.gates.map((g) => ({
      name: g.name,
      occupancy: `${g.percentage}%`,
      status: g.status,
      queue: g.current,
    })),
    facilities: telemetry.facilities.map((f) => ({
      name: f.name,
      occupancy: `${f.occupancyPercentage}%`,
      status: f.operationalStatus,
    })),
    securityZones: telemetry.securityZones.map((z) => ({
      name: z.name,
      density: z.crowdDensity,
      risk: z.riskLevel,
    })),
  });

  const prompt = `Analyze this live stadium telemetry and return a structured assessment:
${telemetryJson}

Respond ONLY with valid JSON matching this structure:
{
  "summary": "Brief 2-3 sentence overview of stadium status",
  "bottlenecks": ["Specific bottleneck 1", "Specific bottleneck 2"],
  "strategy": [
    {
      "step": 1,
      "title": "Action title",
      "action": "Concrete operational action",
      "rationale": "Why this is recommended",
      "priority": "immediate" | "short-term" | "monitoring"
    }
  ],
  "riskAssessment": "Risk evaluation with primary concerns"
}`;

  try {
    const result = await callGemini(prompt);
    const parsed = parseJSON<CrowdAnalysis | null>(result, null);
    if (parsed && parsed.summary && parsed.strategy) {
      return { ...parsed, generatedAt: new Date().toISOString() };
    }
    throw new Error('Analysis response structure invalid');
  } catch (e) {
    console.warn('Using fallback crowd analysis:', e);
    return getMockCrowdAnalysis(telemetry);
  }
}

export async function generateAlerts(telemetry: StadiumTelemetry): Promise<AIAlert[]> {
  if (!isConfigured()) {
    return getMockAlerts(telemetry);
  }

  const prompt = `Generate actionable safety/crowd alerts for this stadium snapshot:
Occupancy: ${telemetry.overallPercentage}%
Critical Gates: ${telemetry.gates.filter((g) => g.status === 'critical').map((g) => g.name).join(', ') || 'None'}
High Density Zones: ${telemetry.securityZones.filter((z) => z.riskLevel === 'red' || z.riskLevel === 'orange').map((z) => z.name).join(', ') || 'None'}
Incidents: ${telemetry.activeIncidents}

Respond ONLY with valid JSON array:
[
  {
    "id": "alert-1",
    "severity": "critical" | "warning" | "info",
    "title": "Short title",
    "description": "What is happening",
    "affectedArea": "Specific gate, zone, or section",
    "recommendedAction": "Clear instruction for stewards/volunteers",
    "timestamp": "${new Date().toISOString()}"
  }
]`;

  try {
    const result = await callGemini(prompt);
    const parsed = parseJSON<AIAlert[] | null>(result, null);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    throw new Error('Alert structure invalid');
  } catch (e) {
    console.warn('Using fallback alerts:', e);
    return getMockAlerts(telemetry);
  }
}

export async function translateAlert(
  text: string,
  langCode: string,
  nativeName: string,
  langLabel: string
): Promise<TranslationResult> {
  if (!isConfigured()) {
    return {
      language: langCode as SupportedLanguage,
      languageLabel: langLabel,
      originalText: text,
      translatedText: `[Translation to ${langLabel}] ${text}`,
      culturalNote: `Simulated translation note: fans from ${nativeName} speaking regions appreciate calm instructions.`,
      generatedAt: new Date().toISOString(),
    };
  }

  const prompt = `Translate this safety announcement into ${langLabel} (${nativeName}) for World Cup fans:
"${text}"

Respond ONLY with valid JSON:
{
  "translatedText": "Translated statement",
  "originalText": "${text.replace(/"/g, "'")}",
  "language": "${langCode}",
  "languageLabel": "${langLabel}",
  "culturalNote": "Optional safety cultural context note, or null"
}`;

  try {
    const result = await callGemini(prompt);
    const parsed = parseJSON<TranslationResult | null>(result, null);
    if (parsed && parsed.translatedText) {
      return { ...parsed, generatedAt: new Date().toISOString() };
    }
    throw new Error('Bad translation JSON');
  } catch (e) {
    console.warn('Using fallback translation:', e);
    return {
      language: langCode as SupportedLanguage,
      languageLabel: langLabel,
      originalText: text,
      translatedText: `[Translated] ${text}`,
      culturalNote: 'Default communication guideline: speak clearly and point toward designated exits.',
      generatedAt: new Date().toISOString(),
    };
  }
}

export async function generateFanRoute(
  telemetry: StadiumTelemetry,
  seatSection: string
): Promise<FanRoute> {
  if (!isConfigured()) {
    return getMockFanRoute(telemetry, seatSection);
  }

  const openGates = telemetry.gates.filter((g) => g.status !== 'critical').map((g) => g.name).join(', ');
  const congestedGates = telemetry.gates.filter((g) => g.status === 'critical').map((g) => g.name).join(', ') || 'None';

  const prompt = `Find a safety navigation route to seat: ${seatSection}.
Available Entries: ${openGates}
Congested Entries to AVOID: ${congestedGates}

Respond ONLY with valid JSON:
{
  "seatSection": "${seatSection}",
  "recommendedGate": "Optimal entry gate name",
  "avoidGates": ["Gate names to avoid"],
  "estimatedWalkTime": 8,
  "instructions": [
    "Proceed to Recommended Gate",
    "Go through standard security checkpoint",
    "Take concourse corridor to seat"
  ],
  "aiNote": "Chosen to avoid congested gate bottlenecks."
}`;

  try {
    const result = await callGemini(prompt);
    const parsed = parseJSON<FanRoute>(result, {} as FanRoute);
    if (parsed.recommendedGate && parsed.instructions) {
      return {
        ...parsed,
        fanId: `fan-${Date.now()}`,
        generatedAt: new Date().toISOString(),
      };
    }
    throw new Error('Invalid Route JSON');
  } catch (e) {
    console.warn('Using fallback fan route:', e);
    return getMockFanRoute(telemetry, seatSection);
  }
}

function getMockCrowdAnalysis(telemetry: StadiumTelemetry): CrowdAnalysis {
  const criticalGates = telemetry.gates
    .filter((g) => g.status === 'critical')
    .map((g) => g.name.split('(')[0].trim());
  const busyFacilities = telemetry.facilities
    .filter((f) => f.occupancyPercentage > 75)
    .map((f) => f.name);

  return {
    summary: `Stadium operations running at ${telemetry.overallPercentage}% capacity. Main gates are generally flow-managed. ${
      criticalGates.length > 0
        ? `Wait times at ${criticalGates.join(' & ')} are higher than usual.`
        : 'All gates show stable flow rates.'
    }`,
    bottlenecks:
      criticalGates.length > 0
        ? [`${criticalGates.join(', ')} ingress bottlenecks`, 'Concourse food concessions congestion']
        : ['None detected', 'Normal concourse traffic'],
    strategy: [
      {
        step: 1,
        title: 'Redirect Inbound Traffic',
        action: `Reroute approaching fans from ${criticalGates.join(', ') || 'Gate A'} to Gate B and Concourse side entrances.`,
        rationale: `Gate capacities at ${criticalGates.join(', ') || 'Gate A'} have reached operational limits. Rerouting stabilizes check-in speed.`,
        priority: 'immediate',
      },
      {
        step: 2,
        title: 'Staff Deployment Adjustments',
        action: `Shift 4 safety stewards from low density Gate D to ${criticalGates[0] || 'Gate A'} ticketing lanes.`,
        rationale: 'Adding ticket validation operators decreases queuing density directly.',
        priority: 'short-term',
      },
      {
        step: 3,
        title: 'Concession Wait Times Alert',
        action: 'Push notifications to fan apps recommending restrooms and food options at Concourse 2.',
        rationale: `Facilities like ${busyFacilities[0] || 'Restroom 1'} are overloaded. Directing fans balances logistics.`,
        priority: 'monitoring',
      },
    ],
    riskAssessment: `Overall Risk Level: ${telemetry.activeIncidents > 5 ? 'High' : 'Moderate'}. Gate queues are under watch. Weather is ${telemetry.weatherConditions.condition}.`,
    generatedAt: new Date().toISOString(),
  };
}

function getMockAlerts(telemetry: StadiumTelemetry): AIAlert[] {
  const criticalGates = telemetry.gates.filter((g) => g.status === 'critical' || g.percentage > 80);

  return [
    {
      id: 'alert-mock-1',
      severity: criticalGates.length > 0 ? 'critical' : 'warning',
      title: 'Gate Congestion Advisory',
      description: `High ingress queue sizes detected at ${criticalGates[0]?.name || 'Gate A'}. Waiting time is exceeding 15 minutes.`,
      affectedArea: criticalGates[0]?.name || 'Gate A',
      recommendedAction: 'Direct arriving fans to neighboring gates and request ticket validations before security lines.',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'alert-mock-2',
      severity: 'warning',
      title: 'Concourse Facility Load',
      description: 'Restroom Concourse Level 1 is experiencing queue backlog. Capacity is over 80%.',
      affectedArea: 'Restroom Level 1',
      recommendedAction: 'Advise fans to use the restrooms on Concourse Level 2 near Sector 220.',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'alert-mock-3',
      severity: 'info',
      title: 'Weather Advisory Alert',
      description: `Weather is currently ${telemetry.weatherConditions.temperature}°C, ${telemetry.weatherConditions.condition}.`,
      affectedArea: 'Open Plaza Areas',
      recommendedAction: 'Remind fans to stay hydrated at designated cooling points around the stadium plaza.',
      timestamp: new Date().toISOString(),
    },
  ];
}

function getMockFanRoute(telemetry: StadiumTelemetry, seatSection: string): FanRoute {
  const lowUsageGate = [...telemetry.gates].sort((a, b) => a.percentage - b.percentage)[0]?.name || 'Gate B';
  const highUsageGates = telemetry.gates.filter((g) => g.status === 'critical').map((g) => g.name);

  return {
    fanId: `fan-${Date.now()}`,
    seatSection,
    recommendedGate: lowUsageGate,
    avoidGates: highUsageGates,
    estimatedWalkTime: 7,
    instructions: [
      `Arrive at ${lowUsageGate} entry check-in line (current occupancy is low).`,
      'Pass security checkpoint and head left to Concourse Escalators.',
      'Take escalator to Concourse Level 2.',
      `Follow the red aisle signs toward ${seatSection}.`,
    ],
    aiNote: `Route generated using ${lowUsageGate} to bypass heavy flow queues at congested gates.`,
    generatedAt: new Date().toISOString(),
  };
}
