import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TranslationAssistant } from './TranslationAssistant';
import { useAppStore } from '../../store/useAppStore';
import React from 'react';

// Mock geminiService translation function
vi.mock('../../services/geminiService', () => ({
  translateAlert: vi.fn().mockResolvedValue({
    language: 'spanish',
    languageLabel: 'Español',
    originalText: 'High Congestion Gate A: Direct incoming fans to Gate B.',
    translatedText: 'Test Translated Text in Spanish',
    culturalNote: 'Calm instructions appreciated.',
    generatedAt: new Date().toISOString()
  })
}));

describe('TranslationAssistant', () => {
  beforeEach(() => {
    const store = useAppStore.getState();
    store.logout();
    
    // Seed store with an alert and set it as selected
    store.setAiAlerts([
      {
        id: 'alert-1',
        severity: 'critical',
        title: 'High Congestion Gate A',
        description: 'Gate A queue exceeds 20 minutes.',
        affectedArea: 'Gate A',
        recommendedAction: 'Direct incoming fans to Gate B.',
        timestamp: new Date().toISOString(),
      }
    ]);
    store.setSelectedAlertId('alert-1');
  });

  it('renders initial setup correctly', () => {
    render(<TranslationAssistant />);
    expect(screen.getByText('AI TRANSLATION ASSISTANT')).toBeInTheDocument();
    expect(screen.getByText("SELECT FAN'S LANGUAGE")).toBeInTheDocument();
  });

  it('allows selecting a language and translates successfully', async () => {
    render(<TranslationAssistant />);

    // Click Spanish language button (labelled "Español")
    const spanishBtn = screen.getByText('Español');
    fireEvent.click(spanishBtn);

    // Verify the "TRANSLATE NOW" button is shown (using findByText to wait for animation)
    const translateBtn = await screen.findByText('TRANSLATE NOW');
    expect(translateBtn).toBeInTheDocument();

    // Trigger translation
    fireEvent.click(translateBtn);

    // Verify it transitions to result block
    await waitFor(() => {
      expect(screen.getByText(/TRANSLATED TO ESPAÑOL/i)).toBeInTheDocument();
      expect(screen.getByText(/Test Translated Text in Spanish/i)).toBeInTheDocument();
      expect(screen.getByText('COPY')).toBeInTheDocument();
    });
  });
});
