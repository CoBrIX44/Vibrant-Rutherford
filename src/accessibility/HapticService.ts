export type HapticPattern = 
  | 'PATIENT_ARRIVAL'
  | 'URGENT_ALERT'
  | 'CRITICAL_ALERT'
  | 'ACTION_SUCCESS'
  | 'ACTION_FAILURE'
  | 'OBJECTIVE_COMPLETE'
  | 'SHIFT_COMPLETE';

export class HapticService {
  private static instance: HapticService;
  private enabled: boolean = true;

  private constructor() {}

  public static getInstance(): HapticService {
    if (!HapticService.instance) {
      HapticService.instance = new HapticService();
    }
    return HapticService.instance;
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public trigger(pattern: HapticPattern): void {
    if (!this.enabled) return;
    if (typeof navigator === 'undefined' || !navigator.getGamepads) return;

    try {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      for (const gp of gamepads) {
        if (gp && gp.vibrationActuator) {
          this.playPattern(gp.vibrationActuator, pattern);
        }
      }
    } catch (err) {
      // Haptics fail gracefully without impacting gameplay
    }
  }

  private async playPattern(actuator: any, pattern: HapticPattern): Promise<void> {
    try {
      switch (pattern) {
        case 'PATIENT_ARRIVAL':
          // One medium pulse
          await actuator.playEffect('dual-rumble', {
            startDelay: 0,
            duration: 200,
            weakMagnitude: 0.5,
            strongMagnitude: 0.3
          });
          break;

        case 'URGENT_ALERT':
          // Two short pulses
          await actuator.playEffect('dual-rumble', { startDelay: 0, duration: 100, weakMagnitude: 0.8, strongMagnitude: 0.5 });
          setTimeout(() => {
            actuator.playEffect('dual-rumble', { startDelay: 0, duration: 100, weakMagnitude: 0.8, strongMagnitude: 0.5 });
          }, 150);
          break;

        case 'CRITICAL_ALERT':
          // Three short sharp pulses then one long heavy rumble
          await actuator.playEffect('dual-rumble', { startDelay: 0, duration: 80, weakMagnitude: 1.0, strongMagnitude: 0.8 });
          setTimeout(async () => {
            await actuator.playEffect('dual-rumble', { startDelay: 0, duration: 80, weakMagnitude: 1.0, strongMagnitude: 0.8 });
            setTimeout(async () => {
              await actuator.playEffect('dual-rumble', { startDelay: 0, duration: 80, weakMagnitude: 1.0, strongMagnitude: 0.8 });
              setTimeout(() => {
                actuator.playEffect('dual-rumble', { startDelay: 0, duration: 400, weakMagnitude: 0.7, strongMagnitude: 1.0 });
              }, 120);
            }, 120);
          }, 120);
          break;

        case 'ACTION_SUCCESS':
          // Two crisp light pulses
          await actuator.playEffect('dual-rumble', { startDelay: 0, duration: 60, weakMagnitude: 0.4, strongMagnitude: 0.2 });
          setTimeout(() => {
            actuator.playEffect('dual-rumble', { startDelay: 0, duration: 60, weakMagnitude: 0.5, strongMagnitude: 0.3 });
          }, 100);
          break;

        case 'ACTION_FAILURE':
          // One long low buzz
          await actuator.playEffect('dual-rumble', {
            startDelay: 0,
            duration: 350,
            weakMagnitude: 0.1,
            strongMagnitude: 0.9
          });
          break;

        case 'OBJECTIVE_COMPLETE':
        case 'SHIFT_COMPLETE':
          // Ascending sequence
          await actuator.playEffect('dual-rumble', { startDelay: 0, duration: 150, weakMagnitude: 0.5, strongMagnitude: 0.3 });
          setTimeout(async () => {
            await actuator.playEffect('dual-rumble', { startDelay: 0, duration: 150, weakMagnitude: 0.8, strongMagnitude: 0.5 });
            setTimeout(() => {
              actuator.playEffect('dual-rumble', { startDelay: 0, duration: 300, weakMagnitude: 1.0, strongMagnitude: 0.7 });
            }, 200);
          }, 200);
          break;
      }
    } catch {
      // Browser vibration error suppressed
    }
  }
}

export const hapticService = HapticService.getInstance();
