import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { announcer } from '../accessibility/Announcer';
import { hapticService } from '../accessibility/HapticService';
import { audioService } from '../audio/AudioService';
import { SaveManager } from '../utils/SaveManager';
import { DEFAULT_A11Y_SETTINGS } from '../accessibility/types';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { HUD } from '../components/HUD';
import { PatientSelector } from '../components/PatientSelector';
import { PatientDossier } from '../components/PatientDossier';
import { ActionPanel } from '../components/ActionPanel';
import { ShiftSummary } from '../components/ShiftSummary';
import { gameStateManager } from '../state/GameStateManager';

describe('Accessibility & UI Component Suite', () => {
  beforeEach(() => {
    gameStateManager.restartShift();
  });

  it('Announcer populates polite and assertive live regions', async () => {
    announcer.announcePolite('Patient Bed 1 triage complete');
    announcer.announceAssertive('Emergency Alert: Critical Vitals');

    await new Promise(r => setTimeout(r, 100));

    const politeEl = document.getElementById('sr-announcer-polite');
    const assertiveEl = document.getElementById('sr-announcer-assertive');

    expect(politeEl).not.toBeNull();
    expect(assertiveEl).not.toBeNull();
    expect(politeEl?.textContent).toBe('Patient Bed 1 triage complete');
    expect(assertiveEl?.textContent).toBe('Emergency Alert: Critical Vitals');
  });

  it('HapticService handles all defined patterns without throwing', () => {
    expect(() => {
      hapticService.trigger('PATIENT_ARRIVAL');
      hapticService.trigger('URGENT_ALERT');
      hapticService.trigger('CRITICAL_ALERT');
      hapticService.trigger('ACTION_SUCCESS');
      hapticService.trigger('ACTION_FAILURE');
      hapticService.trigger('SHIFT_COMPLETE');
    }).not.toThrow();
  });

  it('AudioService toggles and emits captions synchronously', () => {
    audioService.setEnabled(false);
    expect(audioService.isEnabled()).toBe(false);

    audioService.setCaptionsEnabled(true);
    expect(audioService.isCaptionsEnabled()).toBe(true);

    expect(() => {
      audioService.playHeartbeat(72);
      audioService.playAlertTone();
      audioService.playSuccessTone();
    }).not.toThrow();
  });

  it('SaveManager loads default settings and saves properly', () => {
    const settings = SaveManager.loadSettings();
    expect(settings.contrastTheme).toBe('standard');
    expect(settings.captionsEnabled).toBe(true);

    const updated = { ...settings, fontScale: '150' as const };
    SaveManager.saveSettings(updated);
    expect(SaveManager.loadSettings().fontScale).toBe('150');
  });

  it('DisclaimerBanner renders the mandatory healthcare notice', () => {
    render(<DisclaimerBanner />);
    expect(screen.getByText(/Emergency Room is an educational game using fictional scenarios/i)).toBeInTheDocument();
  });

  it('HUD renders shift timer, resources, and control buttons', () => {
    const state = gameStateManager.getState();
    const handleSettings = vi.fn();
    const handleTutorial = vi.fn();

    render(<HUD state={state} onOpenSettings={handleSettings} onOpenTutorial={handleTutorial} />);
    expect(screen.getByText('ER SHIFT 01')).toBeInTheDocument();
    expect(screen.getByLabelText(/Shift time remaining/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Diagnostic Test Slots/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Observation Beds/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Specialist Consults/i)).toBeInTheDocument();
  });

  it('PatientSelector lists all 5 beds with priority text badges', () => {
    const state = gameStateManager.getState();
    render(<PatientSelector patients={state.patients} activePatientId={state.activePatientId} />);
    
    expect(screen.getByText('Jordan Lee')).toBeInTheDocument();
    expect(screen.getByText('Sam Patel')).toBeInTheDocument();
    expect(screen.getByText('Alex Morgan')).toBeInTheDocument();
    expect(screen.getByText('Elena Rostova')).toBeInTheDocument();
    expect(screen.getByText('Marcus Chen')).toBeInTheDocument();
  });

  it('PatientDossier renders accessible tabular vitals and complaint', () => {
    const p1 = gameStateManager.getActivePatient();
    render(<PatientDossier patient={p1} />);

    expect(screen.getByText(/Jordan Lee/i)).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /Vital Signs Table/i })).toBeInTheDocument();
    expect(screen.getByText(/108/i)).toBeInTheDocument(); // HR
    expect(screen.getByText(/118\/74/i)).toBeInTheDocument(); // BP
    expect(screen.getByText(/91%/i)).toBeInTheDocument(); // SpO2
  });

  it('ActionPanel renders accessible action options with keyboard labels', () => {
    const state = gameStateManager.getState();
    const p1 = gameStateManager.getActivePatient();
    render(<ActionPanel patient={p1} resources={state.resources} />);

    expect(screen.getByText(/Check Vital Signs/i)).toBeInTheDocument();
    expect(screen.getByText(/Review Medical History/i)).toBeInTheDocument();
  });

  it('ShiftSummary renders transparent score metrics and debrief', () => {
    const mockScore = {
      patientsStabilized: 5,
      totalPatients: 5,
      criticalCasesStabilized: 2,
      totalCriticalCases: 2,
      resourcesConservedPercentage: 60,
      timeRemainingSeconds: 240,
      decisionsCompleted: 12,
      strengths: ['Rapid stabilization of critical cases.'],
      areasToImprove: [],
      overallRating: 'EXEMPLARY' as const
    };

    render(<ShiftSummary score={mockScore} />);
    expect(screen.getByText('SHIFT COMPLETED')).toBeInTheDocument();
    expect(screen.getByText('5 / 5')).toBeInTheDocument();
    expect(screen.getByText('2 / 2')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText(/Rapid stabilization of critical cases/i)).toBeInTheDocument();
  });
});
