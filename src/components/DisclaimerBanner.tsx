import React from 'react';
import { AlertCircle } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <aside 
      aria-label="Medical Disclaimer" 
      className="bg-amber-950/80 border-b border-amber-600/60 text-amber-200 px-4 py-2 text-xs flex items-center justify-between gap-2 shadow-sm"
    >
      <div className="flex items-center gap-2 max-w-5xl mx-auto">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
        <p className="font-medium">
          <strong>EDUCATIONAL NOTICE:</strong> Emergency Room is an educational game using fictional scenarios. It is not a medical diagnostic or treatment tool.
        </p>
      </div>
    </aside>
  );
};
