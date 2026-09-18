import React, { useState, useEffect } from 'react';
import { eventBus } from '../state/EventBus';
import { Volume2 } from 'lucide-react';

export const SubtitleBar: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  const [caption, setCaption] = useState<string>('Ready • No active emergency broadcast');

  useEffect(() => {
    const unsub = eventBus.on('CAPTION_DISPATCHED', (text: string) => {
      setCaption(text);
    });
    return unsub;
  }, []);

  if (!enabled) return null;

  return (
    <footer 
      role="region" 
      aria-label="Closed Captions" 
      className="bg-slate-950 border-t border-slate-800 px-4 py-1.5 text-xs text-slate-300 flex items-center justify-center gap-2 select-none"
    >
      <Volume2 className="w-3.5 h-3.5 text-sky-400 shrink-0" aria-hidden="true" />
      <span className="font-mono text-sky-200">{caption}</span>
    </footer>
  );
};
