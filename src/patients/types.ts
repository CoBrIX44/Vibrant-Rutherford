export type PriorityLevel = 'ROUTINE' | 'PRIORITY' | 'URGENT' | 'CRITICAL';

export interface VitalSigns {
  heartRate: number; // BPM
  bloodPressureSys: number; // mmHg
  bloodPressureDia: number; // mmHg
  oxygenSaturation: number; // % SpO2
  respiratoryRate: number; // breaths/min
  temperature: number; // °F
}

export interface PatientHistoryItem {
  category: string;
  details: string;
  isRevealed: boolean;
}

export interface Patient {
  id: string;
  bedId: string;
  name: string;
  age: number;
  chiefComplaint: string;
  symptoms: string[];
  vitals: VitalSigns;
  baselineVitals: VitalSigns;
  priority: PriorityLevel;
  currentState: string;
  accessibleDescription: string;
  history: PatientHistoryItem[];
  availableActionIds: string[];
  hiddenFlags: Record<string, boolean>;
  isStabilized: boolean;
  waitingTimeSeconds: number;
  treatmentLog: string[];
  outcomeSummary?: string;
}
