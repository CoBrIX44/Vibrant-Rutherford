# Developer & Testing Instructions

This document provides setup, development, build, and verification instructions for **Emergency Room**.

---

## 1. System Requirements
* **Operating System:** Windows, macOS, or Linux.
* **Node.js:** v18.0.0 or later (v20+ recommended; verified on v24.14.0).
* **Package Manager:** npm (v9+).
* **Modern Web Browser:** Chrome, Edge, Firefox, or Safari with Web Audio and Gamepad API support.

---

## 2. Installation & Setup

```bash
# Clone or navigate to the repository directory
cd vibrant-rutherford

# Install dependencies
npm install
```

---

## 3. Running Development Server

```bash
# Start Vite development server
npm run dev
```
* The development server will launch at `http://localhost:5173`.
* Open this URL in your web browser.

---

## 4. Production Build

```bash
# Compile TypeScript and bundle assets
npm run build

# Preview production build locally
npm run preview
```
* Artifacts are generated in the `dist/` directory.

---

## 5. Running Automated Tests

```bash
# Run all unit and integration tests via Vitest
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

---

## 6. Comprehensive Accessibility Testing Guide

Before shipping any feature, execute these six mandatory verification routines:

### 6.1. Keyboard-Only Navigation Test
1. Disconnect or do not touch the mouse.
2. Launch the game in your browser.
3. Use `Tab` and `Shift+Tab` to navigate all interactive elements.
4. Verify that focus rings are clearly visible on every focused button and input.
5. Use `WASD` or `Arrow Keys` to switch between patient beds.
6. Use number keys `1-9` to execute available actions.
7. Use `Esc` to open and close the Pause / Settings modal.
8. Complete all five patient cases and reach the Shift Summary using keyboard alone.

### 6.2. Screen-Reader Compatibility Test
1. Enable your screen reader (NVDA or Narrator on Windows, VoiceOver on macOS).
2. Navigate the game from the Start screen.
3. Verify that:
   * Landmarks (`<header>`, `<main>`, `<section>`, `<nav>`) are clearly announced.
   * Patient vitals are read as a coherent tabular structure or list.
   * Selecting an action triggers a polite live region announcement reading the result.
   * Changing a patient's status to `CRITICAL` triggers an assertive announcement.

### 6.3. Audio-Disabled Verification
1. Mute your computer's audio or toggle "Audio: OFF" in the in-game Settings menu.
2. Play through all critical events.
3. Verify that zero vital cues are lost: all alert sounds have visual badge equivalents, subtitle bar captions, and persistent text log entries.

### 6.4. Deaf-Blind Interaction Pathway Test
1. Close your eyes or turn off display output.
2. Mute audio completely.
3. Navigate using keyboard shortcuts (`WASD`, `Enter`, `1-5`) and connected gamepad.
4. Verify that tactile haptic vibrations fire for critical alerts and action successes.
5. Inspect the generated DOM log with a braille display or screen reader to verify complete textual transparency.

### 6.5. Reduced-Motion Test
1. In the in-game Settings menu, toggle "Reduced Motion: ON" (or set your OS preference to reduce motion).
2. Verify that:
   * Phaser ECG monitor waveforms become clean static readings.
   * Screen shakes, blinking alerts, and sliding dialog animations are replaced with instant transitions.

### 6.6. High-Contrast Test
1. In the in-game Settings menu, select "High Contrast: Dark" and "High Contrast: Light".
2. Verify that all text achieves at least a 7:1 contrast ratio against its background.
