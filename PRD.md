# Emergency Room — Product Requirements Document (PRD)

> **Important Healthcare Disclaimer:**
> "Emergency Room is an educational game using fictional scenarios. It is not a medical diagnostic or treatment tool."
> All patients, medical cases, vitals, drugs, tests, and outcomes are completely fictional. The game does not provide real-world medical advice or clinical guidelines.

---

## 1. Product Overview
**Emergency Room** is a polished, 2D browser-based educational healthcare decision and management game. The player assumes the role of an emergency room clinician during a demanding hospital shift. Five fictional patients arrive with distinct clinical presentations, varying degrees of urgency, and evolving physiological states. The player must observe symptoms, inspect vital signs, gather history, order appropriate tests, perform interventions, manage scarce departmental resources, and stabilize patients before the shift clock expires.

Crucially, **Emergency Room is accessible by design from day one**. Accessibility is not an add-on mode or an alternative degraded experience; the core game engine synchronizes a rich 2D canvas visualization with a fully semantic, navigable HTML/ARIA interface and haptic feedback layer.

---

## 2. Problem Statement
Most management and medical simulation games rely intensely on fast visual reflexes, mouse-driven drag-and-drop mechanics, auditory alarm cues, and complex graphical charts that completely exclude players with visual, auditory, speech, or motor disabilities. Conversely, educational text-based games frequently degrade into multiple-choice quizzes that lack emotional urgency, dynamic state progression, and tactical resource management.

**Emergency Room solves this** by offering:
1. A dynamic, non-linear clinical puzzle loop where actions have real, cascading physiological consequences.
2. Complete functional parity across visual, auditory, tactile, and screen-reader interaction modalities.

---

## 3. Target Audience
* **Players with Disabilities:**
  * **Blind players:** Full navigation via screen readers (NVDA, JAWS, VoiceOver), semantic landmarks, live region announcements, and logical keyboard focus.
  * **Deaf players:** 100% playable with audio muted; all auditory signals have visual subtitles, badges, and persistent text logs.
  * **Non-speaking players:** Zero voice/speech inputs required.
  * **Deaf-blind players:** Full text-based navigation, persistent status records, keyboard/controller operation, and distinct Gamepad API vibration patterns.
  * **Players with Motor Impairments:** Fully remappable keys, single-key action shortcuts, full gamepad support, zero rapid-twitch requirements, and optional extended-time / reduced-pressure mode.
* **General Gamers & Indie Fans:** Engaging 2D hospital aesthetics, thoughtful resource triage, and satisfying emergent decision puzzles.
* **Healthcare & Bioethics Students:** Safe, fictionalized sandbox demonstrating triage trade-offs, resource constraints, and the diagnostic cycle (*Observe → Decide → Act → Reassess*).

---

## 4. Educational Goals
1. Teach systematic decision-making: **Observe → Decide → Act → Reassess**.
2. Demonstrate clinical prioritization based on physiological acuity rather than arrival order.
3. Cultivate awareness of hospital resource allocation (balancing test slots, observation beds, and specialist consults).
4. Emphasize open communication, patient history review, and avoiding premature closure in diagnostic reasoning.

---

## 5. Core Gameplay Loop
```text
PATIENT ARRIVES
      ↓
REVIEW INFORMATION (Name, Age, Chief Complaint, Waiting Time)
      ↓
ASSESS PRIORITY (ROUTINE / PRIORITY / URGENT / CRITICAL)
      ↓
INVESTIGATE (History, Physical Exam, Diagnostic Tests)
      ↓
MAKE DECISION (Intervention, Medication, Escalation, Placement)
      ↓
PATIENT STATE CHANGES & TIME ADVANCES
      ↓
NEW INFORMATION & PHYSIOLOGICAL RESPONSE UNLOCKED
      ↓
MAKE NEXT DECISION
      ↓
STABILIZE PATIENT
      ↓
NEXT PATIENT / SHIFT COMPLETION
```

---

## 6. Patient System Schema
Every patient is instantiated from a strict fictional schema:
* `id`: Unique identifier (e.g., `patient-01`)
* `name`: Fictional patient name (e.g., `Jordan Lee`)
* `age`: Fictional patient age (e.g., `47`)
* `bedId`: Assigned bed identifier (`bed-1` through `bed-5`)
* `chiefComplaint`: Primary presenting issue (e.g., *"Difficulty breathing and chest tightness"*)
* `symptoms`: Observable/reported symptoms list
* `history`: Medical history (unlocked progressively via actions)
* `vitals`:
  * `heartRate`: Beats per minute (BPM)
  * `bloodPressure`: Systolic / Diastolic (mmHg)
  * `oxygenSaturation`: Percentage (SpO2)
  * `respiratoryRate`: Breaths per minute
  * `temperature`: Degrees Fahrenheit/Celsius
