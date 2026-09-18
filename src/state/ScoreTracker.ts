import { GameState, ShiftScore } from './GameState';

export class ScoreTracker {
  public static calculate(state: GameState): ShiftScore {
    const totalPatients = state.patients.length;
    const stabilized = state.patients.filter(p => p.isStabilized);
    const patientsStabilized = stabilized.length;

    const criticalPatients = state.patients.filter(p => p.baselineVitals.heartRate > 120 || p.baselineVitals.heartRate < 55 || p.baselineVitals.bloodPressureSys < 90);
    const totalCriticalCases = criticalPatients.length;
    const criticalCasesStabilized = criticalPatients.filter(p => p.isStabilized).length;

    const initialTotalResources = state.resources.maxTestSlots + state.resources.maxObservationBeds + state.resources.maxSpecialistConsults;
    const currentTotalResources = state.resources.testSlots + state.resources.observationBeds + state.resources.specialistConsults;
    const resourcesConservedPercentage = Math.round((currentTotalResources / initialTotalResources) * 100);

    const decisionsCompleted = state.feedbackLog.length;
    const timeRemainingSeconds = Math.max(0, state.shiftTimeRemaining);

    const strengths: string[] = [];
    const areasToImprove: string[] = [];

    if (criticalCasesStabilized === totalCriticalCases) {
      strengths.push('Rapid recognition and stabilization of high-acuity critical emergencies.');
    } else {
      areasToImprove.push('Prioritize immediate life-saving interventions (such as Epinephrine or ECG triage) before ordering general tests.');
    }

    if (resourcesConservedPercentage >= 40) {
      strengths.push('Prudent resource stewardship: Preserved diagnostic test slots and observation beds for acute needs.');
    } else {
      areasToImprove.push('Optimize resource utilization: Avoid ordering high-resource diagnostic tests when focused clinical exam suffices.');
    }

    if (patientsStabilized >= 4) {
      strengths.push('Excellent holistic shift throughput: Stabilized majority of emergency department arrivals.');
    } else {
      areasToImprove.push('Manage shift pacing to ensure routine and urgent patients receive timely assessment alongside critical cases.');
    }

    let overallRating: 'EXEMPLARY' | 'PROFICIENT' | 'DEVELOPING' = 'DEVELOPING';
    if (patientsStabilized === 5 && criticalCasesStabilized === totalCriticalCases) {
      overallRating = 'EXEMPLARY';
    } else if (patientsStabilized >= 3) {
      overallRating = 'PROFICIENT';
    }

    return {
      patientsStabilized,
      totalPatients,
      criticalCasesStabilized,
      totalCriticalCases,
      resourcesConservedPercentage,
      timeRemainingSeconds,
      decisionsCompleted,
      strengths,
      areasToImprove,
      overallRating
    };
  }
}
