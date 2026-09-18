# EMERGENCY ROOM

> **Important Educational Healthcare Disclaimer:**
> **Emergency Room is an educational fictional game. It is not a medical diagnostic or treatment tool.**
> All patient cases, vital signs, medications, diagnostic tests, hospital names, and clinical outcomes are fictionalized for game design purposes. The simulation must not be used as real-world medical advice or clinical guidance.

---

## Overview
**Emergency Room** is a polished, 2D browser-based educational healthcare decision and management game. Players step into the shoes of an emergency department clinician managing a busy hospital shift. As patients arrive at different beds with varying degrees of physiological urgency, players must observe symptoms, inspect vital signs, gather history, order diagnostic tests, administer treatments, manage limited hospital resources, and stabilize patients under shifting time pressures.

The game is built with an **accessibility-first architecture**:
* Fully playable by **blind players** using standard screen readers.
* Fully playable by **deaf players** with zero critical audio cues.
* Fully playable by **non-speaking players** with zero voice inputs.
* Fully playable by **deaf-blind players** via structured semantic text, keyboard/gamepad navigation, and Gamepad API haptic rumble patterns.
* Fully playable by **players with motor impairments** via single-key shortcuts, remappable inputs, and extended-time modes.
* Fully enjoyable by **players without disabilities** with a rich 2D canvas visualization and responsive interface.

**One game. One shared game state. Multiple ways to experience and control it.**

---

## Key Features
* **Decoupled Dual-Representation Engine:** A headless TypeScript game-state core drives both an interactive 2D Phaser canvas hospital scene and a fully accessible, semantic HTML/ARIA DOM layer simultaneously.
* **5 Rich Clinical Scenarios:** Real-world inspired, completely fictional medical puzzles featuring multi-stage branching, hidden pathologies, and dynamic vital sign progressions.
* **Tactical Resource & Time Management:** Balance diagnostic test slots, observation beds, specialist consults, and shift clocks.
* **Transparent Scoring & Constructive Feedback:** Detailed end-of-shift reports highlighting diagnostic accuracy, prioritization choices, and resource stewardship.
* **Customizable Accessibility Suite:** High-contrast color modes (Standard, High Contrast Dark, High Contrast Light), font scaling (100% to 150%), reduced motion compliance, toggleable non-essential synthesized audio with closed captions, and Gamepad API vibration haptics.
* **100% Local Play:** No accounts, no telemetry, no tracking, and zero backend dependencies.

---

## Controls

### Keyboard (Default)
| Action | Primary Key | Secondary Key |
|---|---|---|
| Navigate UI / Beds | `Arrow Keys` | `W`, `A`, `S`, `D` |
| Select / Interact | `Enter` | `E` |
| Action Selection | `1` through `9` | Number row |
| Patient Dossier / Info | `I` | — |
| Objectives & Status | `O` | — |
| Tab Navigation | `Tab` / `Shift+Tab` | Standard DOM focus |
| Pause / Menu | `Escape` | `P` |

*All keyboard controls can be freely remapped in the Accessibility Settings menu.*

### Gamepad Controller
* **D-Pad / Left Stick:** Navigate beds and menu items.
* **A Button (Cross):** Confirm / Select action.
* **B Button (Circle):** Back / Close dialog.
* **Shoulder Buttons (LB / RB):** Cycle active patient beds.
* **Start / Options:** Pause game.

### Mouse
* Click any bed, action button, or tab to inspect and interact.

---

## Tech Stack
* **Framework:** React 19 + TypeScript
* **Game Engine:** Phaser 3 (2D Canvas Renderer)
* **Build System:** Vite
* **Styling:** Tailwind CSS + Custom High-Contrast Tokens
* **APIs:** Gamepad API (vibrationActuator), Web Audio API (Synthesized sound effects)
* **Persistence:** Browser `localStorage`
* **Testing:** Vitest + React Testing Library

---

## Project Structure
```text
src/
├── accessibility/       # Screen reader announcer, ARIA live regions, HapticService
├── audio/               # Web Audio API synthesizer & caption dispatchers
├── components/          # React UI: HUD, PatientDossier, ActionPanel, Modals
├── decisions/           # Decision engine, clinical action types, prerequisite evaluators
├── game/                # Phaser 3 engine, ER hospital scene, beds, monitor animations
├── input/               # Centralized input manager (Keyboard, Mouse, Gamepad API)
├── patients/            # Patient schema, 5 clinical scenarios, vital sign models
├── state/               # Headless GameStateManager, pub/sub EventBus, score tracker
├── systems/             # Time & Resource management systems
├── utils/               # LocalStorage persistence & formatters
└── styles/              # Accessible CSS themes, high-contrast tokens, reduced-motion
```

---

## Quick Start & Installation

### Prerequisites
* Node.js v18+ (Tested on v24.14.0)
* npm v9+

### Setup
```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```
Visit `http://localhost:5173` in your modern web browser.

### Build & Test
```bash
# Run automated test suite
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Accessibility Verification Matrix
This project has been architected to satisfy WCAG 2.2 Level AAA standards and strict multi-modal validation:
1. **Keyboard Navigation:** 100% of game functions are reachable and executable without a pointer.
2. **Screen Reader Compatibility:** Tested with semantic headings, `aria-live="polite"` announcements for results, and `aria-live="assertive"` for emergency alerts.
3. **Audio-Independent:** Tested with master volume muted; all cues are backed by visual subtitles and persistent text logs.
4. **Deaf-Blind Pathway:** Verified using text logs, keyboard navigation, and Gamepad API haptic rumble patterns.
5. **Reduced Motion:** Adheres to `prefers-reduced-motion` media queries; turns off camera shakes and flattens monitor waveforms to static indicators.

---

## License
Distributed under the MIT License. See [`LICENSE`](./LICENSE) for details.
