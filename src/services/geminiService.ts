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

async function callGemini(prompt: string, systemInstruction?: string): Promise<string> {
  if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
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

async function callGeminiStream(
  prompt: string,
  systemInstruction: string,
  onChunk: (text: string) => void
): Promise<void> {
  if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
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

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let active = true;

  while (active) {
    const { done, value } = await reader.read();
    if (done) {
      active = false;
      break;
    }

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
        // Ignore json chunk parse errors (may be incomplete)
      }
    }
  }
}

export async function analyzeCrowd(telemetry: StadiumTelemetry): Promise<CrowdAnalysis> {
  // If not configured, fall back to clean, high-fidelity mock generated instantly to prevent crash
  if (!isConfigured()) {
    return getMockCrowdAnalysis(telemetry);
  }

  const telemetryJson = JSON.stringify({
    stadium: telemetry.stadiumName,
    match: telemetry.match,
    overallOccupancy: `${telemetry.overallPercentage}% (${telemetry.currentOccupancy}/${telemetry.totalCapacity})`,
    activeIncidents: telemetry.activeIncidents,
    gates: telemetry.gates.map(g => ({ name: g.name, occupancy: `${g.percentage}%`, status: g.status, queue: g.current })),
    facilities: telemetry.facilities.map(f => ({ name: f.name, occupancy: `${f.occupancyPercentage}%`, status: f.operationalStatus })),
    securityZones: telemetry.securityZones.map(z => ({ name: z.name, density: z.crowdDensity, risk: z.riskLevel }))
  });

export async function generateAlerts(telemetry: StadiumTelemetry): Promise<AIAlert[]> {
  if (!isConfigured()) {
    return getMockAlerts(telemetry);
  }

function getMockFanRoute(telemetry: StadiumTelemetry, seatSection: string): FanRoute {
  const lowUsageGate = [...telemetry.gates].sort((a,b) => a.percentage - b.percentage)[0]?.name || 'Gate B';
  const highUsageGates = telemetry.gates.filter(g => g.status === 'critical').map(g => g.name);

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
      `Follow the red aisle signs toward ${seatSection}.`
    ],
    aiNote: `Route generated using ${lowUsageGate} to bypass heavy flow queues at congested gates.`,
    generatedAt: new Date().toISOString()
  };
}

export { callGeminiStream };
