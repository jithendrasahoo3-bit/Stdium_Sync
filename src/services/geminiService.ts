/**
 * ============================================================
 * GEMINI AI SERVICE — Real-time Crowd Analysis & Alerts
 * ============================================================
 * 
 * File: services/geminiService.ts
 * Purpose: Integrates Google's Gemini 2.5 Flash API for intelligent
 * crowd analysis, alert generation, real-time translation, and
 * personalized fan route recommendations.
 * 
 * Architecture:
 *   - REST API integration with fetch (works with all key formats)
 *   - Streaming support for real-time text generation
 *   - Robust JSON parsing with fallback mechanisms
 *   - Graceful degradation with mock data when API unavailable
 * 
 * Key Functions:
 *   1. analyzeCrowd() - Crowd logistics analysis
 *   2. generateAlerts() - Real-time safety alerts
 *   3. translateAlert() - Multi-language translation
 *   4. generateFanRoute() - Personalized seat directions
 * 
 * API Configuration:
 *   - Model: gemini-2.5-flash (fast, efficient for real-time use)
 *   - Key: From VITE_GEMINI_API_KEY environment variable
 *   - Base URL: Google Generative Language API v1beta
 * 
 * Error Handling:
 *   - Validates API key before requests
 *   - Catches network errors and falls back to mock data
 *   - Parses malformed JSON with cleanup and extraction
 *   - Never crashes the application
 */

// Gemini REST API service - works with all key formats
// Uses fetch directly to avoid SDK key format restrictions

/**
 * Environment Configuration
 */
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? '';
const MODEL = 'gemini-2.5-flash';
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}`;

// ============================================================
// CORE GEMINI API FUNCTIONS
// ============================================================

/**
 * callGemini Function
 * Makes a synchronous call to the Gemini API for text generation.
 * 
 * @param {string} prompt - The user prompt/instruction to process
 * @param {string} systemInstruction - Optional system role/context
 * @returns {Promise<string>} Generated text response
 * @throws {Error} If API key not configured or API returns error
 * 
 * Configuration:
 *   - Temperature: 0.7 (balanced creativity)
 *   - Max tokens: 2048 (substantial responses)
 *   - Format: Single turn conversation
 */
async function callGemini(prompt: string, systemInstruction?: string): Promise<string> {
  // Validate API key configuration
  if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
    throw new Error('VITE_GEMINI_API_KEY is not configured in .env');
  }

  // Build request body following Gemini API format
  const body: Record<string, unknown> = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
  };
  if (systemInstruction) {
    body.system_instruction = { parts: [{ text: systemInstruction }] };
  }

  // Send request to Gemini API
  const res = await fetch(`${BASE_URL}:generateContent?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  // Handle HTTP errors
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
    throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
  }

  // Extract response text
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

/**
 * callGeminiStream Function
 * Makes a streaming call to the Gemini API for real-time text generation.
 * Useful for immediate feedback during long operations.
 * 
 * @param {string} prompt - The user prompt/instruction
 * @param {string} systemInstruction - System role/context
 * @param {Function} onChunk - Callback function called for each text chunk
 * @returns {Promise<void>}
 * @throws {Error} If API key not configured or API returns error
 * 
 * Streaming Process:
 *   1. Opens Server-Sent Events (SSE) connection
 *   2. Buffers incoming data
 *   3. Parses JSON-formatted chunks
 *   4. Calls onChunk callback for each chunk
 *   5. Handles stream completion
 */
async function callGeminiStream(
  prompt: string,
  systemInstruction: string,
  onChunk: (text: string) => void
): Promise<void> {
  // Validate API key configuration
  if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
    throw new Error('VITE_GEMINI_API_KEY is not configured in .env');
  }

  // Build request body for streaming
  const body: Record<string, unknown> = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    system_instruction: { parts: [{ text: systemInstruction }] },
    generationConfig: { temperature: 0.8, maxOutputTokens: 1024 },
  };

  // Open streaming connection
  const res = await fetch(`${BASE_URL}:streamGenerateContent?alt=sse&key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  // Handle HTTP errors
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
    throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
  }

  // Process streaming response
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let active = true;

  // Read stream until completion
  while (active) {
    const { done, value } = await reader.read();
    if (done) {
      active = false;
      break;
    }

    // Decode chunk and add to buffer
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    // Process complete lines from SSE format
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

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * parseJSON Function
 * Attempts to parse JSON string with multiple fallback strategies.
 * Handles common formatting issues like markdown code fences.
 * 
 * @template T
 * @param {string} text - Raw text to parse
 * @param {T} fallback - Default value if parsing fails
 * @returns {T} Parsed object or fallback value
 * 
 * Cleanup Strategies:
 *   1. Remove markdown code fence markers (```json)
 *   2. Direct JSON parse
 *   3. Extract JSON substring from text
 *   4. Return fallback if all strategies fail
 */
