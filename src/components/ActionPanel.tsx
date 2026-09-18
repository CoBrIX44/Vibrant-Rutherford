import React from 'react';
import { Patient } from '../patients/types';
import { HospitalResources } from '../state/GameState';
import { gameStateManager } from '../state/GameStateManager';
import { DECISION_ACTIONS } from '../decisions/DecisionEngine';
import { Stethoscope, Clock, Activity, Check, AlertCircle } from 'lucide-react';
import { announcer } from '../accessibility/Announcer';
import { hapticService } from '../accessibility/HapticService';

interface ActionPanelProps {
  patient: Patient;
  resources: HospitalResources;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({ patient, resources }) => {
  const handleExecute = (actionId: string, shortcutNum: number) => {
    const result = gameStateManager.executeAction(actionId);
    if (result.accessibleMessage) {
      if (result.hapticPattern === 'CRITICAL_ALERT') {
        announcer.announceAssertive(result.accessibleMessage);
      } else {
        announcer.announcePolite(result.accessibleMessage);
      }
    }
    if (result.hapticPattern) {
      hapticService.trigger(result.hapticPattern);
    }
  };

  return (
    <section 
      aria-labelledby="available-actions-heading" 
      className="bg-slate-900 border border-slate-700 rounded-lg p-4 flex flex-col gap-3 shadow-lg"
    >
      <div className="flex items-center justify-between border-b border-slate-700 pb-2">
        <h3 id="available-actions-heading" className="text-sm font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wide">
          <Stethoscope className="w-4 h-4 text-sky-400" aria-hidden="true" />
          <span>AVAILABLE CLINICAL DECISIONS (Keys 1–{patient.availableActionIds.length})</span>
        </h3>
        <span className="text-xs text-slate-400">
          Observe → Decide → Act → Reassess
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5" role="group" aria-label="Clinical Action Options">
        {patient.availableActionIds.map((actionId, index) => {
          const action = DECISION_ACTIONS[actionId];
          if (!action) return null;

          const isAvailable = action.isAvailable(patient, resources);
          const shortcutKey = (index + 1).toString();

          return (
            <button
              key={actionId}
              type="button"
              disabled={!isAvailable}
              onClick={() => handleExecute(actionId, index + 1)}
              aria-label={`Action ${shortcutKey}: ${action.label}. Time cost: ${action.timeCostSeconds} seconds. ${
                action.resourceCost.testSlots ? `Requires ${action.resourceCost.testSlots} Test Slot. ` : ''
              }${
                action.resourceCost.specialistConsults ? `Requires ${action.resourceCost.specialistConsults} Specialist Consult. ` : ''
              }${
                action.resourceCost.observationBeds ? `Requires ${action.resourceCost.observationBeds} Observation Bed. ` : ''
              }${!isAvailable ? 'Currently unavailable due to unmet prerequisites or insufficient resources.' : ''}`}
              className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                isAvailable
                  ? 'bg-slate-800/90 border-slate-600 hover:bg-slate-750 hover:border-sky-500 text-slate-100 active:scale-[0.99]'
                  : 'bg-slate-900/50 border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <kbd className="bg-slate-950 text-sky-300 border border-slate-700 font-mono font-bold text-xs px-2 py-0.5 rounded shadow-sm">
                    {shortcutKey}
                  </kbd>
                  <span className="font-bold text-sm text-slate-100">
                    {action.label}
                  </span>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                  {action.category}
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-2 leading-snug">
                {action.description}
              </p>

              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-700/60 mt-auto gap-2">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-sky-400" aria-hidden="true" />
                  <span>Time Cost: {action.timeCostSeconds}s</span>
                </span>

                {action.resourceCost.testSlots && (
                  <span className="text-sky-300 font-medium">
                    Consumes 1 Test Slot
                  </span>
                )}
                {action.resourceCost.specialistConsults && (
                  <span className="text-amber-300 font-medium">
                    Consumes 1 Specialist Consult
                  </span>
                )}
                {action.resourceCost.observationBeds && (
                  <span className="text-emerald-300 font-medium">
                    Consumes 1 Obs Bed
                  </span>
                )}

                {!isAvailable && (
                  <span className="text-red-400 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3" aria-hidden="true" />
                    <span>Prerequisites / Slots Depleted</span>
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
