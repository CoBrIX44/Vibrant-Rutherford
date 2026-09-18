# Emergency Room — Strict Development Rules

These rules are non-negotiable architectural and ethical constraints for all contributors and automated agents working on the **Emergency Room** codebase.

---

## 1. Accessibility is Mandatory and Inherent
Accessibility is not an auxiliary feature, a secondary toggle, or a post-launch refactor. Every game mechanic, screen, panel, and state change must be designed, implemented, and verified accessible before being considered complete.

## 2. Never Rely on Color Alone
Color must never be the sole conveyor of status, priority, or urgency.
* Bad: A red circle indicating a critical patient.
* Good: A bold text badge reading `PRIORITY: CRITICAL (Immediate attention required)` accompanied by an optional distinct icon and red highlight.

## 3. Never Rely on Audio Alone
Audio is strictly an optional cosmetic enhancement. Never communicate critical cues (alarms, vitals deterioration, timer warnings) exclusively through sound. Every sound effect must have a synchronous visual subtitle, alert badge, and persistent text log entry.

## 4. Never Require Speech or Voice Input
No mechanic may require a microphone, spoken speech, or voice recognition. All interactions must be achievable via standard physical keyboard, mouse, or gamepad.

## 5. Never Require Sight
A blind player must be capable of playing through all five cases, making decisions, managing resources, and reviewing the end-of-shift debrief using a screen reader and keyboard alone.

## 6. Every Mouse Interaction Must Have a Keyboard Equivalent
If an element can be clicked, hovered, or dragged, it must be equally selectable, inspectable, and actionable via keyboard focus (`Tab`, `Enter`, `Space`, or direct shortcut keys `1-9`).

## 7. Every Visual State Must Have an Equivalent Text Representation
Visual animations (e.g., patient lying on a bed, ECG monitor waveform, blinking warning light) must be reflected synchronously in the semantic DOM and accessible state descriptors.

## 8. Game Logic Must Be Independent of Rendering
The underlying game state (`GameStateManager`) must run headlessly in pure TypeScript. It must have zero dependencies on Phaser, canvas elements, or browser DOM. Phaser and React are merely view layers subscribing to game state events.

## 9. Accessibility State Must Flow Directly From Real Game State
Never maintain duplicate, manually synchronized accessibility text that can drift out of sync with actual game variables. Text representations and ARIA announcements must be generated directly from the canonical game state.

## 10. Respect User Motion and Sensory Preferences
Avoid rapid flashing, strobe effects, or aggressive screen shake. Respect `prefers-reduced-motion` by replacing kinetic animations with instant, clean state transitions. Never exceed the 3-flashes-per-second seizure threshold.

## 11. Minimal External Dependencies
Do not introduce heavy third-party UI component libraries, backend cloud SDKs, or unnecessary frameworks. Keep dependencies lean, transparent, and audit-friendly.

## 12. Modular, Decoupled Architecture
Maintain strict boundaries between:
* Game State
* Canvas Rendering (Phaser)
* Accessibility & DOM (React)
* Input Handling (Keyboard/Gamepad)
* Audio
* Haptics

## 13. Never Collect or Store Real Medical Data
All patient scenarios, names, medical histories, vitals, and conditions must remain completely fictional. No real patient data, HIPAA-regulated information, or personal identifiers may ever be stored or processed.

## 14. Prominent Healthcare Disclaimer
Always display the educational disclaimer:
> *"Emergency Room is an educational game using fictional scenarios. It is not a medical diagnostic or treatment tool."*
Do not present any gameplay decision as authoritative medical practice.

## 15. Continuous Accessibility Testing
Every pull request or major feature commit must be tested against:
1. Keyboard-only navigation.
2. Screen-reader DOM inspection.
3. Audio-disabled gameplay.
4. Reduced-motion compliance.
