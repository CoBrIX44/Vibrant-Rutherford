import Phaser from 'phaser';
import { gameStateManager } from '../../state/GameStateManager';
import { eventBus } from '../../state/EventBus';
import { Patient, PriorityLevel } from '../../patients/types';

export class ERScene extends Phaser.Scene {
  private bedContainers: Map<string, Phaser.GameObjects.Container> = new Map();
  private ecgGraphics: Map<string, Phaser.GameObjects.Graphics> = new Map();
  private ecgOffsets: Map<string, number> = new Map();
  private isReducedMotion: boolean = false;
  private unsubscribeEvents: (() => void)[] = [];

  constructor() {
    super({ key: 'ERScene' });
  }

  public setReducedMotion(reduced: boolean): void {
    this.isReducedMotion = reduced;
  }

  create(): void {
    const { width, height } = this.scale;

    // Draw Hospital Floor
    const floor = this.add.graphics();
    floor.fillStyle(0x0F172A, 1); // Dark Navy / Slate 900
    floor.fillRect(0, 0, width, height);

    // Floor Tile Grid Lines (subtle medical linoleum)
    floor.lineStyle(1, 0x1E293B, 0.4);
    for (let x = 0; x < width; x += 40) {
      floor.lineBetween(x, 0, x, height);
    }
    for (let y = 0; y < height; y += 40) {
      floor.lineBetween(0, y, width, y);
    }

    // ER Corridor Header Banner
    const banner = this.add.graphics();
    banner.fillStyle(0x1E293B, 1);
    banner.fillRect(0, 0, width, 50);
    banner.lineStyle(2, 0x334155, 1);
    banner.lineBetween(0, 50, width, 50);

    // Red Cross Symbol
    const cross = this.add.graphics();
    cross.fillStyle(0xEF4444, 1);
    cross.fillRect(20, 15, 20, 7);
    cross.fillRect(26.5, 8.5, 7, 20);

    this.add.text(50, 14, 'EMERGENCY CARE UNIT — ACUTE BAYS 1–5', {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#F8FAFC'
    });

    // Central Triage Nurse Station
    this.createNurseStation(width / 2, 85);

    // Create 5 Patient Bays
    // 3 beds along the top row, 2 beds along the bottom row
    const bedPositions = [
      { x: 120, y: 190 },  // Bed 1
      { x: 380, y: 190 },  // Bed 2
      { x: 640, y: 190 },  // Bed 3
      { x: 220, y: 390 },  // Bed 4
      { x: 540, y: 390 }   // Bed 5
    ];

    const state = gameStateManager.getState();
    state.patients.forEach((patient, index) => {
      const pos = bedPositions[index];
      this.createBed(patient, pos.x, pos.y);
    });

    // Listen to GameStateManager events
    const unsubSelect = eventBus.on('PATIENT_SELECTED', () => {
      this.updateAllBeds();
    });

    const unsubState = eventBus.on('STATE_CHANGED', () => {
      this.updateAllBeds();
    });

    const unsubAction = eventBus.on('ACTION_EXECUTED', () => {
      this.updateAllBeds();
    });

    this.unsubscribeEvents.push(unsubSelect, unsubState, unsubAction);

    // Initial update
    this.updateAllBeds();
  }

  private createNurseStation(x: number, y: number): void {
    const station = this.add.graphics();
    station.fillStyle(0x1E293B, 0.9);
    station.fillRoundedRect(x - 140, y - 20, 280, 42, 6);
    station.lineStyle(1.5, 0x0284C7, 0.8);
    station.strokeRoundedRect(x - 140, y - 20, 280, 42, 6);

    this.add.text(x, y - 8, 'CENTRAL TRIAGE & MONITORING CONSOLE', {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#38BDF8'
    }).setOrigin(0.5);

    this.add.text(x, y + 8, 'STAFF PHYSICIAN ON DUTY • CRASH CART STANDBY', {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '9px',
      color: '#94A3B8'
    }).setOrigin(0.5);
  }

