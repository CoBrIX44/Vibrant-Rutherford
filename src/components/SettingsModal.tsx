import React from 'react';
import { X, Sliders, Eye, Volume2, Gamepad2, Clock, Check } from 'lucide-react';
import { AccessibilitySettings, ContrastTheme, FontScale } from '../accessibility/types';
import { SaveManager } from '../utils/SaveManager';
import { hapticService } from '../accessibility/HapticService';
import { audioService } from '../audio/AudioService';
import { gameStateManager } from '../state/GameStateManager';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  onUpdateSettings: (newSettings: AccessibilitySettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdateSettings }) => {
  if (!isOpen) return null;

  const handleContrastChange = (theme: ContrastTheme) => {
    const updated = { ...settings, contrastTheme: theme };
    onUpdateSettings(updated);
    SaveManager.saveSettings(updated);
  };

  const handleFontScaleChange = (scale: FontScale) => {
    const updated = { ...settings, fontScale: scale };
    onUpdateSettings(updated);
    SaveManager.saveSettings(updated);
  };

  const handleToggleReducedMotion = () => {
    const updated = { ...settings, reducedMotion: !settings.reducedMotion };
    onUpdateSettings(updated);
    SaveManager.saveSettings(updated);
  };

  const handleToggleAudio = () => {
    const updated = { ...settings, audioEnabled: !settings.audioEnabled };
    audioService.setEnabled(updated.audioEnabled);
    onUpdateSettings(updated);
    SaveManager.saveSettings(updated);
  };

  const handleToggleCaptions = () => {
    const updated = { ...settings, captionsEnabled: !settings.captionsEnabled };
    audioService.setCaptionsEnabled(updated.captionsEnabled);
    onUpdateSettings(updated);
    SaveManager.saveSettings(updated);
  };

  const handleToggleHaptics = () => {
    const updated = { ...settings, hapticsEnabled: !settings.hapticsEnabled };
    hapticService.setEnabled(updated.hapticsEnabled);
    onUpdateSettings(updated);
    SaveManager.saveSettings(updated);
  };

  const handleToggleExtendedTime = () => {
    const updated = { ...settings, extendedTimeMode: !settings.extendedTimeMode };
    gameStateManager.setExtendedTimeMode(updated.extendedTimeMode);
    onUpdateSettings(updated);
    SaveManager.saveSettings(updated);
  };

  const testVibration = () => {
    hapticService.trigger('CRITICAL_ALERT');
  };

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="settings-modal-title" 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="max-w-xl w-full bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-2xl flex flex-col gap-5 text-slate-100 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-400" aria-hidden="true" />
            <h2 id="settings-modal-title" className="text-lg font-bold text-slate-100">
              ACCESSIBILITY & PREFERENCES
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings dialog"
            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-sky-400"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Section: Visual & Contrast */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
            <span>VISUAL THEMES & CONTRAST</span>
          </h3>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">Contrast Theme:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleContrastChange('standard')}
                className={`px-3 py-2 rounded text-xs font-semibold border transition-all ${
                  settings.contrastTheme === 'standard'
                    ? 'bg-sky-950 text-sky-300 border-sky-400 ring-1 ring-sky-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                Standard Dark
              </button>
              <button
                type="button"
                onClick={() => handleContrastChange('high-contrast-dark')}
                className={`px-3 py-2 rounded text-xs font-semibold border transition-all ${
                  settings.contrastTheme === 'high-contrast-dark'
                    ? 'bg-black text-yellow-300 border-yellow-400 ring-1 ring-yellow-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                High Contrast (Dark)
              </button>
              <button
                type="button"
                onClick={() => handleContrastChange('high-contrast-light')}
                className={`px-3 py-2 rounded text-xs font-semibold border transition-all ${
                  settings.contrastTheme === 'high-contrast-light'
                    ? 'bg-white text-blue-900 border-blue-600 ring-1 ring-blue-600'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                High Contrast (Light)
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">Text Size Scale:</label>
            <div className="grid grid-cols-3 gap-2">
              {(['100', '125', '150'] as FontScale[]).map((scale) => (
                <button
                  key={scale}
                  type="button"
                  onClick={() => handleFontScaleChange(scale)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold border transition-all ${
                    settings.fontScale === scale
                      ? 'bg-sky-950 text-sky-300 border-sky-400 ring-1 ring-sky-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  {scale}%
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-800/80 rounded border border-slate-700">
            <div>
              <span className="text-xs font-bold text-slate-200 block">Reduced Motion</span>
              <span className="text-[11px] text-slate-400">Replaces waveforms with static charts; eliminates camera moves.</span>
            </div>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={handleToggleReducedMotion}
              className="w-4 h-4 rounded text-sky-500 focus:ring-sky-400 bg-slate-900 border-slate-600"
              aria-label="Toggle reduced motion"
            />
          </div>
        </div>

        {/* Section: Audio & Subtitles */}
        <div className="space-y-3 pt-2 border-t border-slate-700/60">
          <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>AUDIO & CLOSED CAPTIONS</span>
          </h3>

          <div className="flex items-center justify-between p-2.5 bg-slate-800/80 rounded border border-slate-700">
            <div>
              <span className="text-xs font-bold text-slate-200 block">Non-Essential Sound Synthesizer</span>
              <span className="text-[11px] text-slate-400">Ambient monitors and beeps. The game is 100% playable with audio off.</span>
            </div>
            <input
              type="checkbox"
              checked={settings.audioEnabled}
              onChange={handleToggleAudio}
              className="w-4 h-4 rounded text-sky-500 focus:ring-sky-400 bg-slate-900 border-slate-600"
              aria-label="Toggle synthesized audio"
            />
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-800/80 rounded border border-slate-700">
            <div>
              <span className="text-xs font-bold text-slate-200 block">Real-time Closed Captions</span>
              <span className="text-[11px] text-slate-400">Displays text subtitles for any monitor sounds or alert broadcasts.</span>
            </div>
            <input
              type="checkbox"
              checked={settings.captionsEnabled}
              onChange={handleToggleCaptions}
              className="w-4 h-4 rounded text-sky-500 focus:ring-sky-400 bg-slate-900 border-slate-600"
              aria-label="Toggle closed captions"
            />
          </div>
        </div>

        {/* Section: Haptics & Controller */}
        <div className="space-y-3 pt-2 border-t border-slate-700/60">
          <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>HAPTIC VIBRATION (GAMEPAD API)</span>
          </h3>

          <div className="flex items-center justify-between p-2.5 bg-slate-800/80 rounded border border-slate-700">
            <div>
              <span className="text-xs font-bold text-slate-200 block">Gamepad Vibration Feedback</span>
              <span className="text-[11px] text-slate-400">Tactile pulses for urgent alerts, critical cases, and action confirmations.</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={testVibration}
                className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-[11px] text-slate-200 rounded font-semibold transition-colors"
              >
                Test
              </button>
              <input
                type="checkbox"
                checked={settings.hapticsEnabled}
                onChange={handleToggleHaptics}
                className="w-4 h-4 rounded text-sky-500 focus:ring-sky-400 bg-slate-900 border-slate-600"
                aria-label="Toggle gamepad haptic vibrations"
              />
            </div>
          </div>
        </div>

        {/* Section: Pacing & Timer */}
        <div className="space-y-3 pt-2 border-t border-slate-700/60">
          <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            <span>PACING & MOTOR ACCESSIBILITY</span>
          </h3>

          <div className="flex items-center justify-between p-2.5 bg-slate-800/80 rounded border border-slate-700">
            <div>
              <span className="text-xs font-bold text-slate-200 block">Extended Time Mode (Relaxed Pacing)</span>
              <span className="text-[11px] text-slate-400">Slows shift timer by 50% and halves time penalties for decisions.</span>
            </div>
            <input
              type="checkbox"
              checked={settings.extendedTimeMode}
              onChange={handleToggleExtendedTime}
              className="w-4 h-4 rounded text-sky-500 focus:ring-sky-400 bg-slate-900 border-slate-600"
              aria-label="Toggle extended time mode"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 pt-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded font-bold text-xs flex items-center gap-1.5 shadow transition-colors focus:ring-2 focus:ring-sky-400"
          >
            <Check className="w-4 h-4" aria-hidden="true" />
            <span>SAVE & RETURN</span>
          </button>
        </div>
      </div>
    </div>
  );
};
