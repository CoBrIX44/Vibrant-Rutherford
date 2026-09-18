import { Patient } from '../patients/types';
import { DecisionAction, ActionResult } from './types';

export const DECISION_ACTIONS: Record<string, DecisionAction> = {
  check_vitals: {
    id: 'check_vitals',
    label: 'Check Vital Signs',
    category: 'INVESTIGATE',
    description: 'Re-measure heart rate, blood pressure, oxygen saturation, and respiratory rate.',
    timeCostSeconds: 30,
    resourceCost: {},
    keyboardShortcut: '1',
    isAvailable: () => true,
    execute: (patient: Patient): ActionResult => {
      const { vitals } = patient;
      const vitalsText = `HR: ${vitals.heartRate} BPM, BP: ${vitals.bloodPressureSys}/${vitals.bloodPressureDia} mmHg, SpO2: ${vitals.oxygenSaturation}%, RR: ${vitals.respiratoryRate}/min, Temp: ${vitals.temperature}°F`;
      return {
        success: true,
        message: `Vital signs checked for ${patient.name}. ${vitalsText}`,
        accessibleMessage: `Vital signs checked for ${patient.name}, Bed ${patient.bedId.replace('bed-', '')}. Current readings: ${vitalsText}. Priority status: ${patient.priority}.`,
        hapticPattern: 'ACTION_SUCCESS',
        timeDeductedSeconds: 30,
        vitalsUpdated: true
      };
    }
  },

  review_history: {
    id: 'review_history',
    label: 'Review Medical History',
    category: 'INVESTIGATE',
    description: 'Interview patient/family and inspect previous clinic electronic chart notes.',
    timeCostSeconds: 30,
    resourceCost: {},
    keyboardShortcut: '2',
    isAvailable: (patient) => patient.history.some(h => !h.isRevealed),
    execute: (patient: Patient): ActionResult => {
      const unrevealed = patient.history.filter(h => !h.isRevealed);
      if (unrevealed.length === 0) {
        return {
          success: false,
          message: 'All available medical history has already been reviewed.',
          accessibleMessage: 'All available medical history for this patient has already been reviewed.',
          hapticPattern: 'ACTION_FAILURE',
          timeDeductedSeconds: 10
        };
      }
      unrevealed.forEach(h => h.isRevealed = true);
      const revealedText = unrevealed.map(h => `${h.category}: ${h.details}`).join('; ');
      return {
        success: true,
        message: `Medical history revealed: ${revealedText}`,
        accessibleMessage: `Medical history reviewed for ${patient.name}. ${revealedText}`,
        hapticPattern: 'ACTION_SUCCESS',
        timeDeductedSeconds: 30
      };
    }
  },

  // Case 1: Jordan Lee actions
  physical_exam_lungs: {
    id: 'physical_exam_lungs',
    label: 'Perform Lung Auscultation',
    category: 'INVESTIGATE',
    description: 'Use stethoscope to evaluate breath sounds, wheezing, and air entry across all lung fields.',
    timeCostSeconds: 30,
    resourceCost: {},
    keyboardShortcut: '3',
    isAvailable: (patient) => patient.id === 'patient-1',
    execute: (patient: Patient): ActionResult => {
      return {
        success: true,
        message: 'Auscultation reveals diffuse bilateral expiratory wheezing with prolonged expiratory phase. Trachea midline.',
        accessibleMessage: 'Physical examination complete for Jordan Lee: Diffuse bilateral expiratory wheezes noted. No localized absent breath sounds. Suggestive of severe acute asthma exacerbation rather than tension pneumothorax.',
        hapticPattern: 'ACTION_SUCCESS',
        timeDeductedSeconds: 30
      };
    }
  },

  order_chest_pocus: {
    id: 'order_chest_pocus',
    label: 'Order Chest Ultrasound (POCUS)',
    category: 'INVESTIGATE',
    description: 'Point-of-care lung ultrasound to rapidly assess lung sliding and rule out pneumothorax. Consumes 1 Diagnostic Slot.',
    timeCostSeconds: 60,
    resourceCost: { testSlots: 1 },
    keyboardShortcut: '4',
    isAvailable: (patient, resources) => patient.id === 'patient-1' && !patient.hiddenFlags.imagingDone && resources.testSlots > 0,
    execute: (patient: Patient): ActionResult => {
      patient.hiddenFlags.imagingDone = true;
      return {
        success: true,
        message: 'Lung Ultrasound completed: Normal bilateral lung sliding present. Pneumothorax definitively ruled out.',
        accessibleMessage: 'Diagnostic ultrasound result for Jordan Lee: Bilateral lung sliding confirmed. Pneumothorax ruled out. Consistent with acute bronchospasm.',
        hapticPattern: 'ACTION_SUCCESS',
        timeDeductedSeconds: 60
      };
    }
  },

  administer_bronchodilator: {
    id: 'administer_bronchodilator',
    label: 'Administer Inhaled Bronchodilator & Steroid',
    category: 'TREAT',
    description: 'Deliver nebulized albuterol/ipratropium and systemic corticosteroid to relieve severe bronchospasm.',
    timeCostSeconds: 60,
    resourceCost: {},
    keyboardShortcut: '5',
    isAvailable: (patient) => patient.id === 'patient-1' && !patient.hiddenFlags.bronchodilatorGiven,
    execute: (patient: Patient): ActionResult => {
      patient.hiddenFlags.bronchodilatorGiven = true;
      patient.vitals.respiratoryRate = 20;
      patient.vitals.heartRate = 96;
      patient.vitals.oxygenSaturation = Math.min(100, patient.vitals.oxygenSaturation + 4);
      patient.treatmentLog.push('Inhaled bronchodilator and oral corticosteroid administered');
      
      if (patient.hiddenFlags.oxygenGiven) {
        patient.isStabilized = true;
        patient.priority = 'ROUTINE';
        patient.currentState = 'Wheezing resolved. Breathing comfortably on room air. Case stabilized.';
      } else {
        patient.currentState = 'Bronchodilator active. Airway resistance reduced, mild tachypnea improving.';
      }

      return {
        success: true,
        message: 'Nebulized bronchodilator administered. Airway wheezing decreased markedly; respiratory rate dropped to 20.',
        accessibleMessage: `Bronchodilator given to Jordan Lee. Breathing improved. SpO2 rose to ${patient.vitals.oxygenSaturation}%, Heart rate 96, Respiratory rate 20.`,
        hapticPattern: 'ACTION_SUCCESS',
        timeDeductedSeconds: 60,
        vitalsUpdated: true,
        statusChanged: true
      };
    }
  },

  administer_oxygen: {
    id: 'administer_oxygen',
    label: 'Titrate Supplemental Oxygen',
    category: 'TREAT',
    description: 'Apply nasal cannula or non-rebreather mask to support systemic oxygen delivery.',
    timeCostSeconds: 30,
    resourceCost: {},
    keyboardShortcut: '6',
    isAvailable: (patient) => !patient.hiddenFlags.oxygenGiven,
    execute: (patient: Patient): ActionResult => {
      patient.hiddenFlags.oxygenGiven = true;
      patient.vitals.oxygenSaturation = Math.min(99, patient.vitals.oxygenSaturation + 6);
      patient.treatmentLog.push('Supplemental oxygen titrated');

      if (patient.id === 'patient-1' && patient.hiddenFlags.bronchodilatorGiven) {
        patient.isStabilized = true;
        patient.priority = 'ROUTINE';
        patient.currentState = 'Breathing comfortably. Oxygen saturation optimal at 97%. Case stabilized.';
      } else if (patient.id === 'patient-2' && patient.hiddenFlags.epinephrineGiven && patient.hiddenFlags.ivFluidBolusGiven) {
        patient.isStabilized = true;
        patient.priority = 'PRIORITY';
        patient.currentState = 'Anaphylaxis resolved. Airway patent, hemodynamically stable.';
      }

      return {
        success: true,
        message: `Supplemental oxygen started. Oxygen saturation rose to ${patient.vitals.oxygenSaturation}%.`,
        accessibleMessage: `Supplemental oxygen applied to ${patient.name}. Oxygen saturation increased to ${patient.vitals.oxygenSaturation}%.`,
        hapticPattern: 'ACTION_SUCCESS',
        timeDeductedSeconds: 30,
        vitalsUpdated: true,
        statusChanged: true
      };
    }
  },

  // Case 2: Sam Patel actions
  administer_epinephrine: {
    id: 'administer_epinephrine',
    label: 'Administer Intramuscular Epinephrine',
    category: 'TREAT',
    description: 'Deliver emergency 0.3mg IM epinephrine in anterolateral thigh to reverse anaphylactic shock and airway edema.',
    timeCostSeconds: 30,
    resourceCost: {},
    keyboardShortcut: '3',
    isAvailable: (patient) => patient.id === 'patient-2' && !patient.hiddenFlags.epinephrineGiven,
    execute: (patient: Patient): ActionResult => {
      patient.hiddenFlags.epinephrineGiven = true;
      patient.vitals.bloodPressureSys = 104;
      patient.vitals.bloodPressureDia = 64;
      patient.vitals.respiratoryRate = 22;
      patient.vitals.oxygenSaturation = 95;
      patient.treatmentLog.push('Emergency IM epinephrine (0.3mg) administered in right thigh');
      
      if (patient.hiddenFlags.ivFluidBolusGiven) {
        patient.isStabilized = true;
        patient.priority = 'PRIORITY';
        patient.currentState = 'Airway stridor resolved, blood pressure stabilized at 116/72. Anaphylaxis controlled.';
      } else {
        patient.currentState = 'Stridor improving rapidly. Blood pressure responding but still requires fluid resuscitation.';
      }

      return {
        success: true,
        message: 'EMERGENCY INTERVENTION: Epinephrine delivered. Stridor receding, airway opening, blood pressure improving to 104/64.',
        accessibleMessage: 'Emergency Epinephrine successfully administered to Sam Patel. Airway stridor has subsided. Blood pressure rose to 104/64, Oxygen saturation 95%.',
        hapticPattern: 'ACTION_SUCCESS',
        timeDeductedSeconds: 30,
        vitalsUpdated: true,
        statusChanged: true
      };
    }
  },

  administer_iv_saline: {
    id: 'administer_iv_saline',
    label: 'Infuse IV Normal Saline Fluid Bolus',
    category: 'TREAT',
    description: 'Rapid infusion of 1000mL isotonic saline to restore intravascular volume and treat hypotension.',
    timeCostSeconds: 45,
    resourceCost: {},
    keyboardShortcut: '4',
    isAvailable: (patient) => (patient.id === 'patient-2' && !patient.hiddenFlags.ivFluidBolusGiven) || (patient.id === 'patient-5' && !patient.hiddenFlags.fluidsGiven),
    execute: (patient: Patient): ActionResult => {
      if (patient.id === 'patient-2') {
        patient.hiddenFlags.ivFluidBolusGiven = true;
        patient.vitals.bloodPressureSys = 116;
        patient.vitals.bloodPressureDia = 72;
        patient.vitals.heartRate = 96;
        patient.treatmentLog.push('1000mL IV Normal Saline bolus infused');

        if (patient.hiddenFlags.epinephrineGiven) {
          patient.isStabilized = true;
          patient.priority = 'PRIORITY';
          patient.currentState = 'Patient stabilized from anaphylactic shock. Vital signs within safe limits.';
        }
      } else if (patient.id === 'patient-5') {
        patient.hiddenFlags.fluidsGiven = true;
        patient.vitals.bloodPressureSys = 114;
        patient.vitals.bloodPressureDia = 70;
        patient.vitals.heartRate = 98;
        patient.treatmentLog.push('Intravenous crystalloid rehydration initiated');

        if (patient.hiddenFlags.insulinGiven) {
          patient.isStabilized = true;
          patient.priority = 'ROUTINE';
          patient.currentState = 'Blood glucose normalizing, hydration restored, sensorium clear.';
        }
      }

      return {
        success: true,
        message: `IV Fluid bolus complete for ${patient.name}. Blood pressure normalized to ${patient.vitals.bloodPressureSys}/${patient.vitals.bloodPressureDia} mmHg.`,
        accessibleMessage: `IV Normal Saline bolus infused for ${patient.name}. Blood pressure normalized to ${patient.vitals.bloodPressureSys}/${patient.vitals.bloodPressureDia} mmHg. Heart rate calmed to ${patient.vitals.heartRate} BPM.`,
        hapticPattern: 'ACTION_SUCCESS',
        timeDeductedSeconds: 45,
        vitalsUpdated: true,
        statusChanged: true
      };
    }
  },

  // Case 3: Alex Morgan actions
  order_12_lead_ecg: {
    id: 'order_12_lead_ecg',
    label: 'Order 12-Lead Diagnostic ECG',
    category: 'INVESTIGATE',
    description: 'Perform urgent electrocardiogram to detect myocardial ischemia, injury, or conduction blocks. Consumes 1 Diagnostic Slot.',
    timeCostSeconds: 60,
    resourceCost: { testSlots: 1 },
    keyboardShortcut: '3',
    isAvailable: (patient, resources) => patient.id === 'patient-3' && !patient.hiddenFlags.ecgDone && resources.testSlots > 0,
    execute: (patient: Patient): ActionResult => {
      patient.hiddenFlags.ecgDone = true;
      patient.treatmentLog.push('12-Lead ECG recorded: Marked ST elevation in leads II, III, and aVF with sinus bradycardia');
      return {
        success: true,
        message: 'CRITICAL DIAGNOSTIC: ECG demonstrates acute inferior wall myocardial injury with sinus bradycardia (52 BPM).',
        accessibleMessage: '12-Lead ECG result for Alex Morgan: Critical ST-segment elevations detected in inferior leads II, III, and aVF with bradycardia. Immediate cardiology escalation and antiplatelet protocol indicated.',
        hapticPattern: 'CRITICAL_ALERT',
        timeDeductedSeconds: 60
      };
    }
  },

  administer_cardiac_antiplatelet: {
    id: 'administer_cardiac_antiplatelet',
    label: 'Administer Fictional Emergency Cardiac Protocol',
    category: 'TREAT',
    description: 'Provide chewable aspirin (324mg) and initiate continuous cardiac telemetry.',
    timeCostSeconds: 30,
    resourceCost: {},
    keyboardShortcut: '4',
    isAvailable: (patient) => patient.id === 'patient-3' && !patient.hiddenFlags.antiplateletGiven,
    execute: (patient: Patient): ActionResult => {
      patient.hiddenFlags.antiplateletGiven = true;
      patient.vitals.bloodPressureSys = 106;
      patient.vitals.bloodPressureDia = 68;
      patient.treatmentLog.push('Emergency antiplatelet protocol and telemetry initiated');
      
      if (patient.hiddenFlags.specialistEscalated) {
        patient.isStabilized = true;
        patient.priority = 'PRIORITY';
        patient.currentState = 'Cath lab activated. Patient pre-medicated and hemodynamically prepared for transfer.';
      }

      return {
        success: true,
        message: 'Antiplatelet therapy administered. Continuous cardiac rhythm monitoring engaged.',
        accessibleMessage: 'Cardiac emergency protocol initiated for Alex Morgan. Antiplatelet therapy delivered. Blood pressure improved to 106/68 mmHg.',
        hapticPattern: 'ACTION_SUCCESS',
        timeDeductedSeconds: 30,
        vitalsUpdated: true
      };
    }
  },

  escalate_cardiology_consult: {
    id: 'escalate_cardiology_consult',
    label: 'Request Emergency Cardiology Specialist',
    category: 'ESCALATE',
    description: 'Page the on-call interventional cardiology team for urgent catheterization review. Consumes 1 Specialist Consult.',
    timeCostSeconds: 60,
    resourceCost: { specialistConsults: 1 },
    keyboardShortcut: '5',
    isAvailable: (patient, resources) => patient.id === 'patient-3' && !patient.hiddenFlags.specialistEscalated && resources.specialistConsults > 0,
    execute: (patient: Patient): ActionResult => {
      patient.hiddenFlags.specialistEscalated = true;
      patient.treatmentLog.push('Cardiology team paged; Cardiac Catheterization suite prepared');
      
      if (patient.hiddenFlags.antiplateletGiven || patient.hiddenFlags.ecgDone) {
        patient.isStabilized = true;
        patient.priority = 'PRIORITY';
        patient.currentState = 'Interventional cardiology team arrived. Patient accepted for emergent angioplasty.';
      }

      return {
        success: true,
        message: 'SPECIALIST CONSULT: Cardiology attended immediately. Confirmed acute coronary pathway and booked emergency suite.',
        accessibleMessage: 'Cardiology specialist consulted for Alex Morgan. Catheterization lab activated. Patient prepared for emergency coronary intervention.',
        hapticPattern: 'ACTION_SUCCESS',
        timeDeductedSeconds: 60,
        statusChanged: true
      };
    }
  },

  // Case 4: Elena Rostova actions
  physical_exam_orthostatics: {
    id: 'physical_exam_orthostatics',
    label: 'Check Postural Orthostatic Vitals',
    category: 'INVESTIGATE',
    description: 'Measure blood pressure lying down vs. standing up to quantify intravascular dehydration.',
    timeCostSeconds: 45,
    resourceCost: {},
    keyboardShortcut: '3',
    isAvailable: (patient) => patient.id === 'patient-4',
    execute: (patient: Patient): ActionResult => {
      return {
        success: true,
        message: 'Orthostatic test positive: Lying BP 106/70, Standing BP 88/54 with heart rate rise from 92 to 118 BPM.',
        accessibleMessage: 'Orthostatic vital signs checked for Elena Rostova: Significant postural drop in blood pressure (106/70 down to 88/54) accompanied by tachycardia. Confirms orthostatic volume depletion from heavy exertion without fluid intake.',
        hapticPattern: 'ACTION_SUCCESS',
        timeDeductedSeconds: 45
      };
    }
  },

  administer_oral_iv_hydration: {
    id: 'administer_oral_iv_hydration',
    label: 'Administer Oral & IV Electrolyte Hydration',
    category: 'TREAT',
    description: 'Provide electrolyte hydration solution and chilled fluids to restore systemic volume.',
    timeCostSeconds: 45,
    resourceCost: {},
    keyboardShortcut: '4',
    isAvailable: (patient) => patient.id === 'patient-4' && !patient.hiddenFlags.hydrationGiven,
    execute: (patient: Patient): ActionResult => {
      patient.hiddenFlags.hydrationGiven = true;
      patient.vitals.bloodPressureSys = 114;
      patient.vitals.bloodPressureDia = 74;
      patient.vitals.heartRate = 76;
      patient.treatmentLog.push('Electrolyte rehydration solution administered');

      patient.isStabilized = true;
      patient.priority = 'ROUTINE';
      patient.currentState = 'Hydration restored. Standing dizziness completely resolved. Vitals normalized.';

      return {
        success: true,
        message: 'Rehydration complete: Dizziness resolved, oral mucosa moist, blood pressure normalized to 114/74 mmHg.',
        accessibleMessage: 'Hydration administered to Elena Rostova. Orthostatic symptoms resolved. Heart rate calmed to 76 BPM, BP 114/74. Patient fully stabilized.',
        hapticPattern: 'ACTION_SUCCESS',
        timeDeductedSeconds: 45,
        vitalsUpdated: true,
        statusChanged: true
      };
    }
  },

  order_electrolyte_panel: {
    id: 'order_electrolyte_panel',
    label: 'Order Basic Metabolic Panel',
    category: 'INVESTIGATE',
    description: 'Check serum sodium, potassium, and renal function. Consumes 1 Diagnostic Slot.',
    timeCostSeconds: 60,
    resourceCost: { testSlots: 1 },
    keyboardShortcut: '5',
    isAvailable: (patient, resources) => patient.id === 'patient-4' && !patient.hiddenFlags.electrolytesChecked && resources.testSlots > 0,
    execute: (patient: Patient): ActionResult => {
      patient.hiddenFlags.electrolytesChecked = true;
      patient.treatmentLog.push('Serum electrolyte panel verified');
      return {
        success: true,
        message: 'Lab results received: Mild prerenal azotemia with normal potassium and sodium (138 mEq/L).',
        accessibleMessage: 'Electrolyte panel for Elena Rostova: Serum electrolytes within acceptable ranges with mild dehydration profile. Rehydration confirmed as appropriate treatment.',
        hapticPattern: 'ACTION_SUCCESS',
        timeDeductedSeconds: 60
      };
    }
  },

  transfer_to_observation_bed: {
    id: 'transfer_to_observation_bed',
    label: 'Transfer to Step-Down Observation Bed',
    category: 'DISPOSITION',
    description: 'Transition patient to a comfortable observation bay for re-evaluation before safe discharge. Consumes 1 Observation Bed.',
    timeCostSeconds: 30,
    resourceCost: { observationBeds: 1 },
    keyboardShortcut: '6',
    isAvailable: (patient, resources) => patient.isStabilized && !patient.hiddenFlags.transferredToObs && resources.observationBeds > 0,
    execute: (patient: Patient): ActionResult => {
      patient.hiddenFlags.transferredToObs = true;
      patient.currentState = 'Transferred to Observation Unit. Awaiting post-hydration discharge clearance.';
      patient.treatmentLog.push('Transferred to Observation Unit');
      return {
        success: true,
        message: `${patient.name} safely transferred to Observation Bed. Main ER bay opened.`,
        accessibleMessage: `${patient.name} has been transferred to an Observation Bed. Case management complete.`,
        hapticPattern: 'ACTION_SUCCESS',
        timeDeductedSeconds: 30,
        statusChanged: true
      };
    }
  },

  // Case 5: Marcus Chen actions
  order_blood_glucose_panel: {
    id: 'order_blood_glucose_panel',
    label: 'Order Stat Point-of-Care Blood Glucose & ABG',
    category: 'INVESTIGATE',
    description: 'Rapid fingerstick blood sugar and arterial blood gas measurement. Consumes 1 Diagnostic Slot.',
    timeCostSeconds: 45,
    resourceCost: { testSlots: 1 },
    keyboardShortcut: '3',
    isAvailable: (patient, resources) => patient.id === 'patient-5' && !patient.hiddenFlags.glucoseChecked && resources.testSlots > 0,
    execute: (patient: Patient): ActionResult => {
      patient.hiddenFlags.glucoseChecked = true;
      patient.treatmentLog.push('Stat Blood Glucose: 512 mg/dL; pH 7.22 (Metabolic Acidosis)');
      return {
        success: true,
        message: 'CRITICAL LAB: Point-of-care glucose markedly elevated at 512 mg/dL with metabolic acidosis. Hyperglycemic crisis confirmed.',
        accessibleMessage: 'Stat lab results for Marcus Chen: Severe hyperglycemia detected (512 mg/dL) with metabolic acidosis. Immediate IV hydration and regular insulin titration indicated.',
        hapticPattern: 'CRITICAL_ALERT',
        timeDeductedSeconds: 45
      };
    }
  },

  administer_insulin_protocol: {
    id: 'administer_insulin_protocol',
    label: 'Initiate Low-Dose Regular Insulin Infusion',
    category: 'TREAT',
    description: 'Administer weight-based regular insulin infusion to halt ketone production and lower serum glucose safely.',
    timeCostSeconds: 45,
    resourceCost: {},
    keyboardShortcut: '5',
    isAvailable: (patient) => patient.id === 'patient-5' && !patient.hiddenFlags.insulinGiven,
    execute: (patient: Patient): ActionResult => {
      patient.hiddenFlags.insulinGiven = true;
      patient.vitals.respiratoryRate = 18;
      patient.vitals.heartRate = 84;
      patient.treatmentLog.push('Regular insulin infusion protocol titrated at 0.1 units/kg/hr');

      if (patient.hiddenFlags.fluidsGiven) {
        patient.isStabilized = true;
        patient.priority = 'ROUTINE';
        patient.currentState = 'Hyperglycemic crisis resolving. Sensorium fully clear. Respiration rate normalized to 18.';
      } else {
        patient.currentState = 'Insulin active. Blood glucose descending, awaiting full fluid deficit replacement.';
      }

      return {
        success: true,
        message: 'Insulin infusion started: Acidosis reversing, respiratory rate decreased from 24 to 18 breaths/min.',
        accessibleMessage: 'Insulin therapy initiated for Marcus Chen. Deep rapid breathing has subsided. Respiratory rate calmed to 18, Heart rate 84 BPM. Patient clearing mentally.',
        hapticPattern: 'ACTION_SUCCESS',
        timeDeductedSeconds: 45,
        vitalsUpdated: true,
        statusChanged: true
      };
    }
  },

  monitor_patient: {
    id: 'monitor_patient',
    label: 'Monitor Patient (Advance Time 60s)',
    category: 'MONITOR',
    description: 'Observe the patient closely at the bedside for 60 seconds to detect subtle trends in vital signs and consciousness.',
    timeCostSeconds: 60,
    resourceCost: {},
    keyboardShortcut: '7',
    isAvailable: () => true,
    execute: (patient: Patient): ActionResult => {
      patient.waitingTimeSeconds += 60;
      let trend = 'Patient condition is stable with no sudden deterioration.';
      if (patient.priority === 'CRITICAL' && !patient.isStabilized) {
        trend = 'WARNING: Critical patient exhibits persistent physiological strain. Urgent intervention recommended.';
      } else if (patient.isStabilized) {
        trend = 'Patient remains stable and resting comfortably.';
      }
      return {
        success: true,
        message: `Monitored ${patient.name} for 60 seconds. ${trend}`,
        accessibleMessage: `Monitored ${patient.name}, Bed ${patient.bedId.replace('bed-', '')}. 60 seconds elapsed. ${trend}`,
        hapticPattern: patient.priority === 'CRITICAL' && !patient.isStabilized ? 'URGENT_ALERT' : 'ACTION_SUCCESS',
        timeDeductedSeconds: 60
      };
    }
  }
};