* `priority`: `'ROUTINE' | 'PRIORITY' | 'URGENT' | 'CRITICAL'`
* `currentState`: Clinical status summary (e.g., *"Needs assessment"*, *"Stabilizing"*, *"Critical deterioration"*)
* `availableActions`: Dynamic list of permissible action IDs
* `hiddenState`: Underlying fictional pathology, response triggers, and branch flags
* `decisionHistory`: Chronological log of player actions and outcomes
* `isStabilized`: Boolean flag
* `outcome`: Final discharge/transfer result and debrief notes

---

## 7. Decision System Architecture
Actions are not simple trivia questions; each action represents a realistic clinical management step:
* **Check Vitals:** Updates physiological parameters and advances waiting timer.
* **Review History:** Unlocks background details, allergies, and prior hospitalizations.
* **Physical Exam:** Focused examination (e.g., lung auscultation, abdominal palpation).
* **Order Diagnostic Test:** Consumes a diagnostic slot and shift time (e.g., Fictional Point-of-Care Ultrasound, ECG, Blood Panel, Chest X-Ray).
* **Administer Treatment / Intervention:** Applies therapeutic relief (e.g., Nebulized bronchodilator, Epinephrine auto-injector, IV saline bolus, Oxygen therapy).
* **Monitor / Reassess:** Advances shift clock by 2-5 minutes, re-evaluating patient trajectory.
* **Escalate / Specialist Consult:** Involves cardiology, respiratory therapy, or surgery (consumes limited specialist credits).
* **Observation / Bed Transfer:** Moves stabilized patient to observation or intensive bed.

---

## 8. Resource System
Players must balance three scarce hospital commodities:
1. **Diagnostic Test Slots:** (e.g., 5 total available for the shift)
2. **Observation Beds:** (e.g., 3 total beds available)
3. **Specialist Consults:** (e.g., 2 specialist calls available)

Depleting resources forces tactical trade-offs (e.g., deciding whether to confirm a diagnosis with imaging or initiate empirical treatment based on exam findings).

---

## 9. Time System
* **Shift Clock:** 10:00 countdown timer during the shift.
* **Pacing:** Decisions incur realistic time penalties (e.g., Review history: 30s; Order test: 90s; Monitor: 60s).
* **Pause & Extended Time Mode:** The player can pause at any time without penalty. In **Extended Time Mode / Reduced Pressure Mode**, timers can be slowed by 50% or toggled into untimed step-by-step mode for motor accessibility.

---

## 10. Accessibility Requirements Matrix

| Requirement | Implementation Detail |
|---|---|
| **Blind Players** | Semantic DOM, ARIA live regions (`polite` and `assertive`), comprehensive text descriptions of 2D canvas elements, screen reader announcements for all state changes. |
| **Deaf Players** | 100% playable with audio muted; visual banner notifications, subtitle bar, persistent alert log. |
| **Non-Speaking Players** | Zero speech or voice input required; fully playable with keyboard, mouse, or gamepad. |
| **Deaf-Blind Players** | Structured hierarchical text, keyboard/gamepad navigation, Gamepad API haptic rumble patterns, persistent notification log, zero timing walls in relaxed mode. |
| **Motor Impaired** | Fully remappable keys, single-key action shortcuts (1-9), gamepad analog/d-pad navigation, relaxed timer mode, sticky focus styling. |
| **Low Vision / Sensitivity** | High Contrast themes (Standard, High-Contrast Dark, High-Contrast Light), font scaling (100% to 150%), strict WCAG 2.2 AAA contrast compliance, `prefers-reduced-motion` support. |

---

## 11. MVP Scope vs. Future Scope

### MVP Scope (Delivered Now)
* Start screen with medical disclaimer and accessibility setup.
* 8-step interactive accessible tutorial.
* 1 Emergency Department environment with 5 patient beds, monitors, triage desk, and staff.
* 5 complete fictional patient scenarios with multi-branching outcomes.
* Decoupled headless game engine with dual synchronized representation (Phaser 2D canvas + Semantic HTML).
* Centralized input manager (Keyboard, Mouse, Gamepad API).
* Gamepad haptic feedback service.
* Web Audio synthesizer with closed captions.
* Complete settings modal (Contrast, font scale, motion, audio, haptics, keybindings).
* Pause, Restart, and detailed End-of-Shift evaluation report.
* LocalStorage save/load system.

### Future Scope (Post-MVP)
* Multi-shift campaign with day/night cycles.
* Pediatric and trauma bay expansions.
* Custom scenario creator for healthcare educators.
* Multilingual localization.

### Non-Goals
* No real medical diagnosis or real patient data.
* No online accounts, multiplayer, or backend server requirements (100% local browser play).
* No AI diagnosis tools or LLM hallucination in game mechanics.

---

## 12. Success Criteria
1. **Accessibility Zero-Blocker:** A deaf-blind user navigating via keyboard/controller can complete all 5 cases and finish the shift without sighted or hearing assistance.
2. **Deterministic Quality:** 100% automated test coverage over core state transitions, patient decisions, and resource tracking.
3. **No Flashing / Safety:** Adheres to WCAG 2.2 Guideline 2.3 (Three Flashes or Below Threshold).
4. **Performance:** 60 FPS visual rendering, sub-100ms keyboard interaction latency.
