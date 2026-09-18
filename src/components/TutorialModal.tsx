import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TUTORIAL_STEPS = [
  {
    title: '1. Welcome & Clinical Philosophy',
    content: `Welcome to Emergency Room. You are working a shift managing acute patient arrivals. Your goal is to systematically Observe, Decide, Act, and Reassess. 
    
    This simulation is not a trivia test or a multiple-choice quiz; every patient possesses an evolving physiological state, and every clinical action advances the shift clock and consumes real hospital resources.`
  },
  {
    title: '2. Clinical Priority & Acuity',
    content: `Patients arrive with varying degrees of physiological urgency:
    • CRITICAL: Severe immediate life threat (e.g., anaphylactic shock, acute coronary syndrome). Must be stabilized first!
    • URGENT: High acuity that can deteriorate quickly (e.g., severe asthma exacerbation, diabetic crisis).
    • PRIORITY: Moderate urgency requiring focused clinical evaluation.
    • ROUTINE: Stable baseline (e.g., mild dehydration from athletic exertion).
    
    Do not rely on arrival order; triage according to acuity!`
  },
  {
    title: '3. Navigating Bays & Beds',
    content: `You can switch active patient bays seamlessly using multiple accessible inputs:
    • Keyboard: Press 'A' or 'Arrow Left' for previous bed, 'D' or 'Arrow Right' for next bed.
    • Number Row: Direct action shortcuts 1–9.
    • Gamepad: D-Pad Left/Right or Left/Right Shoulder Bumpers.
    • Mouse: Click directly on any bed in the top selector bar or on the 2D hospital canvas.`
  },
  {
    title: '4. The Patient Dossier & Vitals',
    content: `Selecting a patient opens their electronic clinical record:
    • Chief Complaint & Symptoms: The initial clinical presentation.
    • Vital Signs: Heart Rate (HR), Blood Pressure (BP), Oxygen Saturation (SpO2), and Respiratory Rate (RR).
    • Medical History: Interview family or review charts to reveal allergies, medications, and risk factors.`
  },
  {
    title: '5. Making Clinical Decisions',
    content: `Every patient has contextual available actions displayed on the Action Panel:
    • Investigate: Recheck vitals, perform lung auscultation, or order diagnostic tests.
    • Treat: Administer oxygen, nebulized bronchodilators, emergency epinephrine, IV fluid boluses, or insulin protocols.
    • Escalate: Page on-call specialists (e.g., Cardiology team).
    • Disposition: Transfer stabilized patients to step-down observation beds.`
  },
  {
    title: '6. Managing Scarce Hospital Resources',
    content: `You have limited departmental commodities for the entire shift:
    • Diagnostic Test Slots (5 total): Consumed by Labs, Imaging, and 12-Lead ECGs.
    • Step-Down Observation Beds (3 total): Consumed when moving stable patients out of main acute bays.
    • Specialist Consults (2 total): Reserved for emergent subspecialty emergencies.
    
    Avoid ordering high-resource tests when a physical exam provides clear direction!`
  },
  {
    title: '7. Shift Clock & Relaxed Pacing Mode',
    content: `Your shift lasts 10:00 minutes. Every clinical decision costs between 30 and 90 seconds of shift time.
    
    If you prefer relaxed puzzle-solving without time pressure, enable 'Extended Time Mode' in the Settings menu. This slows the shift clock by 50% and reduces action time penalties.`
  },
  {
    title: '8. Full Multi-Modal Accessibility',
    content: `Emergency Room is accessible by design:
    • Blind Players: Full screen-reader support, ARIA live region announcements, semantic table structure.
    • Deaf Players: 100% playable with audio muted; visual subtitles and text logs for all cues.
    • Deaf-Blind Players: Keyboard navigation, persistent text records, Gamepad API vibration haptics.
    • High Contrast: Standard, High Contrast Dark, and High Contrast Light themes.
    • Reduced Motion: Full adherence to motion safety with static digital readouts.`
  }
];

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  if (!isOpen) return null;

  const step = TUTORIAL_STEPS[currentStep];
  const isLast = currentStep === TUTORIAL_STEPS.length - 1;

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="tutorial-modal-title" 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="max-w-xl w-full bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-2xl flex flex-col gap-4 text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <h2 id="tutorial-modal-title" className="text-lg font-bold text-sky-400">
            {step.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close tutorial dialog"
            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-sky-400"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Step Content */}
        <div className="text-sm text-slate-200 leading-relaxed min-h-[140px] whitespace-pre-line">
          {step.content}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between border-t border-slate-700 pt-3 text-xs">
          <span className="font-mono text-slate-400">
            Step {currentStep + 1} of {TUTORIAL_STEPS.length}
          </span>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-600 font-medium flex items-center gap-1 transition-colors focus:ring-2 focus:ring-sky-400"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>PREVIOUS</span>
              </button>
            )}

            {isLast ? (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded font-bold flex items-center gap-1 shadow transition-colors focus:ring-2 focus:ring-sky-400"
              >
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                <span>GOT IT — START PLAYING</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded font-bold flex items-center gap-1 shadow transition-colors focus:ring-2 focus:ring-sky-400"
              >
                <span>NEXT STEP</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
