import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AlertFeed } from './AlertFeed';
import { useAppStore } from '../../store/useAppStore';
import React from 'react';

describe('AlertFeed', () => {
  beforeEach(() => {
    useAppStore.getState().logout();
  });

  it('renders initial empty feed and generate button', () => {
    render(<AlertFeed />);
    expect(screen.getByText('ACTIVE ALERTS')).toBeInTheDocument();
    expect(screen.getByText('No Active Alerts')).toBeInTheDocument();

    const generateBtn = screen.getByRole('button', { name: /GENERATE AI ALERTS/i });
    expect(generateBtn).toBeInTheDocument();
  });

  it('generates alerts and handles selection', async () => {
    render(<AlertFeed />);

    const generateBtn = screen.getByRole('button', { name: /GENERATE AI ALERTS/i });
    fireEvent.click(generateBtn);

    // Wait for mock alerts to generate
    await screen.findByText('Gate Congestion Advisory');
    expect(screen.getByText('Concourse Facility Load')).toBeInTheDocument();
    expect(screen.getByText('Weather Advisory Alert')).toBeInTheDocument();

    // Select the first alert
    const firstAlertBtn = screen.getByText('Gate Congestion Advisory');
    fireEvent.click(firstAlertBtn);

    // Verify selected alert ID in store
    const storeState = useAppStore.getState();
    expect(storeState.selectedAlertId).toContain('alert-mock-');
  });
});
