import { describe, it, expect } from 'vitest';
import { gameStateManager } from '../state/GameStateManager';
import { ScoreTracker } from '../state/ScoreTracker';

describe('ScoreTracker', () => {
  it('computes rating and feedback accurately', () => {
    gameStateManager.restartShift();
    const state = gameStateManager.getState();

    // Stabilize all 5 patients
    // P1
    gameStateManager.selectPatient('patient-1');
    gameStateManager.executeAction('administer_bronchodilator');
    gameStateManager.executeAction('administer_oxygen');

    // P2
    gameStateManager.selectPatient('patient-2');
    gameStateManager.executeAction('administer_epinephrine');
    gameStateManager.executeAction('administer_iv_saline');

    // P3
    gameStateManager.selectPatient('patient-3');
    gameStateManager.executeAction('administer_cardiac_antiplatelet');
    gameStateManager.executeAction('escalate_cardiology_consult');

    // P4
    gameStateManager.selectPatient('patient-4');
    gameStateManager.executeAction('administer_oral_iv_hydration');

    // P5
    gameStateManager.selectPatient('patient-5');
    gameStateManager.executeAction('administer_iv_saline');
    gameStateManager.executeAction('administer_insulin_protocol');

    const score = ScoreTracker.calculate(state);
    expect(score.patientsStabilized).toBe(5);
    expect(score.overallRating).toBe('EXEMPLARY');
    expect(score.strengths.length).toBeGreaterThan(0);
  });
});
