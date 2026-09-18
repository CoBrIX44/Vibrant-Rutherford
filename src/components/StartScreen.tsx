import React from 'react';
import { Play, HelpCircle, Settings, ShieldCheck, HeartPulse } from 'lucide-react';
import { gameStateManager } from '../state/GameStateManager';

interface StartScreenProps {
  onStartShift: () => void;
  onOpenTutorial: () => void;
  onOpenSettings: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStartShift, onOpenTutorial, onOpenSettings }) => {
  return (
    <main role="main" className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-700 rounded-xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
        {/* Title Header */}
        <div className="text-center flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-sky-600/20 border-2 border-sky-400 rounded-2xl flex items-center justify-center text-sky-400 shadow-inner">
            <HeartPulse className="w-9 h-9" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              EMERGENCY ROOM
            </h1>
            <p className="text-sky-400 font-medium text-sm mt-1">
              A 2D Healthcare Triage & Clinical Decision Simulation
            </p>
          </div>
        </div>

        {/* Mandatory Healthcare Disclaimer Box */}
        <div className="bg-amber-950/60 border border-amber-500/80 rounded-lg p-4 text-amber-200 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <strong className="font-bold uppercase tracking-wider block text-amber-300 mb-1">
              Educational Game Notice
            </strong>
            <p>
              &ldquo;Emergency Room is an educational game using fictional scenarios. It is not a medical diagnostic or treatment tool.&rdquo;
            </p>
            <p className="text-amber-300/80 text-xs mt-1">
              All patients, vital signs, medications, and outcomes are fictionalized for game design. This game must not be used as real-world medical advice.
            </p>
          </div>
        </div>

        {/* Core Game Info */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 text-xs sm:text-sm text-slate-300 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-sky-400">
            Shift Objectives
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Review arriving patients across 5 Emergency Department acute bays.</li>
            <li>Observe symptoms, inspect vital signs, and reveal medical histories.</li>
            <li>Prioritize care based on clinical acuity: <strong>CRITICAL</strong>, <strong>URGENT</strong>, <strong>PRIORITY</strong>, and <strong>ROUTINE</strong>.</li>
            <li>Allocate scarce hospital resources: Diagnostic Test Slots, Step-Down Beds, and Specialist Consultations.</li>
            <li>Fully accessible by design via keyboard, screen readers, subtitles, and Gamepad haptics.</li>
          </ul>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={onStartShift}
            className="flex-1 py-3.5 px-6 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-sky-950 transition-colors focus:ring-4 focus:ring-sky-400"
          >
            <Play className="w-5 h-5 fill-current" aria-hidden="true" />
            <span>START SHIFT (10:00)</span>
          </button>

          <button
            type="button"
            onClick={onOpenTutorial}
            className="py-3.5 px-5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors focus:ring-2 focus:ring-sky-400"
          >
            <HelpCircle className="w-4 h-4" aria-hidden="true" />
            <span>HOW TO PLAY</span>
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="py-3.5 px-5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors focus:ring-2 focus:ring-sky-400"
          >
            <Settings className="w-4 h-4" aria-hidden="true" />
            <span>ACCESSIBILITY</span>
          </button>
        </div>
      </div>
    </main>
  );
};
