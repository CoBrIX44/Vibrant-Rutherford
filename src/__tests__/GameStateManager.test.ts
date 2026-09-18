import { describe, it, expect, beforeEach } from 'vitest';
import { gameStateManager } from '../state/GameStateManager';

describe('GameStateManager', () => {
  beforeEach(() => {
    gameStateManager.restartShift();
  });

  it('initializes with 5 patients and correct starting resources', () => {
    const state = gameStateManager.getState();
    expect(state.patients.length).toBe(5);
    expect(state.resources.testSlots).toBe(5);
    expect(state.resources.observationBeds).toBe(3);
    expect(state.resources.specialistConsults).toBe(2);
    expect(state.shiftTimeRemaining).toBe(600);
    expect(state.screen).toBe('SHIFT');
  });

  it('switches active patient via next and prev methods', () => {
    expect(gameStateManager.getActivePatient().id).toBe('patient-1');
    gameStateManager.selectNextPatient();
    expect(gameStateManager.getActivePatient().id).toBe('patient-2');
    gameStateManager.selectNextPatient();
    expect(gameStateManager.getActivePatient().id).toBe('patient-3');
    gameStateManager.selectPrevPatient();
    expect(gameStateManager.getActivePatient().id).toBe('patient-2');
  });

  it('toggles pause state properly', () => {
    const state = gameStateManager.getState();
    expect(state.isPaused).toBe(false);
    gameStateManager.togglePause();
    expect(gameStateManager.getState().isPaused).toBe(true);
    gameStateManager.togglePause();
    expect(gameStateManager.getState().isPaused).toBe(false);
  });

  it('toggles extended time mode', () => {
    expect(gameStateManager.getState().extendedTimeMode).toBe(false);
    gameStateManager.setExtendedTimeMode(true);
    expect(gameStateManager.getState().extendedTimeMode).toBe(true);
  });
});
