import type {
  AIAlert,
  CrowdAnalysis,
  FanRoute,
  StadiumTelemetry,
  SupportedLanguage,
  TranslationResult,
} from '../types';
import { calculateCrowdAnalysis, calculateAlerts } from './crowdAnalysisEngine';
import { calculateFanRoute } from './routingEngine';
import { getTranslatedAlert } from './translationEngine';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? '';
const MODEL = 'gemini-2.5-flash';
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}`;

export const isConfigured = (): boolean =>
  Boolean(API_KEY && API_KEY !== 'your_gemini_api_key_here');

/**
 * Optional interactive streaming assistant for volunteer and fan queries
 */
export async function callGeminiStream(
  prompt: string,
  systemInstruction: string,
  onChunk: (text: string) => void
): Promise<void> {
  if (!isConfigured()) {
    // Provide simulated assistant response when no API key is supplied
    const fallbackResponse =
      "I'm the StadiumSync Operations Assistant. Turnstiles and concourses are currently being monitored in real time. For gate directions, use the Fan Navigator; for safety alerts, check the Volunteer Copilot feed.";
    for (const char of fallbackResponse.split(' ')) {
      await new Promise((resolve) => setTimeout(resolve, 40));
      onChunk(char + ' ');
    }
    return;
  }

  const body: Record<string, unknown> = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    system_instruction: { parts: [{ text: systemInstruction }] },
    generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
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
        // Ignore JSON chunk parsing errors
      }
    }
  }
}

/**
 * Crowd Analysis: Powered by the deterministic Crowd Analysis Engine
 */
export async function analyzeCrowd(telemetry: StadiumTelemetry): Promise<CrowdAnalysis> {
  // Simulate minimal calculation latency for realistic UI feedback
  await new Promise((resolve) => setTimeout(resolve, 450));
  return calculateCrowdAnalysis(telemetry);
}

/**
 * Alert Generation: Powered by sensor threshold evaluation
 */
export async function generateAlerts(telemetry: StadiumTelemetry): Promise<AIAlert[]> {
  await new Promise((resolve) => setTimeout(resolve, 350));
  return calculateAlerts(telemetry);
}

/**
 * Multilingual Announcements: Curated translation dictionary with cultural notes
 */
export async function translateAlert(
  text: string,
  langCode: string,
  nativeName: string,
  langLabel: string
): Promise<TranslationResult> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getTranslatedAlert(text, langCode as SupportedLanguage, nativeName, langLabel);
}

/**
 * Fan Routing: Powered by the nearest-quadrant pathfinding engine
 */
export async function generateFanRoute(
  telemetry: StadiumTelemetry,
  seatSection: string
): Promise<FanRoute> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return calculateFanRoute(telemetry, seatSection);
}
