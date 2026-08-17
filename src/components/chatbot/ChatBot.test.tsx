import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatBot } from './ChatBot';
import { useAppStore } from '../../store/useAppStore';
import React from 'react';

describe('ChatBot panel', () => {
  beforeEach(() => {
    const store = useAppStore.getState();
    store.logout();
    store.setAuthenticated({
      name: 'Test Fan',
      role: 'fan',
      teamSupporting: 'Brazil',
    });
  });

  it('is closed by default and opens on button click', async () => {
    render(<ChatBot />);
    
    // The panel itself shouldn't be rendered initially
    expect(screen.queryByText('StadiumSync AI')).toBeNull();

    // Click the toggle button
    const toggleBtn = screen.getByTestId('chatbot-toggle');
    expect(toggleBtn).toBeInTheDocument();
    fireEvent.click(toggleBtn);

    // Now it should be visible
    expect(await screen.findByText('StadiumSync AI')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ask your AI assistant...')).toBeInTheDocument();
  });

  it('allows sending user messages and renders local fallbacks', async () => {
    render(<ChatBot />);
    
    // Open chatbot
    const toggleBtn = screen.getByTestId('chatbot-toggle');
    fireEvent.click(toggleBtn);

    // Type a message about gates
    const input = await screen.findByPlaceholderText('Ask your AI assistant...');
    fireEvent.change(input, { target: { value: 'How is Gate A?' } });

    // Click send
    const sendBtn = screen.getByRole('button', { name: /Send message/i });
    fireEvent.click(sendBtn);

    // Verify message is added
    expect(screen.getByText('How is Gate A?')).toBeInTheDocument();

    // Verify fallback response is generated (simulate stream delay completion)
    await waitFor(() => {
      expect(screen.getByText(/here is the live entrance telemetry/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