  private createBed(patient: Patient, x: number, y: number): void {
    const container = this.add.container(x, y);

    // Bed frame dimensions
    const bedWidth = 190;
    const bedHeight = 135;

    // Interactive hitbox
    const hitZone = this.add.zone(0, 0, bedWidth, bedHeight)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        gameStateManager.selectPatient(patient.id);
      });
    container.add(hitZone);

    // Selection border / background
    const bg = this.add.graphics();
    bg.setName('bg');
    container.add(bg);

    // Mattress & Bed Frame
    const frame = this.add.graphics();
    // Headboard
    frame.fillStyle(0x334155, 1);
    frame.fillRoundedRect(-75, -55, 150, 10, 3);
    // Mattress
    frame.fillStyle(0x38BDF8, 0.15);
    frame.fillRoundedRect(-70, -45, 140, 65, 4);
    frame.lineStyle(1, 0x475569, 1);
    frame.strokeRoundedRect(-70, -45, 140, 65, 4);

    // Pillow
    frame.fillStyle(0xF8FAFC, 0.85);
    frame.fillRoundedRect(-60, -40, 30, 20, 4);

    // Blanket
    frame.fillStyle(0x0284C7, 0.7);
    frame.fillRoundedRect(-30, -43, 95, 60, 3);

    // Patient Avatar / Head
    const avatar = this.add.graphics();
    avatar.fillStyle(0xFBCFE8, 1); // Soft skin tone
    avatar.fillCircle(-45, -30, 9);
    container.add(frame);
    container.add(avatar);

    // IV Pole & Bag
    const iv = this.add.graphics();
    iv.lineStyle(2, 0x94A3B8, 1);
    iv.lineBetween(75, -55, 75, 10);
    iv.fillStyle(0xE0F2FE, 0.9);
    iv.fillRoundedRect(70, -58, 10, 15, 2);
    container.add(iv);

    // Overhead Cardiac Monitor Screen
    const monitor = this.add.graphics();
    monitor.fillStyle(0x020617, 0.95);
    monitor.fillRoundedRect(-85, 26, 170, 38, 4);
    monitor.lineStyle(1, 0x1E293B, 1);
    monitor.strokeRoundedRect(-85, 26, 170, 38, 4);
    container.add(monitor);

    // ECG Trace canvas
    const ecg = this.add.graphics();
    ecg.setName('ecg');
    container.add(ecg);
    this.ecgGraphics.set(patient.id, ecg);
    this.ecgOffsets.set(patient.id, 0);

    // Text labels
    const titleText = this.add.text(-80, -60, `${patient.bedId.toUpperCase().replace('-', ' ')}: ${patient.name.toUpperCase()}`, {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#F8FAFC'
    }).setName('titleText');
    container.add(titleText);

    const priorityBadge = this.add.text(78, -60, patient.priority, {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '9px',
      fontStyle: 'bold',
      color: this.getPriorityColorHex(patient.priority)
    }).setOrigin(1, 0).setName('priorityBadge');
    container.add(priorityBadge);

    const vitalsText = this.add.text(-80, 48, '', {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '9px',
      color: '#38BDF8'
    }).setName('vitalsText');
    container.add(vitalsText);

    const statusText = this.add.text(0, -18, '', {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#10B981'
    }).setOrigin(0.5).setName('statusText');
    container.add(statusText);

    this.bedContainers.set(patient.id, container);
  }

  private updateAllBeds(): void {
    const state = gameStateManager.getState();
    const activePatientId = state.activePatientId;

    state.patients.forEach((patient) => {
      const container = this.bedContainers.get(patient.id);
      if (!container) return;

      const isSelected = patient.id === activePatientId;
      const bg = container.getByName('bg') as Phaser.GameObjects.Graphics;
      const titleText = container.getByName('titleText') as Phaser.GameObjects.Text;
      const priorityBadge = container.getByName('priorityBadge') as Phaser.GameObjects.Text;
      const vitalsText = container.getByName('vitalsText') as Phaser.GameObjects.Text;
      const statusText = container.getByName('statusText') as Phaser.GameObjects.Text;

      // Redraw selection border
      bg.clear();
      if (isSelected) {
        bg.fillStyle(0x0284C7, 0.15);
        bg.fillRoundedRect(-92, -68, 184, 138, 8);
        bg.lineStyle(2.5, 0x38BDF8, 1);
        bg.strokeRoundedRect(-92, -68, 184, 138, 8);
      } else {
        bg.fillStyle(0x1E293B, 0.3);
        bg.fillRoundedRect(-90, -66, 180, 134, 6);
        bg.lineStyle(1, 0x334155, 0.6);
        bg.strokeRoundedRect(-90, -66, 180, 134, 6);
      }

      // Title & Priority
      titleText.setText(`${patient.bedId.toUpperCase().replace('-', ' ')}: ${patient.name.toUpperCase()}`);
      priorityBadge.setText(patient.priority);
      priorityBadge.setColor(this.getPriorityColorHex(patient.priority));

      // Vitals summary on monitor
      const v = patient.vitals;
      vitalsText.setText(`HR:${v.heartRate} BP:${v.bloodPressureSys}/${v.bloodPressureDia} O2:${v.oxygenSaturation}%`);

      if (patient.isStabilized) {
        statusText.setText('✓ STABILIZED');
        statusText.setColor('#10B981');
      } else if (patient.priority === 'CRITICAL') {
        statusText.setText('⚠ ACUTE STRAIN');
        statusText.setColor('#EF4444');
      } else {
        statusText.setText('');
      }
    });
  }

  update(_time: number, delta: number): void {
    // Draw ECG monitor waveforms
    const state = gameStateManager.getState();

    state.patients.forEach((patient) => {
      const ecg = this.ecgGraphics.get(patient.id);
      if (!ecg) return;

      ecg.clear();

      const color = patient.isStabilized ? 0x10B981 : (patient.priority === 'CRITICAL' ? 0xEF4444 : 0x0284C7);
      ecg.lineStyle(1.5, color, 0.9);

      const startX = -80;
      const baseY = 37;
      const width = 160;

      if (this.isReducedMotion) {
        // Static clean heart trace for reduced motion
        ecg.beginPath();
        ecg.moveTo(startX, baseY);
        ecg.lineTo(startX + 40, baseY);
        ecg.lineTo(startX + 45, baseY - 5);
        ecg.lineTo(startX + 50, baseY + 6);
        ecg.lineTo(startX + 55, baseY - 7);
        ecg.lineTo(startX + 60, baseY);
        ecg.lineTo(startX + width, baseY);
        ecg.strokePath();
      } else {
        // Dynamic waveform scrolling based on heart rate
        let offset = (this.ecgOffsets.get(patient.id) || 0) + (delta * 0.05 * (patient.vitals.heartRate / 60));
        if (offset > 40) offset %= 40;
        this.ecgOffsets.set(patient.id, offset);

        ecg.beginPath();
        ecg.moveTo(startX, baseY);

        for (let x = 0; x < width; x += 4) {
          const waveX = (x + offset) % 40;
          let yOffset = 0;
          if (waveX > 15 && waveX < 20) {
            yOffset = -5; // P wave
          } else if (waveX >= 20 && waveX < 22) {
            yOffset = 3;  // Q dip
          } else if (waveX >= 22 && waveX < 26) {
            yOffset = -8; // R spike
          } else if (waveX >= 26 && waveX < 29) {
            yOffset = 4;  // S dip
          } else if (waveX >= 31 && waveX < 36) {
            yOffset = -3; // T wave
          }
          ecg.lineTo(startX + x, baseY + yOffset);
        }
        ecg.strokePath();
      }
    });
  }

  private getPriorityColorHex(priority: PriorityLevel): string {
    switch (priority) {
      case 'CRITICAL': return '#EF4444';
      case 'URGENT': return '#F97316';
      case 'PRIORITY': return '#EAB308';
      case 'ROUTINE': return '#38BDF8';
    }
  }

  destroy(): void {
    this.unsubscribeEvents.forEach(unsub => unsub());
    this.unsubscribeEvents = [];
  }
}
