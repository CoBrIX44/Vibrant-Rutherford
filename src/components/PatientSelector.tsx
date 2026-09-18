import React from 'react';
import { Patient, PriorityLevel } from '../patients/types';
import { gameStateManager } from '../state/GameStateManager';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info } from 'lucide-react';

interface PatientSelectorProps {
  patients: Patient[];
  activePatientId: string;
}

export const PatientSelector: React.FC<PatientSelectorProps> = ({ patients, activePatientId }) => {
  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'CRITICAL':
        return (
          <span className="bg-red-950 text-red-300 border border-red-600 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
            <AlertOctagon className="w-3 h-3 text-red-400" aria-hidden="true" />
            <span>CRITICAL</span>
          </span>
        );
      case 'URGENT':
        return (
          <span className="bg-orange-950 text-orange-300 border border-orange-600 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-orange-400" aria-hidden="true" />
            <span>URGENT</span>
          </span>
        );
      case 'PRIORITY':
        return (
          <span className="bg-amber-950 text-amber-300 border border-amber-600 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
            <Info className="w-3 h-3 text-amber-400" aria-hidden="true" />
            <span>PRIORITY</span>
          </span>
        );
      case 'ROUTINE':
        return (
          <span className="bg-sky-950 text-sky-300 border border-sky-600 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
            <span>ROUTINE</span>
          </span>
        );
    }
  };

  return (
    <nav 
      aria-label="Emergency Department Patient Beds" 
      className="bg-slate-900/90 border-b border-slate-700 px-4 py-2"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          ACTIVE HOSPITAL BAYS (Use A/D or Left/Right Arrows to switch)
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2" role="tablist">
        {patients.map((patient, idx) => {
          const isSelected = patient.id === activePatientId;
          return (
            <button
              key={patient.id}
              role="tab"
              aria-selected={isSelected}
              aria-controls="patient-dossier-panel"
              id={`tab-${patient.id}`}
              type="button"
              onClick={() => gameStateManager.selectPatient(patient.id)}
              className={`p-2 rounded border text-left flex flex-col justify-between transition-all focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                isSelected
                  ? 'bg-sky-950/80 border-sky-400 shadow-md shadow-sky-950/50 ring-1 ring-sky-400'
                  : 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-bold font-mono text-sky-400">
                  BED {idx + 1}
                </span>
                {patient.isStabilized ? (
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-600 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" aria-hidden="true" />
                    <span>STABLE</span>
                  </span>
                ) : (
                  getPriorityBadge(patient.priority)
                )}
              </div>

              <div className="font-semibold text-sm text-slate-100 truncate">
                {patient.name}
              </div>

              <div className="text-[11px] font-mono text-slate-400 mt-1 flex justify-between">
                <span>HR: {patient.vitals.heartRate}</span>
                <span>O2: {patient.vitals.oxygenSaturation}%</span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
