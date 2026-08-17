import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './useAppStore';

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset state before each test
    const { logout } = useAppStore.getState();
    logout();
  });

  it('should initialize with default states', () => {
    const state = useAppStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.userProfile).toBeNull();
    expect(state.activeTheme).toBe('default');
    expect(state.crowdAnalysis).toBeNull();
    expect(state.aiAlerts).toEqual([]);
  });

  it('should authenticate user and set role-specific states', () => {
    const { setAuthenticated } = useAppStore.getState();
    const testProfile = {
      name: 'John Doe',
      role: 'volunteer' as const,
      teamSupporting: 'Brazil',
    };

    setAuthenticated(testProfile);

    const state = useAppStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.userProfile).toEqual(testProfile);
    expect(state.activeRole).toBe('volunteer');
    expect(state.activeTheme).toBe('Brazil');
  });

  it('should clear states on logout', () => {
    const { setAuthenticated, logout } = useAppStore.getState();
    const testProfile = {
      name: 'Jane Doe',
      role: 'organizer' as const,
    };

    setAuthenticated(testProfile);
    expect(useAppStore.getState().isAuthenticated).toBe(true);

    logout();

    const state = useAppStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.userProfile).toBeNull();
    expect(state.activeTheme).toBe('default');
    expect(state.crowdAnalysis).toBeNull();
    expect(state.aiAlerts).toEqual([]);
  });

  it('should update theme correctly', () => {
    const { setActiveTheme } = useAppStore.getState();
    setActiveTheme('Argentina');
    expect(useAppStore.getState().activeTheme).toBe('Argentina');
  });

  it('should refresh telemetry data and update lastRefreshed timestamp', () => {
    const { refreshTelemetry } = useAppStore.getState();
    const initialTime = useAppStore.getState().lastRefreshed;

    // Wait briefly or just call refresh
    refreshTelemetry();

    const state = useAppStore.getState();
    expect(state.lastRefreshed).not.toBe(initialTime);
    expect(state.telemetry).toBeDefined();
    expect(state.telemetry.overallPercentage).toBeGreaterThanOrEqual(0);
  });
});
