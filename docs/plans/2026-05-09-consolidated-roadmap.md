# Consolidated Roadmap (2026-05-09)

Single forward plan. Replaces:
- `docs/plans/04232026-new-score.md` (DAFMAN-literal per-component minimum) - **delivered**, see `docs/COMPLETED-WORK.md`.
- `docs/plans/2026-04-19-dafman-compliance-guardrails.md` - G1 + G6 delivered; G2-G5, G7, G8 carried forward below.
- `docs/plans/2026-04-14-kitchen-sink-polish-sprint.md` - Tasks 1-7, 9, 10 delivered; D1-D4 engine-rewrite items carried forward below.

Baseline 2026-05-09: 1005 tests green, lint clean, build clean.

Validation rule: every task below has a code-level acceptance criterion (file
exists / behavior asserted by a test / grep result). Don't tick a checkbox on
self-report; cite the verifying ref.

## Workstream A - Engine rewrite (D1 finish + D2/D3/D4)

Two-number scoring model, partial today. External `points` is DAFMAN-literal
(pillar; change-controlled). Internal `internalPoints` is tunable (used by
projection / ROI / training emphasis only; never rendered). Currently
`internalPoints = chart-minimum` clamp below floor; the spec calls for linear
extrapolation.

### A1 - Linear extrapolation for `internalPoints` below chart floor (D1 finish)
- [ ] In `scoringEngine.js` `lookupScore`, replace the `internalPoints = chartMin` clamp at line 110 with linear extrapolation using the slope of the last 2 chart rows.
- [ ] Cap extrapolation at **2x chart height below the floor** (hard floor on the internal score, prevents runaway negatives).
- [ ] No change to external `points` (still 0 below floor per DAFMAN §3.7.4).
- [ ] No change to above-ceiling clamp (EC-01).
- [ ] **Acceptance:** new tests in `scoringEngine.test.js` assert (a) below-floor `internalPoints` values for each exercise match the 2-row slope formula, (b) clamp at 2x chart height, (c) external `points` stays 0.
- [ ] **Acceptance:** grep `internalPoints` across `src/components/` returns zero hits (continuous tracking number must never reach UI).
- [ ] **Acceptance:** `docs/DECISIONS.md` entry citing the slope-of-last-2-rows choice.

### A2 - Audit `internalPoints` consumers
- [ ] List every consumer of `internalPoints` (projection, ROI, training emphasis) and confirm each was reading the chart-min clamp safely.
- [ ] Update consumers that benefit from the extrapolation (projection bands below floor, ROI rankings for currently-failing exercisers).
- [ ] **Acceptance:** projection of an athlete one tick below `*` row no longer plateaus at the chart-min point value.

### A3 - Verbatim PFRA table transcription (D2)
- [ ] Replace all 126 scored tables (9 brackets x 2 genders x 7 exercises) in `src/utils/scoring/scoringTables.js` with verbatim values from `refs/PFRA Scoring Charts.pdf`.
- [ ] Preserve any non-monotonicities or boundary oddities; mark each with a source-line comment citing chart page + row.
- [ ] **Acceptance:** new `src/utils/scoring/scoringTables.verbatim.test.js` iterates a fixture of every charted (exercise, bracket, gender, threshold, points) tuple and asserts table equality. Fixture sourced from `docs/PFRA-Scoring-Charts.md`.
- [ ] **Acceptance:** existing `chartFloor.test.js` stays green (no regression of the `*`-row claims).
- [ ] **Acceptance:** `scoringEngine.test.js` + `strategyEngine.test.js` + `optimalAllocation.test.js` fixtures regenerated atomically in the same commit.

### A4 - Anomalies doc (D3)
- [ ] Create `docs/SCORING-ANOMALIES.md` listing every preserved chart anomaly: page/row/bracket reference, observed value, what a monotonic table would say, why we kept the chart value (DAFMAN literal adherence).
- [ ] Cross-link from `src/utils/scoring/scoringTables.js` header comment and `CLAUDE.md` "Authoritative Scoring Reference" section.
- [ ] **Depends on:** A3.

