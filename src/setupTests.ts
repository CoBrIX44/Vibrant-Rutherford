import '@testing-library/jest-dom';

// Mock Web Audio API
class MockAudioContext {
  state = 'running';
  createOscillator() {
    return {
      connect: () => {},
      start: () => {},
      stop: () => {},
      frequency: { setValueAtTime: () => {} },
      type: 'sine'
    };
  }
  createGain() {
    return {
      connect: () => {},
      gain: {
        setValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {},
        linearRampToValueAtTime: () => {}
      }
    };
  }
  destination = {};
  resume = async () => {};
  close = async () => {};
}

// @ts-ignore
window.AudioContext = window.AudioContext || MockAudioContext;
// @ts-ignore
window.webkitAudioContext = window.webkitAudioContext || MockAudioContext;

// Mock Gamepad API
Object.defineProperty(navigator, 'getGamepads', {
  value: () => [],
  writable: true
});
