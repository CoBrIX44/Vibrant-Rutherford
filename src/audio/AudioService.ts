import { eventBus } from '../state/EventBus';

export class AudioService {
  private static instance: AudioService;
  private ctx: AudioContext | null = null;
  private enabled: boolean = false;
  private captionsEnabled: boolean = true;

  private constructor() {}

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (enabled && !this.ctx && typeof window !== 'undefined') {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      } catch (err) {
        console.warn('Web Audio API not supported on this browser.');
      }
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setCaptionsEnabled(enabled: boolean): void {
    this.captionsEnabled = enabled;
  }

  public isCaptionsEnabled(): boolean {
    return this.captionsEnabled;
  }

  public playBeep(frequency: number = 880, duration: number = 0.08, captionText?: string): void {
    if (captionText && this.captionsEnabled) {
      eventBus.emit('CAPTION_DISPATCHED', captionText);
    }

    if (!this.enabled || !this.ctx) return;

    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio playback failed safely
    }
  }

  public playHeartbeat(bpm: number): void {
    this.playBeep(660, 0.06, `[ECG Monitor Pulse: ${bpm} BPM]`);
  }

  public playSuccessTone(): void {
    this.playBeep(523, 0.1, '[Positive Clinical Response]');
    setTimeout(() => {
      this.playBeep(659, 0.12);
    }, 110);
  }

  public playAlertTone(): void {
    this.playBeep(784, 0.12, '[Warning / Alert Signal]');
    setTimeout(() => {
      this.playBeep(440, 0.15);
    }, 130);
  }
}

export const audioService = AudioService.getInstance();
