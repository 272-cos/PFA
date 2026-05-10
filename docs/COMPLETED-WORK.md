# Completed Work Ledger

This file records work that has shipped. Items here are out of the active plan
queue. Each entry cites the commit, the verifying file/test, and the date the
work landed.

Format per row:
- **What** - one-line description of the shipped behavior.
- **Where** - file:line or test reference proving it exists.
- **Commit / PR** - sha or merge.
- **Verified** - ISO date the verification was last run against current main.

If a row's claim is no longer true (file moved, behavior reverted), update the
verifying ref or move the row back into the active plan with a note about the
regression.

## Scoring engine

### DAFMAN §3.7.4 chart-floor minimum (replaces legacy 60% heuristic)
- **Where:** `src/utils/scoring/constants.js:69` (`COMPONENTS_WITH_CHART_FLOOR_MINIMUM`); `src/utils/scoring/scoringEngine.js:87-134` (`lookupScore` returns `{points, internalPoints}`); `src/utils/scoring/chartFloor.test.js` (144 tests covering 9 brackets x 2 genders x 7 exercises plus WHtR + walk).
- **Rule:** component minimum is met iff the component is exempt, is BC, is walk, or produced `externalPoints > 0` (chart `*` row).
- **Commit:** `ce1c556` (replace legacy 60% heuristic).
- **Verified:** 2026-05-09.

### DAFMAN §3.15.4.2 WHtR truncation
- **Where:** `lookupScore` in `scoringEngine.js` uses `Math.floor(value*100)/100` for WHtR.
- **Commit:** `1862db6`.
- **Verified:** 2026-05-09.

### DAFMAN §3.7.1 Body Composition has no per-component minimum
- **Where:** `COMPONENTS_WITH_CHART_FLOOR_MINIMUM` excludes BC; `getMinimumToPass` returns `null` for WHtR; `projectComponent` treats undefined `minPct` as 0.
- **Commit:** `1862db6`.
- **Verified:** 2026-05-09.

### Two-number engine output (external `points` + internal `internalPoints`)
- **Where:** `scoringEngine.js:134` returns both. `internalPoints` is propagated through `calculateComponentScore`. Below chart floor: `points = 0`, `internalPoints = chart-minimum` (clamp; full linear-extrapolation spec is still open in roadmap).
- **Commit:** `1862db6`.
- **Verified:** 2026-05-09.

### Regulation + chart version constants
- **Where:** `src/utils/scoring/constants.js:190-192` -
  `CHART_VERSION = '2026-03 PFRA Final'`,
  `REGULATION_VERSION = 'DAFMAN 36-2905, 24 March 2026'`.
- **Verified:** 2026-05-09.

## UI / UX

### Minimum-to-pass surfacing
- SelfCheckTab, ProjectTab, ReportTab all render the `*`-row threshold for failing components, sourced from `getMinimumToPass(exercise, age, gender)` in `reverseScoring.js`.
- **Commit:** `bdded00` (Task 1 of kitchen-sink), refined by `198eceb`, `9a695eb`, `8a8a8d2` and the rephrasing PRs in late April.
- **Verified:** 2026-05-09.

### Unified ExercisePreferencePicker
- **Where:** `src/components/shared/ExercisePreferencePicker.jsx`. Replaces the PlanTab "PFA Events" panel and ProjectTab "Training Exercise Preferences" block. CLRC selectable; defaults inferred from latest assessment.
- **Commit:** `dd2865d`.
- **Verified:** 2026-05-09.

### Full-state backup and restore
- **Where:** PlanTab Regenerate button replaced with Back-Up; HistoryTab export covers full state; restore via file picker with `OverwriteConfirmModal`. Helpers in `src/utils/storage/localStorage.js`.
- **Commit:** `4854cde`.
- **Verified:** 2026-05-09.