function parseJSON<T>(text: string, fallback: T): T {
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // If double fenced or raw string matching
    const match = cleaned.match(/\{[\s\S]*\}/) || cleaned.match(/\[[\s\S]*\]/);
    if (match) {
      try {
        return JSON.parse(match[0]) as T;
      } catch {
        // Ignore nested JSON parse errors
      }
    }
    return fallback;
  }
}

/**
 * isConfigured Function
 * Checks if the Gemini API key is properly configured.
 * Returns false if key is missing or contains placeholder value.
 * 
 * @returns {boolean} True if API is usable
 */
// Helper to check if API key is invalid or placeholder
const isConfigured = () => API_KEY && API_KEY !== 'your_gemini_api_key_here';

// ── Crowd Analysis ─────────────────────────────────────────
export async function analyzeCrowd(telemetry: import('../types').StadiumTelemetry): Promise<import('../types').CrowdAnalysis> {
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

  const prompt = `You are a stadium safety director at ${telemetry.stadiumName} for FIFA World Cup 2026.
Analyze this telemetry and provide crowd logistics insights:
${telemetryJson}

Respond ONLY with valid JSON in this exact structure:
{
  "summary": "Detailed 2-3 sentence summary of stadium logistics.",
  "bottlenecks": ["Location A showing high wait times", "Location B density rising"],
  "strategy": [
    {
      "step": 1,
      "title": "Immediate Actions",
      "action": "Instructions for crowd controllers",
      "rationale": "Explainable AI justification",
      "priority": "immediate"
    },
    {
      "step": 2,
      "title": "Short-Term Adjustments",
      "action": "Actions for next 15-30 minutes",
      "rationale": "Data support",
      "priority": "short-term"
    },
    {
      "step": 3,
      "title": "Monitoring",
      "action": "Monitoring metrics",
      "rationale": "Proactive safety reasons",
      "priority": "monitoring"
    }
  ],
  "riskAssessment": "Detailed safety risk level statement."
}`;

  try {
    const text = await callGemini(prompt);
    const parsed = parseJSON<import('../types').CrowdAnalysis>(text, {} as unknown as import('../types').CrowdAnalysis);
    if (parsed.summary && parsed.strategy && parsed.strategy.length > 0) {
      return { ...parsed, generatedAt: new Date().toISOString() };
    }
    throw new Error('Invalid JSON structure');
  } catch (e) {
    console.warn('Gemini API failed or returned bad format, using telemetry-driven fallback:', e);
    return getMockCrowdAnalysis(telemetry);
  }
}

// ── Generate Alerts ────────────────────────────────────────
export async function generateAlerts(telemetry: import('../types').StadiumTelemetry): Promise<import('../types').AIAlert[]> {
  if (!isConfigured()) {
    return getMockAlerts(telemetry);
  }

  const criticalGates = telemetry.gates.filter(g => g.status === 'critical' || g.status === 'high');
  const criticalFacilities = telemetry.facilities.filter(f => f.operationalStatus === 'overloaded');
  const prompt = `Based on these critical indicators:
- Congested Gates: ${criticalGates.map(g => g.name).join(', ') || 'None'}
- Facilities Overloaded: ${criticalFacilities.map(f => f.name).join(', ') || 'None'}
- Active Incidents: ${telemetry.activeIncidents}

Generate 3 actionable safety alerts for volunteers on-ground.
Respond ONLY with a valid JSON array:
[
  {
    "id": "alert-1",
    "severity": "critical|warning|info",
    "title": "Short alert title",
    "description": "Logistics issue detail",
    "affectedArea": "Gate/Facility name",
    "recommendedAction": "Instructions for the volunteer",
    "timestamp": "${new Date().toISOString()}"
  }
]`;

  try {
    const text = await callGemini(prompt);
    const parsed = parseJSON<import('../types').AIAlert[]>(text, []);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    throw new Error('Alert structure invalid');
  } catch (e) {
    return getMockAlerts(telemetry);
  }
}

// ── Translation ────────────────────────────────────────────
export async function translateAlert(text: string, langCode: string, nativeName: string, langLabel: string): Promise<import('../types').TranslationResult> {
  if (!isConfigured()) {
    return {
      language: langCode as import('../types').SupportedLanguage,
      languageLabel: langLabel,
      originalText: text,
      translatedText: `[Translation to ${langLabel}] ${text}`,
      culturalNote: `Simulated translation note: fans from ${nativeName} speaking regions appreciate calm instructions.`,
      generatedAt: new Date().toISOString()
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
    const parsed = parseJSON<import('../types').TranslationResult | null>(result, null);
    if (parsed && parsed.translatedText) {
      return { ...parsed, generatedAt: new Date().toISOString() };
    }
    throw new Error('Bad translation JSON');
  } catch (e) {
    return {
      language: langCode as import('../types').SupportedLanguage,
      languageLabel: langLabel,
      originalText: text,
      translatedText: `[Translated] ${text}`,
      culturalNote: 'Default communication guideline: speak clearly and point toward designated exits.',
      generatedAt: new Date().toISOString()
    };
  }
}

// ── Fan Route ─────────────────────────────────────────────
export async function generateFanRoute(telemetry: import('../types').StadiumTelemetry, seatSection: string): Promise<import('../types').FanRoute> {
  if (!isConfigured()) {
    return getMockFanRoute(telemetry, seatSection);
  }

  const openGates = telemetry.gates.filter(g => g.status !== 'critical').map(g => g.name).join(', ');
  const congestedGates = telemetry.gates.filter(g => g.status === 'critical').map(g => g.name).join(', ') || 'None';

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
    const parsed = parseJSON<import('../types').FanRoute>(result, {} as unknown as import('../types').FanRoute);
    if (parsed.recommendedGate && parsed.instructions) {
      return {
        ...parsed,
        fanId: `fan-${Date.now()}`,
        generatedAt: new Date().toISOString()
      };
    }
    throw new Error('Invalid Route JSON');
  } catch (e) {
    return getMockFanRoute(telemetry, seatSection);
  }
}

