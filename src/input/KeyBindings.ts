export interface KeyBindingMap {
  NAVIGATE_UP: string[];
  NAVIGATE_DOWN: string[];
  NAVIGATE_LEFT: string[];
  NAVIGATE_RIGHT: string[];
  INTERACT: string[];
  PAUSE: string[];
  OPEN_INFO: string[];
  OPEN_OBJECTIVES: string[];
  ACTION_1: string[];
  ACTION_2: string[];
  ACTION_3: string[];
  ACTION_4: string[];
  ACTION_5: string[];
  ACTION_6: string[];
  ACTION_7: string[];
  ACTION_8: string[];
  ACTION_9: string[];
}

export const DEFAULT_KEY_BINDINGS: KeyBindingMap = {
  NAVIGATE_UP: ['ArrowUp', 'KeyW'],
  NAVIGATE_DOWN: ['ArrowDown', 'KeyS'],
  NAVIGATE_LEFT: ['ArrowLeft', 'KeyA'],
  NAVIGATE_RIGHT: ['ArrowRight', 'KeyD'],
  INTERACT: ['Enter', 'KeyE', 'Space'],
  PAUSE: ['Escape', 'KeyP'],
  OPEN_INFO: ['KeyI'],
  OPEN_OBJECTIVES: ['KeyO'],
  ACTION_1: ['Digit1', 'Numpad1'],
  ACTION_2: ['Digit2', 'Numpad2'],
  ACTION_3: ['Digit3', 'Numpad3'],
  ACTION_4: ['Digit4', 'Numpad4'],
  ACTION_5: ['Digit5', 'Numpad5'],
  ACTION_6: ['Digit6', 'Numpad6'],
  ACTION_7: ['Digit7', 'Numpad7'],
  ACTION_8: ['Digit8', 'Numpad8'],
  ACTION_9: ['Digit9', 'Numpad9']
};
