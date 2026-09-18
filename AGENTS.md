# Instructions for AI Coding Agents

> **Critical Notice for AI Agents:**
> Before proposing or modifying any code in this repository, you **MUST** read and adhere to the guidelines set forth in this file, [`Rules.md`](./Rules.md), [`Architecture.md`](./Architecture.md), and [`PRD.md`](./PRD.md).

---

## 1. Project Purpose & Philosophy
**Emergency Room** is an educational fictional healthcare decision game engineered with an **accessibility-first architecture**.
The core tenet is:
> **One game. One shared game state. Multiple ways to experience and control it.**

You must never create a separate "Blind Mode" or "Accessible Mode" that forks the game logic. Every player interacts with the exact same underlying simulation state.

---

## 2. Core Architecture Rules
1. **Strict Headless Core:** All game state resides in `src/state/GameStateManager.ts`. Game logic must have zero dependencies on Phaser or the DOM.
2. **Dual Presentation Synchronization:**
   * Visual presentation is rendered by Phaser 3 in `src/game/`.
   * Accessible interaction presentation is rendered by semantic React components in `src/components/`.
   * Both layers communicate with the core engine solely via `src/state/EventBus.ts` and `GameStateManager`.
3. **Centralized Input:** Never attach direct `keydown` listeners inside individual UI components. All inputs must route through `src/input/InputManager.ts`.
4. **Haptic & Audio Non-Essentiality:** Cues in `src/accessibility/HapticService.ts` and `src/audio/AudioService.ts` must always be accompanied by live region text announcements and visual notifications.

---

## 3. How to Add a New Patient Scenario
To add a new patient:
1. Open `src/patients/data/patientScenarios.ts`.
2. Follow the `Patient` interface defined in `src/patients/types.ts`.
3. Ensure the scenario includes:
   * Unique `id` and bed assignment.
   * Fictional name, age, and chief complaint.
   * Baseline vital signs (HR, BP, SpO2, RR, Temp).
   * Explicit `priority`: `'ROUTINE' | 'PRIORITY' | 'URGENT' | 'CRITICAL'`.
   * Initial accessible description.
   * Branching decision options with clear prerequisites, costs, and feedback notes.
4. Verify that the case contains both constructive stabilization pathways and informative recovery from suboptimal choices without instant unfair failure.

---

## 4. How to Add a New Decision / Action
1. Open `src/decisions/types.ts` and `src/decisions/DecisionEngine.ts`.
2. Define the action metadata:
   * `id`: Action identifier.
   * `label`: Accessible action title.
   * `description`: Detailed text explanation of what the action entails.
   * `timeCostSeconds`: Time deducted from the shift clock.
   * `resourceCost`: Object specifying required test slots, beds, or specialist credits.
   * `prerequisites`: Function evaluating whether the action is currently allowable.
   * `execute`: Function mutating patient state, emitting feedback, and advancing clinical narrative.
3. Ensure every action produces a descriptive `feedback` object containing text for screen readers, visual logs, and subtitles.

---

## 5. How to Add Haptic Feedback
1. Use `HapticService` located in `src/accessibility/HapticService.ts`.
2. Call one of the semantic pattern methods:
   * `hapticService.trigger('PATIENT_ARRIVAL')`
   * `hapticService.trigger('URGENT_ALERT')`
   * `hapticService.trigger('CRITICAL_ALERT')`
   * `hapticService.trigger('ACTION_SUCCESS')`
   * `hapticService.trigger('ACTION_FAILURE')`
   * `hapticService.trigger('SHIFT_COMPLETE')`
3. Always verify that a corresponding text notification is dispatched to `AnnouncerService`.

---

## 6. What Agents Must NEVER Do
* ❌ **NEVER** introduce audio-only or visual-only gameplay information.
* ❌ **NEVER** use color as the single differentiator for status or priority.
* ❌ **NEVER** place game state or business logic inside Phaser scene classes or React component local state.
* ❌ **NEVER** bypass `InputManager` to add un-remappable hardcoded keyboard listeners.
* ❌ **NEVER** use real-world clinical patient data or present the game as a clinical medical tool.
* ❌ **NEVER** break `prefers-reduced-motion` or introduce flashing effects that violate WCAG 2.2.
* ❌ **NEVER** declare a feature complete without running tests and verifying keyboard/screen reader navigability.

---

## 7. Verification & Documentation Requirements
After making any functional changes:
1. Run automated tests: `npm test`.
2. Verify production build: `npm run build`.
3. Update `Memory.md` with changes made, known issues, and testing results.
4. If an architectural decision was altered, append an ADR to `Decisions.md`.
