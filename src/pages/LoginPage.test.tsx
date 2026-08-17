import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginPage } from './LoginPage';
import { MemoryRouter } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import React from 'react';

describe('LoginPage flow', () => {
  beforeEach(() => {
    useAppStore.getState().logout();
  });

  it('renders Step 1 (Role Selection) correctly', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Select Access Viewport')).toBeInTheDocument();
    expect(screen.getByText('ORGANIZER')).toBeInTheDocument();
    expect(screen.getByText('VOLUNTEER')).toBeInTheDocument();
    expect(screen.getByText('FAN EXPERIENCE')).toBeInTheDocument();

    const continueBtn = screen.getByRole('button', { name: /CONTINUE/i });
    expect(continueBtn).toBeDisabled();
  });

  it('completes the entire login flow as a Fan', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    // Step 1: Select Fan Experience
    const fanCard = screen.getByText('FAN EXPERIENCE');
    fireEvent.click(fanCard);

    const continueBtn1 = screen.getByRole('button', { name: /CONTINUE/i });
    expect(continueBtn1).toBeEnabled();
    fireEvent.click(continueBtn1);

    // Step 2: Configure Profile (use waitFor for animations)
    await waitFor(() => {
      expect(screen.getByText('Operational Profile Setup')).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/YOUR NAME/i);
    fireEvent.change(nameInput, { target: { value: 'Messi Fan' } });

    const seatInput = screen.getByLabelText(/SEAT SECTION/i);
    fireEvent.change(seatInput, { target: { value: 'Sec 101' } });

    const teamInput = screen.getByLabelText(/TEAM SUPPORTING/i);
    fireEvent.change(teamInput, { target: { value: 'Argentina' } });

    const confirmBtn = screen.getByRole('button', { name: /CONFIRM/i });
    expect(confirmBtn).toBeEnabled();
    fireEvent.click(confirmBtn);

    // Step 3: Confirmation
    await waitFor(() => {
      expect(screen.getByText('PROFILE COMPILED')).toBeInTheDocument();
    });
    expect(screen.getByText('NAME')).toBeInTheDocument();
    expect(screen.getByText('Messi Fan')).toBeInTheDocument();

    const enterBtn = screen.getByRole('button', { name: /ENTER PORTAL/i });
    fireEvent.click(enterBtn);

    // Verifies that the store state was successfully set to authenticated!
    const storeState = useAppStore.getState();
    expect(storeState.isAuthenticated).toBe(true);
    expect(storeState.userProfile?.name).toBe('Messi Fan');
    expect(storeState.userProfile?.role).toBe('fan');
  });
});
