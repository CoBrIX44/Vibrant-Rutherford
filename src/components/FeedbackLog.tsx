import React from 'react';
import { MessageSquare } from 'lucide-react';

interface FeedbackLogProps {
  logs: Array<{
    id: string;
    timestamp: string;
    text: string;
    patientId?: string;
  }>;
}

export const FeedbackLog: React.FC<FeedbackLogProps> = ({ logs }) => {
  return (
    <aside 
      aria-label="Clinical Decision & Event Log" 
      className="bg-slate-900 border border-slate-700 rounded-lg p-3 flex flex-col gap-2 max-h-48 overflow-y-auto shadow-inner"
    >
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-slate-900 pb-1 border-b border-slate-800">
        <MessageSquare className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
        <span>CLINICAL EVENT & REASONING LOG</span>
      </div>

      <div role="log" aria-live="polite" className="space-y-1.5 text-xs">
        {logs.map((item) => (
          <div key={item.id} className="flex items-start gap-2 text-slate-300">
            <span className="font-mono text-sky-400 shrink-0 select-none">
              [{item.timestamp}]
            </span>
            <span className="leading-relaxed">
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
};
