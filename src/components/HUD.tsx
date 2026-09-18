import React from 'react';
import { GameState } from '../state/GameState';
import { gameStateManager } from '../state/GameStateManager';
import { Clock, Activity, Bed, UserCheck, Pause, Settings, HelpCircle } from 'lucide-react';

interface HUDProps {
  state: GameState;
  onOpenSettings: () => void;
  onOpenTutorial: () => void;
}

export const HUD: React.FC<HUDProps> = ({ state, onOpenSettings, onOpenTutorial }) => {
  const mins = Math.floor(state.shiftTimeRemaining / 60);
  const secs = state.shiftTimeRemaining % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const isLowTime = state.shiftTimeRemaining < 120;

  return (
    <header 
      role="banner" 
      className="bg-slate-900 border-b border-slate-700 px-4 py-2.5 flex flex-wrap items-center justify-between gap-4 select-none"
    >
      {/* Shift & Title */}
      <div className="flex items-center gap-3">
        <div className="bg-sky-600 text-white font-black px-2.5 py-1 rounded text-sm tracking-wide flex items-center gap-1.5 shadow">
          <Activity className="w-4 h-4" aria-hidden="true" />
          <span>ER SHIFT 01</span>
        </div>
        {state.extendedTimeMode && (
          <span className="bg-emerald-950 text-emerald-300 border border-emerald-600 text-xs px-2 py-0.5 rounded font-semibold">
            RELAXED PACING ACTIVE
          </span>
        )}
      </div>

      {/* Hospital Resources & Time */}
      <div className="flex items-center gap-4 sm:gap-6 text-sm" role="region" aria-label="Department Resources and Timer">
        {/* Clock */}
        <div 
          className={`flex items-center gap-2 font-mono font-bold px-3 py-1 rounded border ${
            isLowTime 
              ? 'bg-red-950/80 text-red-300 border-red-500 animate-pulse' 
              : 'bg-slate-800 text-slate-100 border-slate-600'
          }`}
          aria-label={`Shift time remaining: ${mins} minutes ${secs} seconds`}
        >
          <Clock className="w-4 h-4 text-sky-400" aria-hidden="true" />
          <span className="text-base">{timeFormatted}</span>
        </div>

        {/* Test Slots */}
        <div 
          className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700 text-slate-200"
          title="Diagnostic Test Slots available for Labs / Imaging"
          aria-label={`Diagnostic Test Slots: ${state.resources.testSlots} of ${state.resources.maxTestSlots} available`}
        >
          <Activity className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
          <span className="text-xs text-slate-400 font-medium">TEST SLOTS:</span>
          <span className="font-mono font-bold text-sky-300">{state.resources.testSlots}/{state.resources.maxTestSlots}</span>
        </div>

        {/* Observation Beds */}
        <div 
          className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700 text-slate-200"
          title="Step-down observation beds available for stabilized patients"
          aria-label={`Observation Beds: ${state.resources.observationBeds} of ${state.resources.maxObservationBeds} available`}
        >
          <Bed className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
          <span className="text-xs text-slate-400 font-medium">OBS BEDS:</span>
          <span className="font-mono font-bold text-emerald-300">{state.resources.observationBeds}/{state.resources.maxObservationBeds}</span>
        </div>

        {/* Specialist Consults */}
        <div 
          className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700 text-slate-200"
          title="Specialist emergency consultations remaining"
          aria-label={`Specialist Consults: ${state.resources.specialistConsults} of ${state.resources.maxSpecialistConsults} available`}
        >
          <UserCheck className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
          <span className="text-xs text-slate-400 font-medium">SPECIALISTS:</span>
          <span className="font-mono font-bold text-amber-300">{state.resources.specialistConsults}/{state.resources.maxSpecialistConsults}</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => gameStateManager.togglePause()}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors focus:ring-2 focus:ring-sky-400"
          aria-label={state.isPaused ? "Resume shift (Esc)" : "Pause shift (Esc)"}
        >
          <Pause className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{state.isPaused ? "RESUME" : "PAUSE"}</span>
          <kbd className="bg-slate-900 px-1 py-0.2 rounded text-[10px] text-slate-400">Esc</kbd>
        </button>

        <button
          type="button"
          onClick={onOpenTutorial}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors focus:ring-2 focus:ring-sky-400"
          aria-label="Open clinical tutorial"
        >
          <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
          <span>TUTORIAL</span>
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className="px-2.5 py-1 bg-sky-700 hover:bg-sky-600 text-white rounded border border-sky-500 text-xs font-semibold flex items-center gap-1.5 transition-colors focus:ring-2 focus:ring-sky-400"
          aria-label="Open accessibility and game settings"
        >
          <Settings className="w-3.5 h-3.5" aria-hidden="true" />
          <span>SETTINGS</span>
        </button>
      </div>
    </header>
  );
};
