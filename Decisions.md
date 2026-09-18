# Architecture Decision Records (ADRs)

This document records the key architectural and technological decisions made during the design and development of **Emergency Room**.

---

## ADR-001: Selection of React, TypeScript, Vite, and Phaser 3
* **Status:** Accepted
* **Context:** The application requires a dual presentation model: a responsive, high-performance 2D visual game environment paired with a strict, screen-reader-compliant semantic DOM interface.
* **Decision:**
  * **Vite + React + TypeScript:** Provides rapid modern build tooling, robust type safety across clinical data schemas, and declarative UI component state management.
  * **Phaser 3:** Industry-standard HTML5 2D game framework capable of rendering sprite-based hospital environments, animated monitor waveforms, and visual effects via Canvas/WebGL.
* **Consequences:** Phaser manages the 2D visual canvas while React manages the accessible DOM tree. Both are kept completely in sync via a decoupled headless state manager.

---

## ADR-002: Decoupled Headless Simulation Core
* **Status:** Accepted
* **Context:** If game state logic is bound directly to Phaser scene objects or React component local state, it becomes impossible to test headlessly or ensure 100% functional parity for non-visual players.
* **Decision:** Implement all game logic (shift clock, resource tracking, patient vitals, decision trees, scoring) in a pure TypeScript `GameStateManager` that has zero imports from Phaser or React DOM.
* **Consequences:** The game simulation can be thoroughly tested in Node/Vitest environments. Either presentation layer (Phaser or React) can fail or be disabled without impacting the underlying game loop.

---

## ADR-003: Accessible-First by Design (No Divergent 'Accessible Mode')
* **Status:** Accepted
* **Context:** Many games implement accessibility as an isolated "text mode" or "blind mode" toggle that frequently degrades into an inferior, out-of-sync sub-game.
* **Decision:** Build a single unified game where visual canvas and accessible semantic DOM are rendered concurrently. A sighted player and a blind player interact with the exact same simulation state, rules, and outcomes.
* **Consequences:** Eliminates code duplication, prevents accessibility drift, and ensures equal gameplay rigor across all demographics.

---

## ADR-004: Multi-Modal Feedback and Communication
* **Status:** Accepted
* **Context:** Essential gameplay alerts (such as a deteriorating patient or low shift time) must be perceived by players who may be blind, deaf, or deaf-blind.
* **Decision:** Any state change or alert must synchronously fire three independent signals:
  1. Semantic DOM update + ARIA live region announcement.
  2. Visual banner notification + persistent on-screen text log.
  3. Gamepad API vibration actuator pattern (if supported and enabled).
  * Optional non-essential audio synthesized via Web Audio API with real-time closed captions.
* **Consequences:** No single sensory disability prevents full comprehension of game state changes.

---

## ADR-005: Use of Gamepad API for Haptic Feedback
* **Status:** Accepted
* **Context:** Deaf-blind players and players seeking tactile confirmation benefit from haptic sensations to signify alerts and action resolutions.
* **Decision:** Implement a centralized `HapticService` utilizing `gamepad.vibrationActuator.playEffect('dual-rumble', ...)` with distinct semantic vibration patterns.
* **Consequences:** Haptics work seamlessly on supported browser controllers. Haptics are strictly supplementary and never the sole source of essential information.

---

## ADR-006: LocalStorage for MVP Persistence
* **Status:** Accepted
* **Context:** The game is an educational indie web project that should require no user accounts, cloud servers, or privacy-invasive telemetry.
* **Decision:** Use browser `localStorage` for persisting shift progress, user accessibility settings (contrast, font size, motion, audio, haptics), and custom keybindings.
* **Consequences:** Zero backend overhead, zero privacy risk, instant local save/load.

---

## ADR-007: Completely Fictionalized Clinical Data
* **Status:** Accepted
* **Context:** Simulating healthcare decisions carries potential liability if players mistake game mechanics for real clinical guidance.
* **Decision:** All clinical scenarios, patient histories, drug dosages, and vital sign thresholds are deliberately fictionalized. A mandatory healthcare disclaimer is displayed at launch, in settings, and on the summary screen.
* **Consequences:** Protects users and developers, clearly framing the project as an educational game about prioritization and resource management rather than clinical diagnostic software.