// ── High Quality Telemetry-Driven Fallback / Mock Generators ──
function getMockCrowdAnalysis(telemetry: import('../types').StadiumTelemetry): import('../types').CrowdAnalysis {
  const criticalGates = telemetry.gates.filter(g => g.status === 'critical').map(g => g.name.split('(')[0].trim());
  const busyFacilities = telemetry.facilities.filter(f => f.occupancyPercentage > 75).map(f => f.name);

  return {
    summary: `Stadium operations running at ${telemetry.overallPercentage}% capacity. Main gates are generally flow-managed. ${criticalGates.length > 0 ? 'Wait times at ' + criticalGates.join(' & ') + ' are higher than usual.' : 'All gates show stable flow rates.'}`,
    bottlenecks: criticalGates.length > 0 
      ? [`${criticalGates.join(', ')} ingress bottlenecks`, 'Concourse food concessions congestion']
      : ['None detected', 'Normal concourse traffic'],
    strategy: [
      {
        step: 1,
        title: 'Redirect Inbound Traffic',
        action: `Reroute approaching fans from ${criticalGates.join(', ') || 'Gate A'} to Gate B and Concourse side entrances.`,
        rationale: `Gate capacities at ${criticalGates.join(', ') || 'Gate A'} have reached operational limits. Rerouting stabilizes check-in speed.`,
        priority: 'immediate'
      },
      {
        step: 2,
        title: 'Staff Deployment Adjustments',
        action: `Shift 4 safety stewards from low density Gate D to ${criticalGates[0] || 'Gate A'} ticketing lanes.`,
        rationale: 'Adding ticket validation operators decreases queuing density directly.',
        priority: 'short-term'
      },
      {
        step: 3,
        title: 'Concession Wait Times Alert',
        action: `Push notifications to fan apps recommending restrooms and food options at Concourse 2.`,
        rationale: `Facilities like ${busyFacilities[0] || 'Restroom 1'} are overloaded. Directing fans balances logistics.`,
        priority: 'monitoring'
      }
    ],
    riskAssessment: `Overall Risk Level: ${telemetry.activeIncidents > 5 ? 'High' : 'Moderate'}. Gate queues are under watch. Weather is ${telemetry.weatherConditions.condition}.`,
    generatedAt: new Date().toISOString()
  };
}

function getMockAlerts(telemetry: import('../types').StadiumTelemetry): import('../types').AIAlert[] {
  const criticalGates = telemetry.gates.filter(g => g.status === 'critical' || g.percentage > 80);
  return [
    {
      id: 'alert-mock-1',
      severity: criticalGates.length > 0 ? 'critical' : 'warning',
      title: 'Gate Congestion Advisory',
      description: `High ingress queue sizes detected at ${criticalGates[0]?.name || 'Gate A'}. Waiting time is exceeding 15 minutes.`,
      affectedArea: criticalGates[0]?.name || 'Gate A',
      recommendedAction: 'Direct arriving fans to neighboring gates and request ticket validations before security lines.',
      timestamp: new Date().toISOString()
    },
    {
      id: 'alert-mock-2',
      severity: 'warning',
      title: 'Concourse Facility Load',
      description: 'Restroom Concourse Level 1 is experiencing queue backlog. Capacity is over 80%.',
      affectedArea: 'Restroom Level 1',
      recommendedAction: 'Advise fans to use the restrooms on Concourse Level 2 near Sector 220.',
      timestamp: new Date().toISOString()
    },
    {
      id: 'alert-mock-3',
      severity: 'info',
      title: 'Weather Advisory Alert',
      description: `Weather is currently ${telemetry.weatherConditions.temperature}°C, ${telemetry.weatherConditions.condition}.`,
      affectedArea: 'Open Plaza Areas',
      recommendedAction: 'Remind fans to stay hydrated at designated cooling points around the stadium plaza.',
      timestamp: new Date().toISOString()
    }
  ];
}

function getMockFanRoute(telemetry: import('../types').StadiumTelemetry, seatSection: string): import('../types').FanRoute {
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