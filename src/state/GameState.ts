import { Patient, PriorityLevel } from '../patients/types';

export interface HospitalResources {
  testSlots: number; // Max 5
  maxTestSlots: number;
  observationBeds: number; // Max 3
  maxObservationBeds: number;
  specialistConsults: number; // Max 2
  maxSpecialistConsults: number;
}

export interface GameAlert {
  id: string;
  timestamp: string;
  patientId?: string;
  patientName?: string;
  priority: PriorityLevel;
  title: string;
  message: string;
  isRead: boolean;
}

export interface ShiftScore {
  patientsStabilized: number;
  totalPatients: number;
  criticalCasesStabilized: number;
  totalCriticalCases: number;
  resourcesConservedPercentage: number;
  timeRemainingSeconds: number;
  decisionsCompleted: number;
  strengths: string[];
  areasToImprove: string[];
  overallRating: 'EXEMPLARY' | 'PROFICIENT' | 'DEVELOPING';
}

export type GameScreen = 'START' | 'TUTORIAL' | 'SHIFT' | 'PAUSE' | 'SETTINGS' | 'SUMMARY';

export interface GameState {
  screen: GameScreen;
  shiftDurationSeconds: number; // e.g. 600s = 10 mins
  shiftTimeRemaining: number;
  isPaused: boolean;
  extendedTimeMode: boolean; // 50% slower time
  resources: HospitalResources;
  patients: Patient[];
  activePatientId: string;
  alerts: GameAlert[];
  feedbackLog: Array<{
    id: string;
    timestamp: string;
    text: string;
    patientId?: string;
  }>;
  score?: ShiftScore;
}
