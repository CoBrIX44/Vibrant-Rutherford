import { Patient } from '../types';

export function createInitialPatients(): Patient[] {
  return [
    {
      id: 'patient-1',
      bedId: 'bed-1',
      name: 'Jordan Lee',
      age: 47,
      chiefComplaint: 'Sudden difficulty breathing and chest tightness',
      symptoms: [
        'Shortness of breath with minimal exertion',
        'Audible expiratory wheezing',
        'Dry non-productive cough',
        'Moderate anxiety'
      ],
      vitals: {
        heartRate: 108,
        bloodPressureSys: 118,
        bloodPressureDia: 74,
        oxygenSaturation: 91,
        respiratoryRate: 26,
        temperature: 98.6
      },
      baselineVitals: {
        heartRate: 108,
        bloodPressureSys: 118,
        bloodPressureDia: 74,
        oxygenSaturation: 91,
        respiratoryRate: 26,
        temperature: 98.6
      },
      priority: 'URGENT',
      currentState: 'Acutely dyspneic, sitting upright, wheezing heard on auscultation.',
      accessibleDescription: 'Patient Jordan Lee, Age 47, Bed 1. Priority: URGENT. Chief complaint: Sudden difficulty breathing. Vitals: HR 108, BP 118/74, Oxygen Saturation 91%, Respiratory Rate 26.',
      history: [
        {
          category: 'Medical History',
          details: 'Moderate persistent asthma diagnosed 10 years ago; uses albuterol rescue inhaler occasionally.',
          isRevealed: false
        },
        {
          category: 'Allergies & Meds',
          details: 'Allergic to penicillin. No daily maintenance inhaler used recently.',
          isRevealed: false
        }
      ],
      availableActionIds: [
        'check_vitals',
        'review_history',
        'physical_exam_lungs',
        'order_chest_pocus',
        'administer_bronchodilator',
        'administer_oxygen',
        'monitor_patient'
      ],
      hiddenFlags: {
        bronchodilatorGiven: false,
        oxygenGiven: false,
        imagingDone: false,
        steroidGiven: false
      },
      isStabilized: false,
      waitingTimeSeconds: 0,
      treatmentLog: []
    },
    {
      id: 'patient-2',
      bedId: 'bed-2',
      name: 'Sam Patel',
      age: 32,
      chiefComplaint: 'Rapid facial swelling, diffuse hives, and sensation of throat closing',
      symptoms: [
        'Lip and periorbital angioedema',
        'Diffuse erythematous urticaria on trunk and arms',
        'Inspiratory stridor and hoarse voice',
        'Severe lightheadedness upon standing'
      ],
      vitals: {
        heartRate: 124,
        bloodPressureSys: 84,
        bloodPressureDia: 52,
        oxygenSaturation: 90,
        respiratoryRate: 28,
        temperature: 98.4
      },
      baselineVitals: {
        heartRate: 124,
        bloodPressureSys: 84,
        bloodPressureDia: 52,
        oxygenSaturation: 90,
        respiratoryRate: 28,
        temperature: 98.4
      },
      priority: 'CRITICAL',
      currentState: 'In acute anaphylactic shock. Stridor audible without stethoscope. Hypotensive.',
      accessibleDescription: 'Patient Sam Patel, Age 32, Bed 2. Priority: CRITICAL (Immediate attention required). Chief complaint: Severe allergic reaction with airway compromise and hypotension. Vitals: HR 124, BP 84/52, Oxygen Saturation 90%, Respiratory Rate 28.',
      history: [
        {
          category: 'Medical History',
          details: 'Severe tree nut allergy; experienced mild reaction as a teenager.',
          isRevealed: false
        },
        {
          category: 'Recent Exposure',
          details: 'Ate bakery pastry 25 minutes ago that may have contained almond paste.',
          isRevealed: false
        }
      ],
      availableActionIds: [
        'check_vitals',
        'review_history',
        'administer_epinephrine',
        'administer_iv_saline',
        'administer_oxygen',
        'monitor_patient'
      ],
      hiddenFlags: {
        epinephrineGiven: false,
        ivFluidBolusGiven: false,
        oxygenGiven: false
      },
      isStabilized: false,
      waitingTimeSeconds: 0,
      treatmentLog: []
    },
    {
      id: 'patient-3',
      bedId: 'bed-3',
      name: 'Alex Morgan',
      age: 58,
      chiefComplaint: 'Heavy substernal chest pressure radiating down left arm with cold sweat',
      symptoms: [
        'Severe retrosternal pressure described as an elephant on chest',
        'Diaphoresis (profuse cold perspiration)',
        'Mild nausea and impending doom sensation',
        'Marked lethargy'
      ],
      vitals: {
        heartRate: 52,
        bloodPressureSys: 94,
        bloodPressureDia: 60,
        oxygenSaturation: 93,
        respiratoryRate: 22,
        temperature: 98.2
      },
      baselineVitals: {
        heartRate: 52,
        bloodPressureSys: 94,
        bloodPressureDia: 60,
        oxygenSaturation: 93,
        respiratoryRate: 22,
        temperature: 98.2
      },
      priority: 'CRITICAL',
      currentState: 'Sinus bradycardia with ischemic chest pressure and pale, cool extremities.',
      accessibleDescription: 'Patient Alex Morgan, Age 58, Bed 3. Priority: CRITICAL. Chief complaint: Severe substernal chest pressure with bradycardia and diaphoresis. Vitals: HR 52, BP 94/60, Oxygen Saturation 93%, Respiratory Rate 22.',
      history: [
        {
          category: 'Cardiovascular History',
          details: '15-year history of hypertension, 30 pack-year smoking history, elevated cholesterol.',
          isRevealed: false
        },
        {
          category: 'Family History',
          details: 'Father had myocardial infarction at age 52.',
          isRevealed: false
        }
      ],
      availableActionIds: [
        'check_vitals',
        'review_history',
        'order_12_lead_ecg',
        'administer_cardiac_antiplatelet',
        'administer_oxygen',
        'escalate_cardiology_consult',
        'monitor_patient'
      ],
      hiddenFlags: {
        ecgDone: false,
        antiplateletGiven: false,
        specialistEscalated: false
      },
      isStabilized: false,
      waitingTimeSeconds: 0,
      treatmentLog: []
    },
    {
      id: 'patient-4',
      bedId: 'bed-4',
      name: 'Elena Rostova',
      age: 24,
      chiefComplaint: 'Lightheadedness and temporary loss of consciousness after road race',
      symptoms: [
        'Postural dizziness when sitting or standing up',
        'Dry oral mucosa and extreme thirst',
        'Mild generalized muscle cramping',
        'Alert and fully oriented'
      ],
      vitals: {
        heartRate: 98,
        bloodPressureSys: 102,
        bloodPressureDia: 66,
        oxygenSaturation: 99,
        respiratoryRate: 16,
        temperature: 99.2
      },
      baselineVitals: {
        heartRate: 98,
        bloodPressureSys: 102,
        bloodPressureDia: 66,
        oxygenSaturation: 99,
        respiratoryRate: 16,
        temperature: 99.2
      },
      priority: 'ROUTINE',
      currentState: 'Mild heat exhaustion and orthostatic dehydration. Neurologically intact.',
      accessibleDescription: 'Patient Elena Rostova, Age 24, Bed 4. Priority: ROUTINE. Chief complaint: Post-exertional syncope and dehydration. Vitals: HR 98, BP 102/66, Oxygen Saturation 99%, Respiratory Rate 16.',
      history: [
        {
          category: 'Activity Details',
          details: 'Ran outdoor 10K race in 88°F weather; drank only 200ml of water beforehand.',
          isRevealed: false
        },
        {
          category: 'Medical History',
          details: 'Healthy athlete with no history of seizures, cardiac syncope, or medications.',
          isRevealed: false
        }
      ],
      availableActionIds: [
        'check_vitals',
        'review_history',
        'physical_exam_orthostatics',
        'administer_oral_iv_hydration',
        'order_electrolyte_panel',
        'transfer_to_observation_bed',
        'monitor_patient'
      ],
      hiddenFlags: {
        hydrationGiven: false,
        electrolytesChecked: false,
        transferredToObs: false
      },
      isStabilized: false,
      waitingTimeSeconds: 0,
      treatmentLog: []
    },
    {
      id: 'patient-5',
      bedId: 'bed-5',
      name: 'Marcus Chen',
      age: 65,
      chiefComplaint: 'Increasing confusion, profound weakness, and dry mouth over 3 days',
      symptoms: [
        'Lethargy and somnolence, answers questions slowly',
        'Deep and rapid respiration pattern',
        'Extreme dry mucous membranes and sunken eyes',
        'Frequent urination reported by spouse'
      ],
      vitals: {
        heartRate: 112,
        bloodPressureSys: 96,
        bloodPressureDia: 62,
        oxygenSaturation: 95,
        respiratoryRate: 24,
        temperature: 98.8
      },
      baselineVitals: {
        heartRate: 112,
        bloodPressureSys: 96,
        bloodPressureDia: 62,
        oxygenSaturation: 95,
        respiratoryRate: 24,
        temperature: 98.8
      },
      priority: 'URGENT',
      currentState: 'Dehydrated with suspected hyperglycemic crisis and tachypnea.',
      accessibleDescription: 'Patient Marcus Chen, Age 65, Bed 5. Priority: URGENT. Chief complaint: Altered mental status and profound dehydration. Vitals: HR 112, BP 96/62, Oxygen Saturation 95%, Respiratory Rate 24.',
      history: [
        {
          category: 'Medical History',
          details: 'Type 2 Diabetes Mellitus; missed doses of medication for 4 days due to stomach upset.',
          isRevealed: false
        },
        {
          category: 'Medications',
          details: 'Prescribed oral hypoglycemics and ACE inhibitor; took neither this week.',
          isRevealed: false
        }
      ],
      availableActionIds: [
        'check_vitals',
        'review_history',
        'order_blood_glucose_panel',
        'administer_iv_saline',
        'administer_insulin_protocol',
        'monitor_patient'
      ],
      hiddenFlags: {
        glucoseChecked: false,
        fluidsGiven: false,
        insulinGiven: false
      },
      isStabilized: false,
      waitingTimeSeconds: 0,
      treatmentLog: []
    }
  ];
}
