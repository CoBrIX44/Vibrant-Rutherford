import { Patient } from '../patients/types';

export interface ResourceCost {
  testSlots?: number;
  observationBeds?: number;
  specialistConsults?: number;
}

export interface ActionResult {
  success: boolean;
  message: string;
  accessibleMessage: string;
  hapticPattern?: 'ACTION_SUCCESS' | 'ACTION_FAILURE' | 'CRITICAL_ALERT' | 'URGENT_ALERT';
  timeDeductedSeconds: number;
  vitalsUpdated?: boolean;
  statusChanged?: boolean;
  newPriority?: 'ROUTINE' | 'PRIORITY' | 'URGENT' | 'CRITICAL';
  newActionsUnlocked?: string[];
}

export interface DecisionAction {
  id: string;
  label: string;
  category: 'INVESTIGATE' | 'TREAT' | 'MONITOR' | 'ESCALATE' | 'DISPOSITION';
  description: string;
  timeCostSeconds: number;
  resourceCost: ResourceCost;
  keyboardShortcut: string; // '1' - '9'
  isAvailable: (patient: Patient, resources: { testSlots: number; observationBeds: number; specialistConsults: number }) => boolean;
  execute: (patient: Patient) => ActionResult;
}