### Calendar days freedom (3-7) + overtraining modal + constant-load scaling
- **Where:** PlanTab gates updated; `OvertrainingWarningModal.jsx` blocks first >3 selection (acknowledged once via `pfa_overtraining_ack`). `phaseEngine.js` per-session volume invariance proven by 7 new tests in `phaseEngine.test.js`. Decision recorded in `docs/DECISIONS.md`.
- **Verified:** 2026-05-09.

### Pill selector standardization
- **Where:** `src/components/shared/PillGroup.jsx`, `PillToggle.jsx`, `SegmentedControl.jsx`. SelfCheckTab, PlanTab, ReportTab use the shared components.
- **Commit:** `d20690a` (Task 5).
- **Verified:** 2026-05-09.

### Milestones moved to HistoryTab
- **Where:** `HistoryTab.jsx:592` renders `<AchievementBadges/>`; ProfileTab no longer imports or renders it.
- **Verified:** 2026-05-09.

### ROI math transparency panel
- **Where:** `src/components/shared/ROIBreakdownPanel.jsx` wired into `ProjectTab.jsx:1324`. Old "Personalized Weekly Training Plan" collapsible removed.
- **Verified:** 2026-05-09.

### HAMR countdown cadence simplification
- **Where:** `HamrMetronome.jsx` four-signal 3-2-1-GO; level-up routes through the same countdown helpers as session start.
- **Commit:** `4de016c` (Task 9).
- **Verified:** 2026-05-09.

### No-forced-flows modal sweep
- **What:** Every modal has a cancel/back/dismiss path. Audited and fixed: OnboardingModal (X close + backdrop), OvertrainingWarningModal (ESC + backdrop + X), UnsavedWarningModal (Keep editing button), ReportTab `alert()` -> toast.
- **Policy:** captured in memory `feedback_no_forced_flows.md`.
- **Verified:** 2026-05-09.

### AF Form 4446 PDF generator
- **Where:** `src/utils/pdf/generateFormPDF.js` (pdf-lib AcroForm, ~1013 lines). Four PKCS#7 signature widgets with `/SigFieldLock /Include` arrays; CAC auto-fill via document-level JS; verbatim Privacy Act block; integrated into SelfCheck + History download actions.
- **Commits:** `504aa51`, `5d7cc85`, `729edf1`, `57ea675`, `8a1595c`, `3c34a25`.
- **Verified:** 2026-05-09.

### AFPC recon section in DEVELOPMENT_PLAN
- **Where:** `docs/DEVELOPMENT_PLAN.md:937` "AFPC recon (lower-priority candidate sprints)" with table-diff, gap inventory, and harvested phrasing subsections.
- **Verified:** 2026-05-09.

## Compliance scaffolding

### DAFMAN Compliance Matrix (G1)
- **Where:** `docs/DAFMAN-COMPLIANCE-MATRIX.md`. Rows for currently-enforced rules and known gaps.
- **Verified:** 2026-05-09.

### Upstream publication monitor (G6)
- **Where:** `scripts/check-upstream-pubs.sh`, `docs/UPSTREAM-PINS.json`, `.github/workflows/deploy.yml` upstream-check step, `docs/upstream-snapshots/README.md`. Download-and-halt on drift; full Brave-Chrome 147 header set bypasses AFPC Akamai WAF; HEAD 403 treated as unreachable not drift (`c10fe8d`).
- **Verified:** 2026-05-09.

## Audits

### Q11 scoring duplication map
- **Where:** `docs/SCORING-DUPLICATION-MAP.md` - 828 lines, 134 touch points across 32 files, grouped ENGINE / AGGREGATION / DISPLAY / PROJECTION / GAP-ROI / TRAINING / PDF / CODEC / TESTS / DOCS.
- **Verified:** 2026-05-09.

## Test + lint baseline (2026-05-09)

- 25 test files, **1005 tests passing**.
- `npm run lint` zero warnings.
- `npm run build` clean.
