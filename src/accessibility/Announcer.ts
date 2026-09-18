export class Announcer {
  private static instance: Announcer;
  private politeEl: HTMLElement | null = null;
  private assertiveEl: HTMLElement | null = null;

  private constructor() {
    if (typeof document !== 'undefined') {
      this.initElements();
    }
  }

  public static getInstance(): Announcer {
    if (!Announcer.instance) {
      Announcer.instance = new Announcer();
    }
    return Announcer.instance;
  }

  private initElements(): void {
    this.politeEl = document.getElementById('sr-announcer-polite');
    this.assertiveEl = document.getElementById('sr-announcer-assertive');

    if (!this.politeEl && typeof document !== 'undefined') {
      this.politeEl = document.createElement('div');
      this.politeEl.id = 'sr-announcer-polite';
      this.politeEl.className = 'sr-only';
      this.politeEl.setAttribute('aria-live', 'polite');
      this.politeEl.setAttribute('aria-atomic', 'true');
      document.body.appendChild(this.politeEl);
    }

    if (!this.assertiveEl && typeof document !== 'undefined') {
      this.assertiveEl = document.createElement('div');
      this.assertiveEl.id = 'sr-announcer-assertive';
      this.assertiveEl.className = 'sr-only';
      this.assertiveEl.setAttribute('aria-live', 'assertive');
      this.assertiveEl.setAttribute('aria-atomic', 'true');
      document.body.appendChild(this.assertiveEl);
    }
  }

  public announcePolite(message: string): void {
    if (!this.politeEl) this.initElements();
    if (this.politeEl) {
      // Clear briefly so identical consecutive messages are re-announced
      this.politeEl.textContent = '';
      setTimeout(() => {
        if (this.politeEl) {
          this.politeEl.textContent = message;
        }
      }, 50);
    }
  }

  public announceAssertive(message: string): void {
    if (!this.assertiveEl) this.initElements();
    if (this.assertiveEl) {
      this.assertiveEl.textContent = '';
      setTimeout(() => {
        if (this.assertiveEl) {
          this.assertiveEl.textContent = message;
        }
      }, 50);
    }
  }
}

export const announcer = Announcer.getInstance();
