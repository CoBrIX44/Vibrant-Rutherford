export type ContrastTheme = 'standard' | 'high-contrast-dark' | 'high-contrast-light';
export type FontScale = '100' | '125' | '150';

export interface AccessibilitySettings {
  contrastTheme: ContrastTheme;
  fontScale: FontScale;
  reducedMotion: boolean;
  audioEnabled: boolean;
  captionsEnabled: boolean;
  hapticsEnabled: boolean;
  extendedTimeMode: boolean;
}

export const DEFAULT_A11Y_SETTINGS: AccessibilitySettings = {
  contrastTheme: 'standard',
  fontScale: '100',
  reducedMotion: false,
  audioEnabled: false, // Default off per non-essential audio rule
  captionsEnabled: true,
  hapticsEnabled: true,
  extendedTimeMode: false
};