### A5 - `gapEngine.js` extraction (D4)
- [ ] New module `src/utils/scoring/gapEngine.js` owning: distance-below-floor, distance-to-next-threshold, distance-to-next-bracket-boundary, distance-to-composite-pass. Returns both domain units (seconds / reps / inches) and point-space values.
- [ ] `strategyEngine.js` keeps ROI / effort-week math; pulls gap data from `gapEngine` instead of inlining.
- [ ] **Acceptance:** new `gapEngine.test.js` covers the 4 distance primitives across all exercises and both genders.
- [ ] **Acceptance:** `strategyEngine.js` no longer contains inline gap arithmetic (grep for `threshold -` / `points -` style subtraction in strategyEngine returns zero non-trivial hits).
- [ ] **Depends on:** A1 (clean below-floor signal needed for distance-below-floor).

## Workstream B - Compliance guardrails (G2-G5, G7, G8)

`docs/DAFMAN-COMPLIANCE-MATRIX.md` (G1) and `scripts/check-upstream-pubs.sh`
(G6) are delivered. The remaining guardrails layer enforcement and
reviewer-facing prompts on top.

### B1 - Code citation convention + grep gate (G2)
- [ ] Convention: every scoring rule in `src/utils/scoring/**` carries `// DAFMAN §x.y.z - <one-line rule>` on its enforcement line. Existing 25 citations stay; backfill any uncited rule.
- [ ] Suppression: `// DAFMAN-UNCITED: <reason>` allowed for rules that are not regulation-derived.
- [ ] New `scripts/check-dafman-citations.sh`:
  - [ ] grep every `// DAFMAN §` token in `src/utils/scoring/**` and assert the `§x.y.z` substring literally appears in `docs/DAFMAN-36-2905.md`.
  - [ ] fail with the citation that pointed to a non-existent §.
- [ ] **Acceptance:** script exits 0 today against current `src/utils/scoring/`; exits 1 when an obviously-bogus citation (`§99.99.99`) is injected.
- [ ] Wire into `.github/workflows/compliance.yml` (created in B3).

### B2 - Machine-readable compliance fixtures (G3)
- [ ] New `src/utils/scoring/__fixtures__/dafman-compliance.js` exporting an array of fixture objects:
  ```js
  { ruleId, citation, rule, inputs, expected, expectedInternal, lastVerified }
  ```
