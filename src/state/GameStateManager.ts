import { GameState, GameScreen } from './GameState';
import { createInitialPatients } from '../patients/data/patientScenarios';
import { DECISION_ACTIONS } from '../decisions/DecisionEngine';
import { ActionResult } from '../decisions/types';
import { eventBus } from './EventBus';
import { ScoreTracker } from './ScoreTracker';

export class GameStateManager {
  private static instance: GameStateManager;
  private state: GameState;
  private timerInterval: any = null;

  private constructor() {
    this.state = this.createDefaultState();
  }

  public static getInstance(): GameStateManager {
    if (!GameStateManager.instance) {
      GameStateManager.instance = new GameStateManager();
    }
    return GameStateManager.instance;
  }

  private createDefaultState(): GameState {
    const patients = createInitialPatients();
    return {
      screen: 'START',
      shiftDurationSeconds: 600, // 10 minutes default
      shiftTimeRemaining: 600,
      isPaused: false,
      extendedTimeMode: false,
      resources: {
        testSlots: 5,
        maxTestSlots: 5,
        observationBeds: 3,
        maxObservationBeds: 3,
        specialistConsults: 2,
        maxSpecialistConsults: 2
      },
      patients,
      activePatientId: patients[0].id,
      alerts: [
        {
          id: 'alert-initial',
          timestamp: '00:00',
          priority: 'CRITICAL',
          title: 'SHIFT COMMENCED',
          message: '5 patients currently triaged in the Emergency Department. 2 critical cases need immediate attention.',
          isRead: false
        }
      ],
      feedbackLog: [
        {
          id: 'log-initial',
          timestamp: '00:00',
          text: 'Shift commenced. Review patient arrivals and initiate diagnostic assessments.'
        }
      ]
    };
  }

  public getState(): GameState {
    return this.state;
  }

  public setScreen(screen: GameScreen): void {
    this.state.screen = screen;
    if (screen === 'SHIFT') {
      this.startShiftTimer();
    } else {
      this.pauseShiftTimer();
    }
    eventBus.emit('STATE_CHANGED', this.state);
  }

  public togglePause(): void {
    if (this.state.screen === 'SHIFT') {
      this.state.isPaused = !this.state.isPaused;
      if (this.state.isPaused) {
        this.pauseShiftTimer();
      } else {
        this.startShiftTimer();
      }
      eventBus.emit('STATE_CHANGED', this.state);
    }
  }

  public setExtendedTimeMode(enabled: boolean): void {
    this.state.extendedTimeMode = enabled;
    eventBus.emit('STATE_CHANGED', this.state);
  }

  public selectPatient(patientId: string): void {
    const exists = this.state.patients.some(p => p.id === patientId);
    if (exists && this.state.activePatientId !== patientId) {
      this.state.activePatientId = patientId;
      eventBus.emit('PATIENT_SELECTED', this.getActivePatient());
      eventBus.emit('STATE_CHANGED', this.state);
    }
  }

  public getActivePatient() {
    return this.state.patients.find(p => p.id === this.state.activePatientId) || this.state.patients[0];
  }

  public selectNextPatient(): void {
    const currentIndex = this.state.patients.findIndex(p => p.id === this.state.activePatientId);
    const nextIndex = (currentIndex + 1) % this.state.patients.length;
    this.selectPatient(this.state.patients[nextIndex].id);
  }

  public selectPrevPatient(): void {
    const currentIndex = this.state.patients.findIndex(p => p.id === this.state.activePatientId);
    const prevIndex = (currentIndex - 1 + this.state.patients.length) % this.state.patients.length;
    this.selectPatient(this.state.patients[prevIndex].id);
  }

  public executeAction(actionId: string): ActionResult {
    const patient = this.getActivePatient();
    const action = DECISION_ACTIONS[actionId];

    if (!action) {
      const failResult: ActionResult = {
        success: false,
        message: `Action '${actionId}' does not exist.`,
        accessibleMessage: `Selected action is invalid.`,
        hapticPattern: 'ACTION_FAILURE',
        timeDeductedSeconds: 0
      };
      return failResult;
    }

    if (!action.isAvailable(patient, this.state.resources)) {
      const failResult: ActionResult = {
        success: false,
        message: 'Action unavailable: Prerequisites or required resources not met.',
        accessibleMessage: 'Selected action cannot be performed: Prerequisites or hospital resources not available.',
        hapticPattern: 'ACTION_FAILURE',
        timeDeductedSeconds: 0
      };
      return failResult;
    }

    // Deduct resources
    if (action.resourceCost.testSlots) {
      this.state.resources.testSlots -= action.resourceCost.testSlots;
    }
    if (action.resourceCost.observationBeds) {
      this.state.resources.observationBeds -= action.resourceCost.observationBeds;
    }
    if (action.resourceCost.specialistConsults) {
      this.state.resources.specialistConsults -= action.resourceCost.specialistConsults;
    }

    // Deduct time (reduced in extended time mode)
    const effectiveTimeCost = this.state.extendedTimeMode
      ? Math.round(action.timeCostSeconds * 0.5)
      : action.timeCostSeconds;

    this.state.shiftTimeRemaining = Math.max(0, this.state.shiftTimeRemaining - effectiveTimeCost);

    // Execute decision
    const result = action.execute(patient);

    // Log feedback
    const timestamp = this.formatTime(this.state.shiftDurationSeconds - this.state.shiftTimeRemaining);
    this.state.feedbackLog.unshift({
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp,
      text: result.message,
      patientId: patient.id
    });

    eventBus.emit('ACTION_EXECUTED', { actionId, patient, result });
    eventBus.emit('STATE_CHANGED', this.state);

    if (this.state.shiftTimeRemaining <= 0) {
      this.finishShift();
    }

    return result;
  }

  public startShiftTimer(): void {
    this.pauseShiftTimer();
    const tickIntervalMs = this.state.extendedTimeMode ? 2000 : 1000;
    this.timerInterval = setInterval(() => {
      if (!this.state.isPaused && this.state.screen === 'SHIFT') {
        this.state.shiftTimeRemaining -= 1;
        if (this.state.shiftTimeRemaining <= 0) {
          this.state.shiftTimeRemaining = 0;
          this.finishShift();
        }
        eventBus.emit('TICK', this.state.shiftTimeRemaining);
      }
    }, tickIntervalMs);
  }

  public pauseShiftTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  public finishShift(): void {
    this.pauseShiftTimer();
    this.state.score = ScoreTracker.calculate(this.state);
    this.state.screen = 'SUMMARY';
    eventBus.emit('SHIFT_FINISHED', this.state.score);
    eventBus.emit('STATE_CHANGED', this.state);
  }

  public restartShift(): void {
    this.pauseShiftTimer();
    this.state = this.createDefaultState();
    this.setScreen('SHIFT');
  }

  private formatTime(totalSeconds: number): string {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

export const gameStateManager = GameStateManager.getInstance();
