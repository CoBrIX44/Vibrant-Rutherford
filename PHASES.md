# Emergency Room — Project Roadmap & Phases

This document outlines the phased development roadmap for **Emergency Room**. Every phase defines its objective, specific tasks, deliverables, acceptance criteria, and dependencies.

---

## Phase 0: Project Documentation & Governance
* **Objective:** Establish comprehensive project specification, architectural contracts, safety guidelines, and developer instructions before writing application code.
* **Tasks:**
  1. Author `PHASES.md`, `PRD.md`, `README.md`, `Rules.md`, `AGENTS.md`, `Architecture.md`, `Decisions.md`, `Design.md`, `INSTRUCTIONS.md`, `LICENSE`, `Memory.md`.
  2. Embed the medical disclaimer, accessibility-first tenets, and architectural invariants.
* **Deliverables:** Complete 11-file documentation suite in repository root.
* **Acceptance Criteria:** All files created once, formatted cleanly, with zero conflicting directives.
* **Dependencies:** None.

---

## Phase 1: Project Scaffolding & Build Pipeline
* **Objective:** Initialize a modern, performant, TypeScript-first web stack with React, Vite, Tailwind CSS, Phaser 3, and Vitest.
* **Tasks:**
  1. Initialize Vite project with React and TypeScript.
  2. Configure Tailwind CSS with accessible color tokens, high-contrast classes, and reduced-motion variants.
  3. Install and configure `phaser` for 2D canvas rendering.
  4. Configure `vitest` and `@testing-library/react` for automated unit/integration testing.
