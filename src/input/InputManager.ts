import { KeyBindingMap, DEFAULT_KEY_BINDINGS } from './KeyBindings';
import { gameStateManager } from '../state/GameStateManager';
import { announcer } from '../accessibility/Announcer';
import { hapticService } from '../accessibility/HapticService';
import { eventBus } from '../state/EventBus';
import { gamepadManager } from './GamepadManager';

export class InputManager {
  private static instance: InputManager;
  private keyBindings: KeyBindingMap = { ...DEFAULT_KEY_BINDINGS };
  private isListening: boolean = false;
  private handleKeyDownBound: (e: KeyboardEvent) => void;

  private constructor() {
    this.handleKeyDownBound = this.handleKeyDown.bind(this);
    this.initGamepad();
  }

  public static getInstance(): InputManager {
    if (!InputManager.instance) {
      InputManager.instance = new InputManager();
    }
    return InputManager.instance;
  }

  public setKeyBindings(bindings: KeyBindingMap): void {
    this.keyBindings = bindings;
  }

  public getKeyBindings(): KeyBindingMap {
    return this.keyBindings;
  }

  public startListening(): void {
    if (this.isListening || typeof window === 'undefined') return;
    window.addEventListener('keydown', this.handleKeyDownBound);
    this.isListening = true;
    gamepadManager.startPolling();
  }

  public stopListening(): void {
    if (!this.isListening || typeof window === 'undefined') return;
    window.removeEventListener('keydown', this.handleKeyDownBound);
    this.isListening = false;
    gamepadManager.stopPolling();
  }

  private initGamepad(): void {
    eventBus.on('GAMEPAD_ACTION', (action: string) => {
      const state = gameStateManager.getState();
      if (state.screen !== 'SHIFT') return;

      switch (action) {
        case 'NEXT_PATIENT':
          gameStateManager.selectNextPatient();
          this.announcePatientSelected();
          break;
        case 'PREV_PATIENT':
          gameStateManager.selectPrevPatient();
          this.announcePatientSelected();
          break;
        case 'PAUSE':
          gameStateManager.togglePause();
          break;
      }
    });
  }

  private handleKeyDown(e: KeyboardEvent): void {
    // Ignore input if user is typing in an input/textarea
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT')) {
      return;
    }

    const state = gameStateManager.getState();

    // Global Pause
    if (this.matches(e.code, this.keyBindings.PAUSE)) {
      e.preventDefault();
      if (state.screen === 'SHIFT') {
        gameStateManager.togglePause();
      } else if (state.screen === 'SETTINGS') {
        gameStateManager.setScreen('SHIFT');
      }
      return;
    }

    // Controls only active during SHIFT screen
    if (state.screen !== 'SHIFT') return;

    // Patient switching with ArrowLeft / ArrowRight / A / D
    if (this.matches(e.code, this.keyBindings.NAVIGATE_LEFT)) {
      e.preventDefault();
      gameStateManager.selectPrevPatient();
      this.announcePatientSelected();
      return;
    }

    if (this.matches(e.code, this.keyBindings.NAVIGATE_RIGHT)) {
      e.preventDefault();
      gameStateManager.selectNextPatient();
      this.announcePatientSelected();
      return;
    }

    // Number keys 1-9 to trigger corresponding actions
    for (let i = 1; i <= 9; i++) {
      const actionKey = `ACTION_${i}` as keyof KeyBindingMap;
      if (this.matches(e.code, this.keyBindings[actionKey])) {
        e.preventDefault();
        this.triggerActionByNumber(i);
        return;
      }
    }

    // Patient info readout shortcut (I)
    if (this.matches(e.code, this.keyBindings.OPEN_INFO)) {
      e.preventDefault();
      const patient = gameStateManager.getActivePatient();
      announcer.announcePolite(patient.accessibleDescription);
      return;
    }

    // Objectives readout shortcut (O)
    if (this.matches(e.code, this.keyBindings.OPEN_OBJECTIVES)) {
      e.preventDefault();
      const timeMins = Math.floor(state.shiftTimeRemaining / 60);
      const timeSecs = state.shiftTimeRemaining % 60;
      const objectives = `Shift Objective: Stabilize 5 emergency patients. Time remaining: ${timeMins} minutes ${timeSecs} seconds. Diagnostic test slots: ${state.resources.testSlots} of 5 available. Observation beds: ${state.resources.observationBeds} of 3 available. Specialist consults: ${state.resources.specialistConsults} of 2 available.`;
      announcer.announcePolite(objectives);
      return;
    }
  }

  private triggerActionByNumber(num: number): void {
    const patient = gameStateManager.getActivePatient();
    if (num <= patient.availableActionIds.length) {
      const actionId = patient.availableActionIds[num - 1];
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
    } else {
      announcer.announcePolite(`Action slot ${num} is not available for this patient.`);
      hapticService.trigger('ACTION_FAILURE');
    }
  }

  private announcePatientSelected(): void {
    const p = gameStateManager.getActivePatient();
    announcer.announcePolite(`Selected ${p.name}, Bed ${p.bedId.replace('bed-', '')}. Priority: ${p.priority}. Complaint: ${p.chiefComplaint}. Vitals: Heart Rate ${p.vitals.heartRate} BPM, Blood Pressure ${p.vitals.bloodPressureSys}/${p.vitals.bloodPressureDia}, Oxygen Saturation ${p.vitals.oxygenSaturation}%.`);
    hapticService.trigger('PATIENT_ARRIVAL');
  }

  private matches(code: string, keys: string[]): boolean {
    return keys.includes(code);
  }
}

export const inputManager = InputManager.getInstance();
