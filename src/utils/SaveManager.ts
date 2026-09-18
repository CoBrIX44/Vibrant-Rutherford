import { AccessibilitySettings, DEFAULT_A11Y_SETTINGS } from '../accessibility/types';
import { KeyBindingMap, DEFAULT_KEY_BINDINGS } from '../input/KeyBindings';

const SETTINGS_KEY = 'emergency_room_settings_v1';
const BINDINGS_KEY = 'emergency_room_keybindings_v1';

export class SaveManager {
  public static loadSettings(): AccessibilitySettings {
    if (typeof localStorage === 'undefined') return DEFAULT_A11Y_SETTINGS;
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (data) {
        return { ...DEFAULT_A11Y_SETTINGS, ...JSON.parse(data) };
      }
    } catch {
      // LocalStorage error fallback
    }
    return DEFAULT_A11Y_SETTINGS;
  }

  public static saveSettings(settings: AccessibilitySettings): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // Storage quota exceeded or disabled
    }
  }

  public static loadKeyBindings(): KeyBindingMap {
    if (typeof localStorage === 'undefined') return DEFAULT_KEY_BINDINGS;
    try {
      const data = localStorage.getItem(BINDINGS_KEY);
      if (data) {
        return { ...DEFAULT_KEY_BINDINGS, ...JSON.parse(data) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_KEY_BINDINGS;
  }

  public static saveKeyBindings(bindings: KeyBindingMap): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(BINDINGS_KEY, JSON.stringify(bindings));
    } catch {
      // Ignore
    }
  }
}