- [ ] One fixture per §-level rule from `docs/DAFMAN-COMPLIANCE-MATRIX.md`.
- [ ] Reuse / reference (don't duplicate) the rules `chartFloor.test.js` already covers - that test stays as-is; new fixtures cover **the rules chartFloor doesn't already prove**, e.g. WHtR truncation, walk-fail cascade, BC no-min, composite >= 75 gate.
- [ ] New `src/utils/scoring/dafman-compliance.test.js` iterates fixtures; one `it()` per (ruleId, input) pair; failures name `ruleId` + `citation`.
- [ ] **Acceptance:** new test file green; `chartFloor.test.js` stays green.
- [ ] **Depends on:** B1 (citations land in code first, fixtures echo them).

### B3 - CI gate: regulation hash + citation integrity (G4)
- [ ] `scripts/check-dafman-hash.sh`: SHA-256 of `docs/DAFMAN-36-2905.md`, compares against `docs/DAFMAN-36-2905.sha256`. Fails on mismatch.
- [ ] **Open design choice (resolve before building):** hash the markdown extract (current plan) vs hash the source PDF (`refs/DAFMAN-36-2905.pdf`). Markdown is fragile across pdftotext versions; PDF is byte-stable. Recommend hashing the PDF.
- [ ] `.github/workflows/compliance.yml` runs B1 + this hash check + B2 test on every PR touching `src/utils/scoring/**` or `docs/DAFMAN-*`.
- [ ] Documented override path: bumping DAFMAN -> regenerate `.sha256`, update `REGULATION_VERSION`, update compliance matrix header, single commit named `chore(dafman): bump to <edition-date>`.
- [ ] **Acceptance:** synthetic PR mutating one byte of `docs/DAFMAN-36-2905.md` without bumping `.sha256` fails CI.
- [ ] **Depends on:** B1, B2.

### B4 - Chart version guard (advisory) (G5)
- [ ] Extend `src/utils/scoring/constants.js` with:
  ```js
  export const CHART_VERIFIED_AGAINST = {
    source, retrievedFrom, filename, sha256, verifiedDate, verifiedBy,
  }
  ```
- [ ] `scripts/check-chart-version.sh`: diff numeric content of `src/utils/scoring/scoringTables.js` against the previous commit; if changed without bumping `CHART_VERSION` or `CHART_VERIFIED_AGAINST.verifiedDate`, emit a CI warning (not blocker).
- [ ] **Acceptance:** synthetic table-value change without version bump produces a warning line in CI logs.

### B5 - PR review checklist (G7)
- [ ] New `.github/pull_request_template.md` with conditional checkboxes for scoring PRs:
  - Touched `src/utils/scoring/**`? Updated `docs/DAFMAN-COMPLIANCE-MATRIX.md`?
  - Added/changed a scoring rule? Added `// DAFMAN §x.y.z`?
  - Added/changed engine output shape? Added a fixture in `dafman-compliance.js`?
  - Changed `scoringTables.js` values? Bumped `CHART_VERSION` + `CHART_VERIFIED_AGAINST.verifiedDate`?
- [ ] **Acceptance:** template renders on a fresh PR (manual verification).

### B6 - Close known regulation gaps (G8, one PR per gap)
Each row below = one independent PR + one fixture in `dafman-compliance.js` +
one matrix-row flip from `open` to `compliant`.

- [ ] **§3.1.2.1.1 BFA gate.** New helper `checkBFAGate(whtr, composite)` returning a flag; consumed by `calculateCompositeScore`. Today only test comments mention it.
- [ ] **§3.7.3 walk time-limit re-diff.** Compare `WALK_TIME_LIMITS` in `constants.js` against Table 3.1 of the 24 Mar 2026 edition; correct any drift.
- [ ] **Waist-averaging math.** Verify the 3-measurement + average rounding/truncation rule matches DAFMAN; confirm `generateFormPDF.js` matches.
- [ ] **Exemption semantics audit.** Map each DAFMAN exemption category (medical profile, pregnancy/postpartum, deployment) to a concrete representation. Promote the single-boolean `exempt` flag to an enumerated status if nuance affects composite math.
- [ ] **Diagnostic vs scored period.** Audit every site that consumes `isDiagnosticPeriod()`; confirm DAFMAN's "diagnostic results don't carry the same consequences" rule is honored everywhere.
- [ ] **Depends on:** B2 (each gap lands its own fixture).

## Workstream C - Cleanup

### C1 - Plan / docs hygiene
- [ ] Delete the three superseded plan files (already actioned in this consolidation; left as a checkbox so the consolidation commit is auditable):
  - `docs/plans/04232026-new-score.md`
  - `docs/plans/2026-04-19-dafman-compliance-guardrails.md`
  - `docs/plans/2026-04-14-kitchen-sink-polish-sprint.md`
- [ ] **Acceptance:** `ls docs/plans/` shows only this consolidated plan plus any new ones authored after 2026-05-09.

### C2 - Memory hygiene (optional)
- [ ] Review `MEMORY.md` for entries that referred to the deleted plans by path; either update the references to point to `docs/COMPLETED-WORK.md` or the new consolidated plan, or remove if no longer load-bearing.

## Open questions (decide before starting the relevant workstream)

- [ ] **A3 ordering vs A1.** A3 (verbatim transcription) and A1 (linear extrapolation) are independent in code but share the test-fixture surface. Recommend A1 first so the extrapolation math is stable before tables churn; revisit if a chart-value bug blocks A1.
- [ ] **B3 hash target.** Markdown extract vs source PDF (see B3 bullet). PDF is recommended; capture the decision in `docs/DECISIONS.md` before scripting.
- [ ] **B2 vs `chartFloor.test.js` overlap.** Resolved direction: `chartFloor.test.js` stays as the §3.7.4 oracle; B2 fixtures cover the other §-level rules. Re-evaluate if duplication appears.

## Out of scope

- UI rework beyond the panels already shipped.
- New exercise modalities, age-bracket changes, S-code / D-code format changes.
- Backend or sync features.
- Anything requiring a network call from the running app (preserves CLAUDE.md non-negotiables).
