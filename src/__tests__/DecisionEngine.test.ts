import { describe, it, expect, beforeEach } from 'vitest';
import { gameStateManager } from '../state/GameStateManager';
import { DECISION_ACTIONS } from '../decisions/DecisionEngine';

describe('DecisionEngine & Patient Clinical Pathways', () => {
  beforeEach(() => {
    gameStateManager.restartShift();
  });

  it('Case 1 (Jordan Lee): checks vitals, reveals history, administers bronchodilator and oxygen to stabilize', () => {
    gameStateManager.selectPatient('patient-1');
    const p1 = gameStateManager.getActivePatient();
    expect(p1.isStabilized).toBe(false);

    // Check Vitals
    const res1 = gameStateManager.executeAction('check_vitals');
    expect(res1.success).toBe(true);
    expect(res1.accessibleMessage).toContain('Jordan Lee');

    // Review History
    const res2 = gameStateManager.executeAction('review_history');
    expect(res2.success).toBe(true);
    expect(p1.history[0].isRevealed).toBe(true);

    // Administer Bronchodilator
    const res3 = gameStateManager.executeAction('administer_bronchodilator');
    expect(res3.success).toBe(true);
    expect(p1.hiddenFlags.bronchodilatorGiven).toBe(true);

    // Titrate Oxygen
    const res4 = gameStateManager.executeAction('administer_oxygen');
    expect(res4.success).toBe(true);
    expect(p1.hiddenFlags.oxygenGiven).toBe(true);

    // P1 should now be stabilized
    expect(p1.isStabilized).toBe(true);
    expect(p1.priority).toBe('ROUTINE');
  });

  it('Case 2 (Sam Patel): stabilizes acute anaphylaxis with Epinephrine and IV Saline', () => {
    gameStateManager.selectPatient('patient-2');
    const p2 = gameStateManager.getActivePatient();
    expect(p2.priority).toBe('CRITICAL');

    // Emergency Epinephrine
    const res1 = gameStateManager.executeAction('administer_epinephrine');
    expect(res1.success).toBe(true);
    expect(p2.vitals.bloodPressureSys).toBeGreaterThan(100);

    // IV Fluid bolus
    const res2 = gameStateManager.executeAction('administer_iv_saline');
    expect(res2.success).toBe(true);

    expect(p2.isStabilized).toBe(true);
    expect(p2.priority).toBe('PRIORITY');
  });

  it('Case 3 (Alex Morgan): executes ECG and escalates to Cardiology specialist', () => {
    gameStateManager.selectPatient('patient-3');
    const p3 = gameStateManager.getActivePatient();
    const initialTestSlots = gameStateManager.getState().resources.testSlots;
    const initialSpecialists = gameStateManager.getState().resources.specialistConsults;

    // Order 12-Lead ECG (consumes 1 test slot)
    const res1 = gameStateManager.executeAction('order_12_lead_ecg');
    expect(res1.success).toBe(true);
    expect(gameStateManager.getState().resources.testSlots).toBe(initialTestSlots - 1);

    // Administer cardiac antiplatelet
    const res2 = gameStateManager.executeAction('administer_cardiac_antiplatelet');
    expect(res2.success).toBe(true);

    // Escalate to cardiology (consumes 1 specialist consult)
    const res3 = gameStateManager.executeAction('escalate_cardiology_consult');
    expect(res3.success).toBe(true);
    expect(gameStateManager.getState().resources.specialistConsults).toBe(initialSpecialists - 1);

    expect(p3.isStabilized).toBe(true);
  });

  it('Case 4 (Elena Rostova): stabilizes dehydration and transfers to observation bed', () => {
    gameStateManager.selectPatient('patient-4');
    const p4 = gameStateManager.getActivePatient();
    const initialObsBeds = gameStateManager.getState().resources.observationBeds;

    // Rehydrate
    const res1 = gameStateManager.executeAction('administer_oral_iv_hydration');
    expect(res1.success).toBe(true);
    expect(p4.isStabilized).toBe(true);

    // Transfer to Obs bed (consumes 1 observation bed)
    const res2 = gameStateManager.executeAction('transfer_to_observation_bed');
    expect(res2.success).toBe(true);
    expect(gameStateManager.getState().resources.observationBeds).toBe(initialObsBeds - 1);
  });

  it('Case 5 (Marcus Chen): orders glucose panel, fluids, and insulin to stabilize crisis', () => {
    gameStateManager.selectPatient('patient-5');
    const p5 = gameStateManager.getActivePatient();

    // Order stat glucose panel
    const res1 = gameStateManager.executeAction('order_blood_glucose_panel');
    expect(res1.success).toBe(true);

    // Fluids
    const res2 = gameStateManager.executeAction('administer_iv_saline');
    expect(res2.success).toBe(true);

    // Insulin protocol
    const res3 = gameStateManager.executeAction('administer_insulin_protocol');
    expect(res3.success).toBe(true);

    expect(p5.isStabilized).toBe(true);
  });

  it('prevents actions when resources are depleted', () => {
    const state = gameStateManager.getState();
    state.resources.testSlots = 0; // Deplete slots

    gameStateManager.selectPatient('patient-1');
    const res = gameStateManager.executeAction('order_chest_pocus');
    expect(res.success).toBe(false);
    expect(res.message).toContain('unavailable');
  });
});
