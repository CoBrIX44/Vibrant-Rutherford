import { eventBus } from '../state/EventBus';

export class GamepadManager {
  private static instance: GamepadManager;
  private pollingInterval: any = null;
  private lastButtonStates: boolean[] = [];

  private constructor() {}

  public static getInstance(): GamepadManager {
    if (!GamepadManager.instance) {
      GamepadManager.instance = new GamepadManager();
    }
    return GamepadManager.instance;
  }

  public startPolling(): void {
    if (this.pollingInterval || typeof window === 'undefined') return;

    this.pollingInterval = setInterval(() => {
      this.poll();
    }, 50); // 20Hz polling
  }

  public stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  private poll(): void {
    if (typeof navigator === 'undefined' || !navigator.getGamepads) return;
    const gamepads = navigator.getGamepads();
    const gp = gamepads[0];
    if (!gp) return;

    // Buttons
    // 0: A (Select)
    // 1: B (Back)
    // 4: LB (Prev bed)
    // 5: RB (Next bed)
    // 9: Start (Pause)
    // 12: D-Up
    // 13: D-Down
    // 14: D-Left
    // 15: D-Right

    const currentStates = gp.buttons.map(b => b.pressed);

    const justPressed = (idx: number) => currentStates[idx] && !this.lastButtonStates[idx];

    if (justPressed(0)) {
      eventBus.emit('GAMEPAD_ACTION', 'INTERACT');
    }
    if (justPressed(1)) {
      eventBus.emit('GAMEPAD_ACTION', 'BACK');
    }
    if (justPressed(4) || justPressed(14)) {
      eventBus.emit('GAMEPAD_ACTION', 'PREV_PATIENT');
    }
    if (justPressed(5) || justPressed(15)) {
      eventBus.emit('GAMEPAD_ACTION', 'NEXT_PATIENT');
    }
    if (justPressed(9)) {
      eventBus.emit('GAMEPAD_ACTION', 'PAUSE');
    }
    if (justPressed(12)) {
      eventBus.emit('GAMEPAD_ACTION', 'NAV_UP');
    }
    if (justPressed(13)) {
      eventBus.emit('GAMEPAD_ACTION', 'NAV_DOWN');
    }

    this.lastButtonStates = currentStates;
  }
}

export const gamepadManager = GamepadManager.getInstance();
