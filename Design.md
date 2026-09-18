# Emergency Room — Design & Aesthetics Specification

This document details the visual direction, UI hierarchy, color palette, typography scale, haptic language, and sound design of **Emergency Room**.

---

## 1. Visual Direction & Art Style
* **Theme:** Contemporary Emergency Department with a clean, calm, yet urgent medical atmosphere.
* **Aesthetic:** Clean 2D illustrated / pixel-art hospital ward.
* **Environment Components:**
  * 5 distinct clinical bays / patient beds with clean white sheets and privacy curtains.
  * Overhead cardiac vitals monitors with dynamic ECG waveforms.
  * Central triage and nurse station with chart boards and digital clock.
  * Resuscitation crash cart and diagnostic imaging corridor.
* **Clarity First:** Visual details enhance immersion without cluttering or distracting from actionable decision data.

---

## 2. Color System & Contrast Compliance
All UI color tokens are calibrated to satisfy **WCAG 2.2 Level AAA** contrast standards (minimum 7:1 ratio for normal text, 4.5:1 for large text).

### Standard Medical Theme
* **Canvas Hospital Floor:** `#1E293B` (Deep Slate Gray)
* **Background UI:** `#0F172A` (Dark Navy)
* **Card / Panel Surface:** `#1E293B` (Slate Surface)
* **Borders:** `#334155` (Subtle Gray Border)
* **Text Primary:** `#F8FAFC` (Off-White, Contrast > 12:1)
* **Text Secondary:** `#CBD5E1` (Soft Slate, Contrast > 7:1)

### Priority Semantic Tokens
Never use color alone. Every token combines text, icon, and distinct background:
* **ROUTINE:**
  * Text: `ROUTINE`
  * Color: `#0284C7` (Sky Blue) / Background: `#082F49`
  * Icon: `[○]`
* **PRIORITY:**
  * Text: `PRIORITY`
  * Color: `#EAB308` (Warm Amber) / Background: `#422006`
  * Icon: `[▲]`
* **URGENT:**
  * Text: `URGENT`
  * Color: `#F97316` (Orange) / Background: `#431407`
  * Icon: `[◆]`
* **CRITICAL:**
  * Text: `CRITICAL`
  * Color: `#EF4444` (Bright Crimson) / Background: `#450A0A`
  * Icon: `[⚡]`

### High Contrast Themes
* **High Contrast Dark:** Pure black background (`#000000`), pure white text (`#FFFFFF`), high-visibility yellow borders (`#FFFF00`), 21:1 contrast ratio.
* **High Contrast Light:** Pure white background (`#FFFFFF`), pure black text (`#000000`), deep navy borders (`#000080`).

---

## 3. Typography Hierarchy
* **Primary Font:** Clean sans-serif system stack (`Inter`, `system-ui`, `-apple-system`, `sans-serif`).
* **Monospace Font for Vitals:** (`JetBrains Mono`, `Courier New`, monospace) for consistent tabular numbers.
* **Scales:**
  * `Header 1` (Shift Title): `24px / 1.5rem`, Bold
  * `Header 2` (Patient Name / Bed): `20px / 1.25rem`, Semi-Bold
  * `Body Text` (Complaints / Descriptions): `16px / 1rem`, Regular (Resizable to 125% and 150%)
  * `Vitals / Metrics`: `18px / 1.125rem`, Bold Monospace
  * `Badges & Meta`: `14px / 0.875rem`, Bold Uppercase

---

## 4. UI Layout & Hierarchy
The main game screen is divided into two harmonized viewports:

```text
+-------------------------------------------------------------------------------+
| [EMERGENCY ROOM]   SHIFT 01   TIME: 08:45   TESTS: 3/5   BEDS: 1/3   [SETTINGS] |
+-------------------------------------------------------------------------------+
|                      |                                                        |
|   2D PHASER CANVAS   |   ACCESSIBLE PATIENT DOSSIER & ACTIONS                 |
|                      |                                                        |
|   [Bed 1: Jordan]    |   Active Patient: Jordan Lee (Bed 01)                  |
|   [Bed 2: Sam]       |   Priority: [⚡ CRITICAL] Immediate attention needed    |
|   [Bed 3: Alex]      |   Complaint: Sudden severe respiratory distress        |
|   [Bed 4: Elena]     |   Vitals: HR 118 | BP 88/56 | SpO2 89% | RR 28         |
|   [Bed 5: Marcus]    |   -------------------------------------------------    |
|                      |   AVAILABLE ACTIONS (Press 1-5 or click):              |
|   [Triage Desk]      |   [1] Check Vital Signs (30s)                          |
|   [Nurse Station]    |   [2] Review Patient History (30s)                     |
|                      |   [3] Order Fictional Chest Ultrasound (Slot: 1, 90s)  |
|                      |   [4] Administer Bronchodilator & Oxygen (60s)         |
|                      |   [5] Request Specialist Consult (Specialist: 1, 60s)  |
|                      |   -------------------------------------------------    |
|                      |   RECENT FEEDBACK LOG:                                 |
|                      |   > Bronchodilator administered. SpO2 rose to 94%.     |
+-------------------------------------------------------------------------------+
| SUBTITLE / CAPTION BAR: [Monitor Pulse: Normal Rhythm - 88 BPM]                |
+-------------------------------------------------------------------------------+
```

---

## 5. Reduced Motion & Visual Safety
* **Zero Seizure Risk:** No elements flash faster than 2 times per second.
* **`prefers-reduced-motion` Enforcement:**
  * ECG waveforms transition from continuous animated waves to static digital readouts.
  * Transitions between screens and modals are instantaneous fades rather than sliding or zooming animations.
  * Screen shake and pulsing warning effects are entirely disabled.

---

## 6. Haptic Language (Gamepad API)
Haptic vibration patterns provide a non-visual, non-auditory dimension of feedback:
* **Patient Arrival:** 1 medium vibration pulse (200ms).
* **Urgent Alert:** 2 rapid pulses (100ms on, 100ms off, 100ms on).
* **Critical Alert:** 3 sharp pulses followed by a deep long pulse (100ms × 3, then 400ms heavy rumble).
* **Action Success:** 2 crisp light pulses (80ms on, 80ms off, 80ms on).
* **Action Failure / Warning:** 1 long low-frequency buzz (400ms).
* **Shift Complete:** Ascending cadence (300ms medium, pause 100ms, 150ms light, 150ms light).

---

## 7. Audio & Closed Caption Design
Audio is purely synthesized via the Web Audio API with zero external media files.
* **Ambient:** Soft 60Hz hospital air filtration drone (low volume).
* **ECG Pulse:** Gentle 880Hz sine beep mapped to active patient heart rate.
* **Alert Tone:** Dual harmonic chime (523Hz + 659Hz).
* **Closed Captions:** Synchronously displayed in the Subtitle Bar at the bottom of the screen with a toggle in the settings menu. Audio is disabled by default or easily muted with 1 click/keypress.
