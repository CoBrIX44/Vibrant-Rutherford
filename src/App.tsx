import React, { useState, useEffect, useRef } from 'react';
import { GameState } from './state/GameState';
import { gameStateManager } from './state/GameStateManager';
import { eventBus } from './state/EventBus';
import { inputManager } from './input/InputManager';
import { SaveManager } from './utils/SaveManager';
import { AccessibilitySettings } from './accessibility/types';
import { audioService } from './audio/AudioService';
import { hapticService } from './accessibility/HapticService';
import { EmergencyRoomGame } from './game/EmergencyRoomGame';

// UI Components
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { HUD } from './components/HUD';
import { PatientSelector } from './components/PatientSelector';
import { PatientDossier } from './components/PatientDossier';
import { ActionPanel } from './components/ActionPanel';
import { FeedbackLog } from './components/FeedbackLog';
import { SubtitleBar } from './components/SubtitleBar';
import { StartScreen } from './components/StartScreen';
import { TutorialModal } from './components/TutorialModal';
import { SettingsModal } from './components/SettingsModal';
import { ShiftSummary } from './components/ShiftSummary';

export const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(gameStateManager.getState());
  const [settings, setSettings] = useState<AccessibilitySettings>(SaveManager.loadSettings());
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const phaserGameRef = useRef<EmergencyRoomGame | null>(null);
  const phaserContainerRef = useRef<HTMLDivElement | null>(null);

  // Initialize accessibility and inputs
  useEffect(() => {
    // Apply saved settings
    audioService.setEnabled(settings.audioEnabled);
    audioService.setCaptionsEnabled(settings.captionsEnabled);
    hapticService.setEnabled(settings.hapticsEnabled);
    gameStateManager.setExtendedTimeMode(settings.extendedTimeMode);

    inputManager.startListening();

    const unsubState = eventBus.on('STATE_CHANGED', (newState: GameState) => {
      setGameState({ ...newState });
    });

    return () => {
      inputManager.stopListening();
      unsubState();
    };
  }, []);

  // Sync Phaser Canvas when entering SHIFT screen
  useEffect(() => {
    if (gameState.screen === 'SHIFT' && phaserContainerRef.current && !phaserGameRef.current) {
      const game = new EmergencyRoomGame();
      game.init('phaser-er-container', settings.reducedMotion);
      phaserGameRef.current = game;
    } else if (gameState.screen !== 'SHIFT' && phaserGameRef.current) {
      phaserGameRef.current.destroy();
      phaserGameRef.current = null;
    }
  }, [gameState.screen]);

  // Sync reduced motion to Phaser
  useEffect(() => {
    if (phaserGameRef.current) {
      phaserGameRef.current.setReducedMotion(settings.reducedMotion);
    }
  }, [settings.reducedMotion]);

  const activePatient = gameStateManager.getActivePatient();

  const themeClass = settings.contrastTheme === 'high-contrast-dark'
    ? 'theme-high-contrast-dark'
    : settings.contrastTheme === 'high-contrast-light'
    ? 'theme-high-contrast-light'
    : '';

  const fontScaleClass = `font-scale-${settings.fontScale}`;
  const motionClass = settings.reducedMotion ? 'reduced-motion' : '';

  if (gameState.screen === 'START') {
    return (
      <div className={`${themeClass} ${fontScaleClass} ${motionClass}`}>
        <StartScreen
          onStartShift={() => gameStateManager.setScreen('SHIFT')}
          onOpenTutorial={() => setIsTutorialOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
        <TutorialModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onUpdateSettings={setSettings}
        />
      </div>
    );
  }

  if (gameState.screen === 'SUMMARY' && gameState.score) {
    return (
      <div className={`${themeClass} ${fontScaleClass} ${motionClass}`}>
        <ShiftSummary score={gameState.score} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col bg-slate-950 text-slate-100 ${themeClass} ${fontScaleClass} ${motionClass}`}>
      <DisclaimerBanner />

      <HUD
        state={gameState}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
      />

      <PatientSelector
        patients={gameState.patients}
        activePatientId={gameState.activePatientId}
      />

      {/* Main Dual-Representation Body: Left 2D Canvas + Right Semantic Dossier & Actions */}
      <main role="main" className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-7xl mx-auto w-full">
        {/* Left Column: 2D Phaser Hospital Environment (5 cols on large screens) */}
        <section 
          aria-label="2D Hospital Bay Floor Plan Canvas"
          className="lg:col-span-5 flex flex-col gap-3"
        >
          <div 
            id="phaser-er-container" 
            ref={phaserContainerRef}
            className="w-full aspect-[760/480] bg-slate-900 border border-slate-700 rounded-lg overflow-hidden shadow-lg flex items-center justify-center"
          />

          {/* Clinical Feedback Log below canvas */}
          <FeedbackLog logs={gameState.feedbackLog} />
        </section>

        {/* Right Column: Accessible Patient Dossier & Decision Controls (7 cols) */}
        <section 
          aria-label="Patient Clinical Dossier and Actions"
          className="lg:col-span-7 flex flex-col gap-4"
        >
          <PatientDossier patient={activePatient} />
          <ActionPanel patient={activePatient} resources={gameState.resources} />
        </section>
      </main>

      <SubtitleBar enabled={settings.captionsEnabled} />

      {/* Modals */}
      <TutorialModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />
    </div>
  );
};
