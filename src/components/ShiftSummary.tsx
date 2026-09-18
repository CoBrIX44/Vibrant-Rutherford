import React from 'react';
import { ShiftScore } from '../state/GameState';
import { gameStateManager } from '../state/GameStateManager';
import { Award, CheckCircle2, AlertTriangle, RotateCcw, AlertCircle } from 'lucide-react';

interface ShiftSummaryProps {
  score: ShiftScore;
}

export const ShiftSummary: React.FC<ShiftSummaryProps> = ({ score }) => {
  return (
    <main role="main" className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-700 rounded-xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-2 border-b border-slate-700 pb-4">
          <div className="w-14 h-14 bg-sky-600/20 border-2 border-sky-400 rounded-2xl flex items-center justify-center text-sky-400">
            <Award className="w-8 h-8" aria-hidden="true" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            SHIFT COMPLETED
          </h1>
          <p className="text-sky-400 font-semibold text-sm">
            Emergency Department Triage & Care Summary
          </p>
        </div>

        {/* Quantitative Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center" role="region" aria-label="Shift Score Breakdown">
          <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-lg">
            <span className="text-[11px] text-slate-400 font-bold block mb-1">STABILIZED</span>
            <span className="font-mono text-xl font-black text-emerald-400">
              {score.patientsStabilized} / {score.totalPatients}
            </span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-lg">
            <span className="text-[11px] text-slate-400 font-bold block mb-1">CRITICAL CASES</span>
            <span className="font-mono text-xl font-black text-red-400">
              {score.criticalCasesStabilized} / {score.totalCriticalCases}
            </span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-lg">
            <span className="text-[11px] text-slate-400 font-bold block mb-1">RESOURCES SAVED</span>
            <span className="font-mono text-xl font-black text-sky-400">
              {score.resourcesConservedPercentage}%
            </span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-lg">
            <span className="text-[11px] text-slate-400 font-bold block mb-1">DECISIONS LOGGED</span>
            <span className="font-mono text-xl font-black text-amber-400">
              {score.decisionsCompleted}
            </span>
          </div>
        </div>

        {/* Qualitative Clinical Feedback */}
        <div className="space-y-4">
          {score.strengths.length > 0 && (
            <div className="bg-emerald-950/40 border border-emerald-600/60 rounded-lg p-3 text-sm">
              <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span>CLINICAL STRENGTHS IDENTIFIED</span>
              </h2>
              <ul className="list-disc list-inside space-y-1 text-slate-200">
                {score.strengths.map((str, i) => (
                  <li key={i}>{str}</li>
                ))}
              </ul>
            </div>
          )}

          {score.areasToImprove.length > 0 && (
            <div className="bg-amber-950/40 border border-amber-600/60 rounded-lg p-3 text-sm">
              <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <span>AREAS FOR REFINEMENT</span>
              </h2>
              <ul className="list-disc list-inside space-y-1 text-slate-200">
                {score.areasToImprove.map((area, i) => (
                  <li key={i}>{area}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Disclaimer Reminder */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-slate-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
          <p>
            Reminder: Emergency Room is an educational game using fictional scenarios. It is not a medical diagnostic or treatment tool.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => gameStateManager.restartShift()}
            className="w-full py-3 px-6 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-colors focus:ring-4 focus:ring-sky-400"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>COMMENCE NEW SHIFT</span>
          </button>
        </div>
      </div>
    </main>
  );
};
