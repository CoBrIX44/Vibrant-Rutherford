import React from 'react';
import { Patient, PriorityLevel } from '../patients/types';
import { Heart, Activity, Wind, Thermometer, User, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface PatientDossierProps {
  patient: Patient;
}

export const PatientDossier: React.FC<PatientDossierProps> = ({ patient }) => {
  const getPriorityDisplay = (priority: PriorityLevel) => {
    switch (priority) {
      case 'CRITICAL':
        return {
          text: 'PRIORITY: CRITICAL (Immediate attention required)',
          badgeClass: 'bg-red-950 text-red-200 border-red-600'
        };
      case 'URGENT':
        return {
          text: 'PRIORITY: URGENT (High clinical acuity)',
          badgeClass: 'bg-orange-950 text-orange-200 border-orange-600'
        };
      case 'PRIORITY':
        return {
          text: 'PRIORITY: ELEVATED (Requires timely intervention)',
          badgeClass: 'bg-amber-950 text-amber-200 border-amber-600'
        };
      case 'ROUTINE':
        return {
          text: 'PRIORITY: ROUTINE (Stable clinical baseline)',
          badgeClass: 'bg-sky-950 text-sky-200 border-sky-600'
        };
    }
  };

  const pDisplay = getPriorityDisplay(patient.priority);

  return (
    <section 
      id="patient-dossier-panel"
      role="tabpanel"
      aria-labelledby={`tab-${patient.id}`}
      className="bg-slate-900 border border-slate-700 rounded-lg p-4 flex flex-col gap-4 text-slate-200 shadow-lg"
    >
      {/* Patient Header */}
      <div className="border-b border-slate-700 pb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-sky-400" aria-hidden="true" />
            <h2 className="text-xl font-bold text-slate-100">
              {patient.name}, <span className="font-normal text-slate-400 text-base">{patient.age} y/o</span>
            </h2>
            <span className="bg-slate-800 text-sky-400 border border-slate-600 px-2 py-0.5 rounded text-xs font-mono font-bold">
              {patient.bedId.toUpperCase().replace('-', ' ')}
            </span>
          </div>
          <p className="text-sm text-slate-300 mt-1 font-medium">
            <span className="text-slate-400">Chief Complaint:</span> &ldquo;{patient.chiefComplaint}&rdquo;
          </p>
        </div>

        <div>
          {patient.isStabilized ? (
            <div className="bg-emerald-950 text-emerald-200 border border-emerald-500 px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5 shadow">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              <span>PATIENT STABILIZED</span>
            </div>
          ) : (
            <div className={`border px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5 shadow ${pDisplay.badgeClass}`}>
              <ShieldAlert className="w-4 h-4" aria-hidden="true" />
              <span>{pDisplay.text}</span>
            </div>
          )}
        </div>
      </div>

      {/* Vital Signs Grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
          <span>PHYSIOLOGICAL VITAL SIGNS</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center" role="region" aria-label="Vital Signs Table">
          {/* Heart Rate */}
          <div className="bg-slate-800/90 border border-slate-700 p-2 rounded">
            <div className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1">
              <Heart className="w-3 h-3 text-red-400" aria-hidden="true" />
              <span>HEART RATE</span>
            </div>
            <div className="font-mono text-lg font-bold text-slate-100 mt-0.5">
              {patient.vitals.heartRate} <span className="text-xs font-normal text-slate-400">BPM</span>
            </div>
          </div>

          {/* Blood Pressure */}
          <div className="bg-slate-800/90 border border-slate-700 p-2 rounded">
            <div className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1">
              <Activity className="w-3 h-3 text-sky-400" aria-hidden="true" />
              <span>BLOOD PRESSURE</span>
            </div>
            <div className="font-mono text-lg font-bold text-slate-100 mt-0.5">
              {patient.vitals.bloodPressureSys}/{patient.vitals.bloodPressureDia} <span className="text-xs font-normal text-slate-400">mmHg</span>
            </div>
          </div>

          {/* Oxygen Saturation */}
          <div className="bg-slate-800/90 border border-slate-700 p-2 rounded">
            <div className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1">
              <Wind className="w-3 h-3 text-emerald-400" aria-hidden="true" />
              <span>O2 SATURATION</span>
            </div>
            <div className="font-mono text-lg font-bold text-slate-100 mt-0.5">
              {patient.vitals.oxygenSaturation}% <span className="text-xs font-normal text-slate-400">SpO2</span>
            </div>
          </div>

          {/* Respiratory Rate */}
          <div className="bg-slate-800/90 border border-slate-700 p-2 rounded">
            <div className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1">
              <Wind className="w-3 h-3 text-cyan-400" aria-hidden="true" />
              <span>RESP. RATE</span>
            </div>
            <div className="font-mono text-lg font-bold text-slate-100 mt-0.5">
              {patient.vitals.respiratoryRate} <span className="text-xs font-normal text-slate-400">/min</span>
            </div>
          </div>

          {/* Temperature */}
          <div className="bg-slate-800/90 border border-slate-700 p-2 rounded col-span-2 sm:col-span-1">
            <div className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1">
              <Thermometer className="w-3 h-3 text-amber-400" aria-hidden="true" />
              <span>TEMPERATURE</span>
            </div>
            <div className="font-mono text-lg font-bold text-slate-100 mt-0.5">
              {patient.vitals.temperature}°F
            </div>
          </div>
        </div>
      </div>

      {/* Symptoms & Current Assessment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-slate-800/70 border border-slate-700 p-3 rounded">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            PRESENTING SYMPTOMS
          </h4>
          <ul className="text-sm space-y-1 text-slate-300 list-disc list-inside">
            {patient.symptoms.map((sym, i) => (
              <li key={i}>{sym}</li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-800/70 border border-slate-700 p-3 rounded">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            CLINICAL STATUS SUMMARY
          </h4>
          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            {patient.currentState}
          </p>
        </div>
      </div>

      {/* Patient Medical History */}
      <div className="bg-slate-800/70 border border-slate-700 p-3 rounded">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          CONFIRMED MEDICAL HISTORY & BACKGROUND
        </h4>
        <div className="space-y-2">
          {patient.history.map((item, idx) => (
            <div key={idx} className="text-sm">
              <strong className="text-sky-300">{item.category}:</strong>{' '}
              {item.isRevealed ? (
                <span className="text-slate-200">{item.details}</span>
              ) : (
                <span className="text-slate-500 italic">
                  [Not yet reviewed — select &ldquo;Review Medical History&rdquo; action to uncover]
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