* **Deliverables:** `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, functional dev server.
* **Acceptance Criteria:** `npm run build` and `npm test` execute cleanly.
* **Dependencies:** Phase 0.

---

## Phase 2: Core Game-State Architecture
* **Objective:** Build a headless, pure TypeScript game engine completely decoupled from rendering frameworks.
* **Tasks:**
  1. Implement `GameStateManager` managing shift clock, resource counts, active patient, decision history, and score.
  2. Implement an event pub/sub bus (`EventBus`) enabling decoupled subscribers (Phaser, React DOM, Audio, Haptics).
  3. Implement deterministic state mutations and serialization for save states.
* **Deliverables:** `src/state/GameState.ts`, `src/state/GameStateManager.ts`, `src/state/EventBus.ts`.
* **Acceptance Criteria:** Game logic runs headlessly in Vitest without DOM or Canvas errors.
* **Dependencies:** Phase 1.

---

## Phase 3: Accessibility Architecture & Semantic Representation
* **Objective:** Build the parallel accessible interaction layer providing 100% semantic DOM parity with visual game elements.
* **Tasks:**
  1. Create ARIA live region management (`AnnouncerService`) with polite and assertive channels.
  2. Construct semantic markup hierarchy with standard HTML landmarks (`main`, `section`, `nav`, `fieldset`).
  3. Implement high-contrast themes (Normal, High Contrast Dark, High Contrast Light) and font scaling (100%, 125%, 150%).
  4. Ensure full compliance with `prefers-reduced-motion`.
* **Deliverables:** `src/accessibility/Announcer.ts`, `src/accessibility/types.ts`, high-contrast CSS utilities.
* **Acceptance Criteria:** Screen readers navigate all game components; state changes trigger polite/assertive announcements.
* **Dependencies:** Phase 2.

---

## Phase 4: Input System & Gamepad API Integration
* **Objective:** Implement a centralized, remappable input system supporting Keyboard, Mouse, and Gamepad controllers.
* **Tasks:**
  1. Implement `InputManager` mapping hardware inputs to semantic `GameAction` events.
  2. Implement single-key shortcuts: `1-9` (actions), `WASD/Arrows` (navigation), `Enter/E` (interact), `Esc` (pause), `I` (patient info), `O` (objectives).
  3. Implement Gamepad API polling loop with D-Pad navigation and button mapping.
  4. Support persistent key remapping stored in `localStorage`.
* **Deliverables:** `src/input/InputManager.ts`, `src/input/KeyBindings.ts`, `src/input/GamepadManager.ts`.
* **Acceptance Criteria:** The entire UI and game actions can be operated with Keyboard alone and Gamepad alone.
* **Dependencies:** Phase 2.

---

## Phase 5: 2D Emergency Room Environment (Phaser 3)
* **Objective:** Create the visual 2D hospital canvas showing beds, medical equipment, triage desk, animated vitals waveforms, and staff.
* **Tasks:**
  1. Build `ERScene` rendering the hospital department layout with 5 patient beds.
  2. Implement animated ECG monitor screens that reflect real-time patient heart rates (flattened in reduced motion mode).
  3. Add visual priority badges and bed status indicators that update from `GameStateManager` events.
  4. Support interactive bed selection via canvas click and sync with DOM focus.
* **Deliverables:** `src/game/EmergencyRoomGame.ts`, `src/game/scenes/ERScene.ts`, `src/game/entities/Bed.ts`.
* **Acceptance Criteria:** Visual scene updates instantly upon game state changes without causing re-renders or performance drops.
* **Dependencies:** Phase 2, Phase 4.

---

## Phase 6: Patient System
* **Objective:** Define the complete patient data structures, physiological states, and progressive disclosure mechanics.
* **Tasks:**
  1. Define TypeScript interfaces for `Patient`, `VitalSigns`, `Priority`, and `PatientState`.
  2. Implement physiological parameter calculations and priority determination rules.
  3. Build patient progression and stabilization evaluators.
* **Deliverables:** `src/patients/types.ts`, `src/patients/PatientManager.ts`.
* **Acceptance Criteria:** Patient data serializes cleanly; vitals update accurately according to clinical triggers.
* **Dependencies:** Phase 2.

---

## Phase 7: Decision Engine & Action Architecture
* **Objective:** Construct the decision engine that executes clinical actions, evaluates prerequisites, consumes resources, and computes feedback.
* **Tasks:**
  1. Define `Decision` structure with prerequisites, time costs, resource costs, consequences, and accessibility descriptions.
  2. Implement actions: Check Vitals, Review History, Physical Exam, Diagnostic Tests, Treatments, Reassessment, Specialist Escalation.
  3. Generate clear narrative feedback explaining the rationale and result of every choice.
* **Deliverables:** `src/decisions/types.ts`, `src/decisions/DecisionEngine.ts`.
* **Acceptance Criteria:** Invalid actions are disabled with clear explanatory text; valid actions trigger state mutations and logs.
* **Dependencies:** Phase 6.

---

## Phase 8: Time and Resource Management Systems
* **Objective:** Implement the shift countdown clock, patient waiting timers, and scarce departmental resource pools.
* **Tasks:**
  1. Implement shift timer (10:00 default) with pause, resume, and decision time cost deductions.
  2. Implement Extended Time Mode (relaxed timers) and Untimed Mode for accessibility.
  3. Implement resource inventory (5 Test Slots, 3 Observation Beds, 2 Specialist Consults).
* **Deliverables:** `src/systems/TimeResourceSystem.ts`.
* **Acceptance Criteria:** Timer depletion triggers shift end; resource exhaustion appropriately gates corresponding diagnostic actions.
* **Dependencies:** Phase 2, Phase 7.

---

## Phase 9: Five Fictional Patient Scenarios
* **Objective:** Author five clinical puzzle scenarios with branching choices, hidden pathophysiology, and constructive feedback.
* **Tasks:**
  1. **Case 1: Jordan Lee (47)** — Acute respiratory distress (Asthma vs Pneumothorax branching).
  2. **Case 2: Sam Patel (32)** — Severe food anaphylaxis requiring urgent epinephrine and fluid resuscitation.
  3. **Case 3: Alex Morgan (58)** — Atypical acute coronary syndrome requiring ECG triage and specialist intervention.
  4. **Case 4: Elena Rostova (24)** — Dehydration and vasovagal collapse needing rehydration and observation.
  5. **Case 5: Marcus Chen (65)** — Hyperglycemic crisis with altered mental status needing lab testing and insulin titration.
* **Deliverables:** `src/patients/data/patientScenarios.ts`.
* **Acceptance Criteria:** Each patient has a complete decision tree, positive and suboptimal pathways, and fair stabilization criteria.
* **Dependencies:** Phase 7, Phase 8.

---

## Phase 10: Haptic Feedback System
* **Objective:** Implement tactile feedback via the Gamepad API VibrationActuator with distinct pulse signatures.
* **Tasks:**
  1. Implement `HapticService` supporting pattern playback:
     * Patient Arrival: 1 medium pulse
     * Urgent Alert: 2 short pulses
     * Critical Alert: 3 short pulses + pause + long pulse
     * Action Success: 2 short pulses
     * Action Failure: 1 long pulse
     * Shift Complete: Long → Short → Short
  2. Ensure haptics can be toggled on/off in settings and never serve as the sole conveyor of information.
* **Deliverables:** `src/accessibility/HapticService.ts`.
* **Acceptance Criteria:** Haptics trigger reliably on supported gamepads without crashing when unsupported.
* **Dependencies:** Phase 4.

---

## Phase 11: Save System & Local Persistence
* **Objective:** Implement reliable local persistence for game settings, shift progress, and unlocked statistics.
* **Tasks:**
  1. Implement `SaveManager` targeting `localStorage` with schema versioning and validation.
  2. Save active shift state, accessibility preferences, custom keybindings, and historical shift scores.
  3. Provide explicit "Reset Shift" and "Clear All Data" options.
* **Deliverables:** `src/utils/SaveManager.ts`.
* **Acceptance Criteria:** Browser refresh restores exact shift state and user preferences without data loss.
* **Dependencies:** Phase 2, Phase 10.

---

## Phase 12: User Interface, HUD, Tutorial & Settings
* **Objective:** Construct the complete responsive UI layout integrating the 2D canvas, semantic dossier, HUD, tutorial, and settings modals.
* **Tasks:**
  1. Build Top Bar: Shift time, resource counters, pause button, settings trigger.
  2. Build Patient Selector Bar: Bed cards with name, priority, and status badge.
  3. Build Patient Dossier: Comprehensive accessible view with vitals, complaint, history, and action list.
  4. Build Live Feedback Log: Persistent record of action results and announcements.
  5. Build Interactive 8-Step Tutorial explaining navigation, vitals, decisions, and resources.
  6. Build Settings Modal with live controls for contrast, font size, motion, audio, haptics, and remapping.
* **Deliverables:** `src/components/HUD.tsx`, `src/components/PatientDossier.tsx`, `src/components/ActionPanel.tsx`, `src/components/TutorialModal.tsx`, `src/components/SettingsModal.tsx`, `src/components/ShiftSummary.tsx`.
* **Acceptance Criteria:** All UI components pass WCAG AAA color contrast, support keyboard navigation, and reflect game state in real time.
* **Dependencies:** Phase 3, Phase 5, Phase 9.

---

## Phase 13: End-of-Shift Summary & Transparent Scoring
* **Objective:** Present a constructive, transparent evaluation of clinical triage and resource management at the end of the shift.
* **Tasks:**
  1. Calculate metrics: Patients stabilized, critical cases addressed, resources preserved, time remaining.
  2. Generate tailored constructive feedback highlighting strengths and diagnostic improvement opportunities.
  3. Provide accessible text breakdown and restart shift action.
* **Deliverables:** `src/components/ShiftSummary.tsx`, `src/state/ScoreTracker.ts`.
* **Acceptance Criteria:** Summary screen is fully readable via screen reader and keyboard navigable.
* **Dependencies:** Phase 12.

---

## Phase 14: Multi-Modal Testing & Accessibility Verification
* **Objective:** Rigorously verify that the game meets every accessibility acceptance standard.
* **Tasks:**
  1. **Keyboard-Only Test:** Complete full 5-patient shift without touching the mouse.
  2. **Screen-Reader Test:** Verify DOM reading order, live region triggers, and button names.
  3. **Audio-Off Test:** Play entire game with audio muted to confirm zero information loss.
  4. **Deaf-Blind Test:** Verify that structured text + keyboard + persistent notifications allow full completion.
  5. **Reduced Motion Test:** Verify zero flashing or jarring camera movements.
  6. Automated test suite execution in Vitest.
* **Deliverables:** Comprehensive test suite in `src/__tests__/`.
* **Acceptance Criteria:** All tests pass with 0 regressions.
* **Dependencies:** Phase 13.

---

## Phase 15: Visual Polish & Production Build
* **Objective:** Finalize visual styling, optimize assets, verify bundle performance, and prepare for production deployment.
* **Tasks:**
  1. Polish hospital tilework, monitor styling, patient bed sprites, and badge iconography.
  2. Run production build (`npm run build`) and verify zero bundle errors.
  3. Update `Memory.md` and project documentation.
* **Deliverables:** Optimized production build in `dist/`.
* **Acceptance Criteria:** Production build succeeds; game runs smoothly in all major modern browsers.
* **Dependencies:** Phase 14.
