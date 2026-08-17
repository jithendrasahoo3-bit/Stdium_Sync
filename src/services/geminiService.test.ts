import { describe, it, expect } from 'vitest';
import { analyzeCrowd, generateAlerts, translateAlert, generateFanRoute } from './geminiService';
import { INITIAL_TELEMETRY } from '../data/mockData';

describe('geminiService fallback behavior', () => {
  it('should generate crowd analysis successfully when API key is missing', async () => {
    const analysis = await analyzeCrowd(INITIAL_TELEMETRY);
    expect(analysis).toBeDefined();
    expect(analysis.summary).toContain('operations');
    expect(Array.isArray(analysis.bottlenecks)).toBe(true);
    expect(analysis.strategy.length).toBeGreaterThan(0);
    expect(analysis.riskAssessment).toBeDefined();
  });

  it('should generate alerts successfully when API key is missing', async () => {
    const alerts = await generateAlerts(INITIAL_TELEMETRY);
    expect(Array.isArray(alerts)).toBe(true);
    expect(alerts.length).toBeGreaterThan(0);
    expect(alerts[0].id).toBeDefined();
    expect(alerts[0].title).toBeDefined();
  });

  it('should translate alert with cultural note when API key is missing', async () => {
    const text = 'Gate A is closed due to crowd control.';
    const translation = await translateAlert(text, 'pt', 'Portugal', 'Portuguese');
    expect(translation.originalText).toBe(text);
    expect(translation.language).toBe('pt');
    expect(translation.translatedText).toContain(text);
    expect(translation.culturalNote).toBeDefined();
  });

  it('should generate a fan navigation route when API key is missing', async () => {
    const route = await generateFanRoute(INITIAL_TELEMETRY, 'Section 102');
    expect(route.seatSection).toBe('Section 102');
    expect(route.recommendedGate).toBeDefined();
    expect(Array.isArray(route.instructions)).toBe(true);
    expect(route.instructions.length).toBeGreaterThan(0);
  });
});
