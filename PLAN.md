# Consolidated Roadmap (2026-05-09, revised 2026-05-10)

Single forward plan. Replaces three superseded plans. Shipped items in `docs/COMPLETED-WORK.md`.

Baseline 2026-05-09: 1005 tests green, lint clean, build clean.

## Source of truth (non-negotiable)

**The Air Force sets the standard. We do not question it.**

Authoritative sources, in order of precedence:
1. DAFMAN 36-2905 (24 March 2026 edition) - the regulation. Pinned at `refs/DAFMAN-36-2905.pdf`; extracted text at `docs/DAFMAN-36-2905.md`.
2. AFPC PFRA Scoring Charts (current edition pinned in `docs/UPSTREAM-PINS.json`) - the tables. Pinned at `refs/PFRA Scoring Charts.pdf`; extracted text at `docs/PFRA-Scoring-Charts.md`.

**Our scope is verification of our own process**, not adjudication of the source:

- Did we **extract** the chart values from the PDF correctly?
- Do `scoringTables.js` and `constants.js` **encode** the extraction faithfully?
- Does the engine **compute** what the source says it should?
- Does the S-code **persist** raw user inputs without drift?
- Does the UI **display** the engine output without silent transformation?

When our output disagrees with the source: **our code is wrong**. Never the source.

When the chart looks non-monotonic, asymmetric, or counterintuitive: that's the chart. Our job is to mirror it, not smooth it. We do not impose engineering aesthetics on regulation.

When DAFMAN and the chart appear to conflict: our **reading** is suspect, not the source. Re-read both verbatim before concluding anything.

### The deliberate split: external pillar vs internal trajectory signal

The Air Force scores down to a chart floor. Below the `*` row, external
points = 0 and the component is unmet. That's the regulation. We honor it
literally for everything the Air Force consumes: the composite displayed to
the user, the supervisor report, the AF Form 4446 PDF, the pass/fail label,
the S-code that records the assessment.

**But Trajectory's mission is to serve members who are below the standard,
training toward it.** A member at 28 reps when the chart floor is 30 is two
reps from registering points. Next week at 29 reps, they are one rep from
registering. To the Air Force these are both "0 points, component unmet."
Identical. To the airman they are real progress. If we honor only the AF view,
the failing airman sees no trajectory, no signal, no reason to keep training,
and the product fails the very members who need it most.

We resolve this with a deliberate split:

- **External points (`points` in code).** AF-literal. DAFMAN + AFPC byte-for-byte. Below floor = 0. Surfaces in: composite, pass/fail, supervisor report, AF Form 4446 PDF, S-code, achievements, history, any user-visible "score" number.
- **Internal trajectory signal (`internalPoints` in code).** Trajectory's contribution. Continuous below the AF chart floor (linear extrapolation per A1 design contract). **Drives** the math behind projection-chart curves, ROI rankings, and training-plan effort allocation — the airman sees motion in the visualizations these produce, but never sees `internalPoints` itself. The value does not reach the rendered UI, the supervisor report, the AF Form 4446 PDF, the S-code, achievements, history, or the pass/fail label. It is a computation-layer concept, period.

The two numbers serve two audiences. The Air Force gets pillar-faithful
external points. The airman in training gets a continuous signal that says
"you are moving" even when the AF chart says "you are zero." The two never
mix. The split is what lets us be regulation-faithful and member-useful at
the same time.

## Process invariants (what we, the implementers, guarantee)

These are not claims about the regulation. They are claims about our code's
discipline. Tests must enforce them as regression guards.

- **P1.** External `points` returned by the engine equals the value the AFPC chart specifies for that `(performance, exercise, age, gender)` row, byte-for-byte. No engineering smoothing, rounding adjustments, or interpolation between rows beyond what the source itself defines.
- **P2.** No pass/fail logic exists in the engine that isn't traceable to a DAFMAN § via citation comment. Every gate (composite, component-min, BFA, walk, diagnostic period) is a literal restatement of regulation.
- **P3.** `internalPoints` never reaches the UI. It drives math behind the scenes (projection-curve shape, ROI rankings, training-plan effort allocation), but the value itself does not appear in any rendered DOM, supervisor report, AF Form 4446 PDF, S-code, achievement, history entry, or pass/fail label. Grep-enforced: `grep -r "internalPoints" src/components/` returns zero hits.
- **P4.** S-codes encode raw user-entered performance values, not derived points or composite scores. Historical S-codes silently re-score under any engine change.
- **P5.** Composite arithmetic matches the regulation's stated weights exactly (Cardio 50, Body Comp 20, Strength 15, Core 15) and rounds per DAFMAN §3.6.1 (`round((earned/possible)*1000)/10`).
- **P6.** WHtR is truncated, not rounded, before lookup (DAFMAN §3.15.4.2). `Math.floor(value*100)/100`.

## Verification gates (how we prove the engine matches the source)

Independent of any task. Every scoring change must pass all four:

1. **Extraction check.** A canonical extraction of `refs/PFRA Scoring Charts.pdf` (script-driven, deterministic) produces a JSON fixture. Test compares `scoringTables.js` against the JSON. Drift = our encoding is wrong; fix the encoding.
2. **Computation check.** For named (performance, exercise, age, gender) tuples cited verbatim in DAFMAN or visible on the chart, the engine returns the chart's value. Drift = our computation is wrong; fix the engine.
3. **Round-trip check.** S-code encode + decode preserves raw user input bit-exactly. Drift = our codec is wrong; fix the codec.
4. **Display check.** UI renders the engine's external `points` and pass/fail without transformation. Grep-enforced: no `* 0.95`, no clamps, no "soften" math in `src/components/`.

## Prioritization

Active tasks ranked by `(user-impact x P-currently-broken) / effort`. Ranking
reflects current evidence; re-rank when a task ships or a finding inverts a
score.

| # | Task | Impact | P(broken) | Effort | Score |
|---|---|---|---|---|---|
| 1 | B6a-preflight - read DAFMAN §3.1.2.1.1 verbatim, scope BFA gate | scoping | n/a | XS | **first** |
| 2 | B6a - BFA gate enforcement | High (regulation gate not enforced) | High (only test comments mention it) | depends on preflight | high |
| 3 | A1 - Linear extrapolation for `internalPoints` | Medium (projection plateau below floor) | High (clamp confirmed at scoringEngine.js:110) | M | high |
| 4 | B6b - Walk time-limit re-diff vs Table 3.1 | Medium | Unknown | XS-S | high |
| 5 | B6c - Waist averaging math vs §3.15 | Medium | Unknown | S (after locating which code owns it) | medium |
| 6 | B6d - Diagnostic vs scored period audit | Medium | Unknown | M | medium |
| 7 | A3-preflight - stratified extraction-vs-encoding diff | sizes A3 | Unknown | S | medium |
| 8 | B6e - Exemption semantics (regulation read first, design doc, then code) | High (multi-category exemption flattened to boolean) | High | L+ | medium-low (effort) |
| 9 | B3 - Local-extract hash gate | Zero user impact | Zero | S | low |
| 10 | A3a-h - Per-exercise verbatim transcription | Low (rare user impact at boundary cells) | Unknown until A3-preflight | iterative L+ | conditional |

**Start order:** 1 -> 2 -> 3 -> 4 -> 5. Re-rank after each.

## Stop-work triggers (process-side only)

Triggers fire on suspected **process** error. Never on suspected source error.

- **A1:** if extrapolation cannot be expressed as a closed-form function of the existing chart rows (e.g. last two distinct-points rows have non-monotonic relationship in our extraction), pause. Either the extraction is wrong, or the chart genuinely has that shape and the algorithm needs a deterministic rule for it. Do not guess.
- **A3 (any sub-task):** if our extraction produces inconsistent values across two independent extraction passes of the same PDF page, pause and reconcile. Disagreement between extraction runs is a process bug. Disagreement between our extraction and the engine is also a process bug, fix one to match the other.
- **B6a:** if DAFMAN §3.1.2.1.1 specifies a gate involving body-fat percentage that we don't currently capture (no BF% input field, no BF% in S-code), pause. The task scope is now "add BF% support" and needs separate sizing.
- **B6e:** if the regulation read identifies exemption categories whose composite-math effect requires state-shape change in S-code or AppContext, pause and write a design doc before any code.
- **Plan-abandon:** if DAFMAN 36-2906 (or any §3.7 successor edition) publishes, this plan is suspended pending re-baseline. G6 (`check-upstream-pubs.sh`) detects publication and halts deploy with a saved PDF artifact. **Action on detection:** open an entry in `docs/DECISIONS.md` titled `plan-suspend: <edition-date>` and create a new roadmap referenced from there.

## Workstream A - Engine rewrite

External `points` is DAFMAN-literal. Internal `internalPoints` is tunable,
used by projection / ROI / training math, never rendered.

### A1 - Linear extrapolation for `internalPoints` below chart floor [M]

**Why this matters - core product purpose.** A member at 28 push-ups when the
chart floor is 30 is two reps from registering points. Next week at 29, they
are one rep from registering. To the AF chart these are both "0 points." To
the airman they are real progress. Today `internalPoints` clamps at the
chart-min value (scoringEngine.js:110), which means a failing member's
projection is a flat line: training, but appearing not to move. The product
loses its purpose for the members it most needs to serve.

A1 replaces the clamp with linear extrapolation so projection chart curves,
ROI rankings, and training-plan effort allocation all see continuous motion
below floor. The failing member sees their trajectory rising as performance
rises, even while still below the AF chart's reach.

**Scope is internal only.** External `points = 0` below floor stays unchanged
(DAFMAN §3.7.4, P1 invariant). The chart is silent below `*`; the
extrapolation is **Trajectory's** progress signal, the deliberate split
described in the source-of-truth section above. We document it as such.

**Design contract** (write to `docs/DECISIONS.md` first, in a separate commit):
- Below floor, `internalPoints` is monotonically increasing in performance. (This is Trajectory's algorithm, not a regulation claim.)
- Slope = (points_a - points_b) / (threshold_a - threshold_b) where rows a, b are the **last two distinct-points rows** of the table (skip flat regions).
- Hard floor at **2x chart height below the `*` row** - deliberate symmetric mirror of the AF-defined performance band. The chart spans the upper half of the trackable range; extrapolation extends an equal distance below to mark "still trackable but past the point where score-chasing makes sense; emphasis shifts to remediation." Internal-only; not derived from regulation.
- Above-ceiling clamp unchanged (EC-01).

**Named consumers to migrate** (no separate audit task):
- `src/utils/scoring/scoringEngine.js` `calculateComponentScore` - propagates `internalPoints` to the result object.
- `src/utils/projection/projectionEngine.js` - primary beneficiary; trajectories below floor today plateau.
- `src/utils/scoring/optimalAllocation.js` - ROI ranking for currently-failing exercisers.
- `src/utils/scoring/strategyEngine.js` - gap-to-next-threshold math.
- `src/utils/achievements/achievements.js` - verify `internalPoints` is not consumed (achievements are external-score-only). Grep proof in PR.

**Per-consumer behavior assertion (each = one test):**
- [ ] `projectionEngine`: athlete at `*-1 tick` over 4 weeks shows non-zero slope.
- [ ] `optimalAllocation`: two airmen below floor on different exercises rank differently when one is 80% of the way to floor and the other 20%.
- [ ] `strategyEngine`: gap-to-next-threshold for sub-floor athlete returns the actual gap, not zero.
- [ ] `achievements`: grep returns zero hits for `internalPoints` in `achievements.js`.

**Implementation acceptance:**
- [ ] DECISIONS.md entry committed in advance of the code PR (separate commit, easier review).
- [ ] `scoringEngine.js` `lookupScore` extrapolation replaces clamp at line 110.
- [ ] Slope formula tested directly (not just via behavior): given two synthetic rows, the function returns the correct slope and clamps correctly at 2x.
- [ ] Behavior tests in `scoringEngine.test.js`: at-floor, one-tick-below, halfway-to-zero, at-2x-cap, beyond-cap (clamp).
- [ ] Verification gate 4 (Display check): `grep -r "internalPoints" src/components/` returns zero hits (P3).
- [ ] All four consumer behavior assertions above pass.
- [ ] Process invariants P3, P5, P6 unchanged (regression guards).

### A3 - Verbatim PFRA table transcription verification (decomposed) [conditional, iterative L+]

**Why this matters.** Today's tables are believed close-to-correct but not
verified verbatim against the AFPC PDF. A user scoring at a boundary cell
might see our value while the official chart says something different. Our job
is to verify our encoding matches the source, then encode faithfully if it
doesn't.

- [ ] **A3-preflight [S].** Build a deterministic extraction script that pulls table values from `refs/PFRA Scoring Charts.pdf` directly (not via `docs/PFRA-Scoring-Charts.md`, which is itself an extract). Run it. Diff the JSON output against `scoringTables.js` numeric content for a **stratified sample**: one cell per (exercise, lowest bracket, mid bracket, highest bracket, both genders) - that's 7 exercises x 3 brackets x 2 genders = 42 cells. Document the result.
  - **If sample shows zero drift:** A3 collapses to "add the JSON fixture and a comprehensive equality test." Single PR. Skip A3a-h.
  - **If sample shows drift:** the per-exercise PRs below are real work. Drift in the sample is also a signal that other cells likely drift; widen the encoding fix to cover the whole exercise, not just the cells sampled.

**Source pipeline (one-time, before any A3a-h):**
- [ ] Extraction script lives at `scripts/extract-pfra-charts.mjs`. Output: `src/utils/scoring/__fixtures__/pfra-charts-verbatim.json`. Reproducible: re-running on the same PDF produces an identical JSON byte-for-byte (deterministic; no timestamps, no random ordering).
- [ ] Test `src/utils/scoring/scoringTables.verbatim.test.js` iterates the JSON and asserts equality with `scoringTables.js`.

**Per-exercise PRs (only if pre-flight shows drift):**
- [ ] **A3a [M]** 2-mile run.
- [ ] **A3b [M]** HAMR.
- [ ] **A3c [M]** Push-ups.
- [ ] **A3d [M]** HRPU.
- [ ] **A3e [M]** Sit-ups.
- [ ] **A3f [M]** CLRC.
- [ ] **A3g [M]** Plank.
- [ ] **A3h [XS]** WHtR (single table, no bracket variation).

Each per-exercise PR:
- [ ] Updates rows of `scoringTables.js` to match the JSON fixture for that exercise, byte-for-byte.
- [ ] Appends anomalies (rows where the chart is non-monotonic or unexpected) to `docs/SCORING-ANOMALIES.md` with chart page/row citation - **for the record only**, not as a basis to second-guess the chart.
- [ ] Regenerates affected fixtures in `scoringEngine.test.js`, `strategyEngine.test.js`, `optimalAllocation.test.js` atomically.
- [ ] Verification gate 1 (Extraction check): re-run extraction script, hash matches.
- [ ] Verification gate 2 (Computation check): the engine returns the chart's value for sampled cells.

## Workstream B - Compliance verification

`docs/DAFMAN-COMPLIANCE-MATRIX.md` (G1) and `scripts/check-upstream-pubs.sh`
(G6) are delivered.

### B6a - BFA gate (§3.1.2.1.1) enforcement

**Why this matters.** DAFMAN §3.1.2.1.1 specifies a gate that today exists
only in test comments. If a member's WHtR (or BF%, depending on the
regulation's literal text) and composite combination should fail per the gate,
our engine currently returns "Satisfactory" - a false pass. Process error on
our side: we encoded composite + component-min + walk gates but skipped this
one.

- [ ] **B6a-preflight [XS].** Read DAFMAN §3.1.2.1.1 verbatim from `docs/DAFMAN-36-2905.md`. Cross-check against `refs/DAFMAN-36-2905.pdf` directly. Record the literal rule in `docs/DECISIONS.md` with the exact text. Decide:
  - Does the gate use WHtR only, BF% only, or `WHtR > X OR BF% > Y`?
  - What is the composite threshold for the gate?
  - Does the gate apply during the diagnostic period?
  - **Stop-work check:** if the gate involves BF% and we don't capture BF% today, B6a expands to add BF% support; resize and re-rank.

- [ ] **B6a [size depends on preflight].** Implement helper `checkBFAGate(...)` per the literal rule. Cite §3.1.2.1.1 inline. Integrate into `calculateCompositeScore`. Result object gains a gate-status field.
  - [ ] Grep all consumers of `calculateCompositeScore` (`scoringEngine`, `projectionEngine`, `optimalAllocation`, `strategyEngine`, `achievements`); update each to honor the new field.
  - [ ] UI surface: pass/fail display must reflect the gate. **Note:** this requires a UI edit that out-of-scope previously excluded; the exclusion is overridden here because gate enforcement without UI surface is a half-fix.
  - [ ] Tests cover all combinations the regulation distinguishes (read literally; do not invent quadrants).
  - [ ] Verification gate 2 (Computation check): for each (whtr, composite) combination DAFMAN names explicitly, the engine returns the regulation's pass/fail.
  - [ ] DAFMAN-COMPLIANCE-MATRIX.md row for §3.1.2.1.1 flips to `compliant` per the three-bar rule.

### B6b - Walk time-limit re-diff vs Table 3.1 [XS-S]

**Why this matters.** `WALK_TIME_LIMITS` in `constants.js` was set against an
earlier DAFMAN edition. If the 24 Mar 2026 edition's Table 3.1 differs, our
encoding is out of date.

- [ ] **B6b-preflight.** Read Table 3.1 verbatim. **Source priority:** read from `refs/DAFMAN-36-2905.pdf` directly (tables often mangle through pdftotext); use `docs/DAFMAN-36-2905.md` only as a cross-check. If the markdown table is corrupt vs the PDF, that's a separate issue (re-extract DAFMAN); do not let it block B6b.
- [ ] Diff the verbatim values against `WALK_TIME_LIMITS`.
- [ ] **If no drift:** add a regression test pinning the values to §3.7.3, citation comment in `constants.js`, matrix row to `compliant`.
- [ ] **If drift:** correct values; update affected test fixtures; DECISIONS.md entry; matrix row + citation update.

### B6c - Waist averaging math vs §3.15 [S]

**Why this matters.** DAFMAN §3.15 specifies a 3-measurement waist protocol
with a specific rounding rule. If our average computation rounds where DAFMAN
truncates (or vice versa), users at WHtR boundaries score wrong.

- [ ] **B6c-preflight [XS].** Locate where the averaging math actually lives. Three candidates: (a) pre-filled by `generateFormPDF.js` before the PDF is opened; (b) computed inside the PDF by document-level JavaScript that ships in the form; (c) computed in the SelfCheck UI before being passed to the engine. Find the truth via grep + read.
- [ ] Read DAFMAN §3.15 verbatim. Identify the averaging + rounding rule.
- [ ] Compare against the located code path.
- [ ] **If no drift:** pinning regression test, citation, matrix row.
- [ ] **If drift:** fix in the owning code path. If the rule lives in the PDF JS, fix the PDF JS string in `generateFormPDF.js`.

### B6d - Diagnostic vs scored period audit [M]

**Why this matters.** DAFMAN distinguishes diagnostic-period results
(Mar 1 - Aug 31, 2026) from scored results. Today `isDiagnosticPeriod()`
exists; the audit is whether **every** consumer of PFRA results honors the
distinction.

- [ ] **B6d-preflight [S].** Read DAFMAN's diagnostic-period § verbatim. Enumerate the regulation's specific consequences ("results do not affect X, Y, Z").
- [ ] Grep all consumers of `calculateCompositeScore` return value and pass/fail derivations across `src/components/`, `src/utils/`, and `src/utils/codec/scode.js` (S-code timestamp encoding may interact).
- [ ] For each consumer: confirm diagnostic-period results carry the regulation-specified treatment.
- [ ] DECISIONS.md "consumer audit" appendix.
- [ ] Fix any site that treats diagnostic and scored results identically when the regulation says otherwise.
- [ ] Matrix row flip when audit complete.

### B6e - Exemption semantics [L+, regulation read + design doc + code]

**Why this matters.** DAFMAN recognizes multiple exemption categories
(medical profile, pregnancy/postpartum, deployment, age waivers). Today our
data model has a single boolean `exempt` per component. The regulation may
treat categories differently in composite math, in supervisor-report
language, or both.

- [ ] **B6e-preflight [S]. Regulation read.** Read DAFMAN's exemption §s verbatim. Enumerate every category. For each category, record the regulation's literal rule on (a) effect on composite math, (b) effect on report language, (c) duration / expiry.
- [ ] **B6e-design [M]. Design doc.** Based on the regulation read, answer:
  - Which categories affect composite math vs display only?
  - State shape: enum, struct, or boolean+category?
  - Round-trip: how does the new shape encode in S-code without breaking historical S-codes (P4)?
  - What does `calculateCompositeScore` return for a multi-category exempt member?
  - Stop-work check: if the design requires S-code or AppContext shape change, complete the design doc before any code.
- [ ] **B6e-code [L].** Implement per design.
- [ ] S-code round-trip test for each category combination the regulation distinguishes (don't invent combinations the regulation doesn't separate).
- [ ] Matrix rows for each category flip to `compliant`.

### B3 - Local-extract hash gate [S, low priority]

**Why this matters.** G6 catches upstream PDF drift. B3 catches local edits
to `docs/DAFMAN-36-2905.md` not accompanied by a `REGULATION_VERSION` bump.
Process-discipline check, no user-facing impact.

- [ ] `scripts/check-dafman-hash.sh`: SHA-256 of `docs/DAFMAN-36-2905.md` against `docs/DAFMAN-36-2905.sha256`.
- [ ] **Decision: blocking or advisory in deploy.yml?** Blocking is consistent with G6 (download-and-halt). Pick blocking; an unrelated typo fix in the markdown extract should require a `.sha256` regen anyway, and the override path (`chore(dafman): bump`) handles it.
- [ ] Override workflow: regenerate `.sha256`, update `REGULATION_VERSION`, update compliance matrix header. Document in DECISIONS.md.
- [ ] **Acceptance:** synthetic one-byte edit fails CI.

## Workstream C - Cleanup

### C2 - Memory hygiene [XS]
- [ ] Grep `~/.claude/projects/-mnt-cephfs-shared-projects-Trajectory/memory/` for the three deleted plan filenames.
- [ ] Update each hit to point at `docs/COMPLETED-WORK.md` or this plan, or delete if no longer load-bearing.
- [ ] **Acceptance:** grep returns zero hits.

## Definition of "compliant" (matrix row flip rule)

A `DAFMAN-COMPLIANCE-MATRIX.md` row flips from `open` to `compliant` only when
all three are true:
1. The rule is enforced in code at the cited file:line.
2. A test asserts the rule by behavior. Test path is recorded in the matrix's "Test ref" column (add column if it doesn't exist).
3. The §-citation in the matrix matches the citation comment in code matches the literal § token in `docs/DAFMAN-36-2905.md`.

A row with code-only or test-only coverage stays `partial`.

## Parked (decision pending)

- **B1** Code citation grep gate.
- **B2** Compliance fixtures / matrix-test linkage beyond what's already shipped (`chartFloor.test.js`).
- **A5** `gapEngine.js` extraction.

## Killed (do not revisit)

- **B4** Chart-version advisory warning. Advisory warnings get ignored.
- **B5** PR template. Doesn't surface in this repo's production automation flows.

## Out of scope

- UI rework beyond what's required to surface a regulation-driven gate or status (B6a explicitly overrides this when the gate-result must reach users).

## Plan lifecycle

- Tasks move out of this plan into `docs/COMPLETED-WORK.md` in the **same PR** that ships the task. Squash or rebase merge: the COMPLETED-WORK edit is squashed/rebased into the merge. Merge-commit workflow: the COMPLETED-WORK edit lives on the feature branch and ships with the merge commit.
- Re-rank the priority table whenever a task ships, a preflight surfaces a finding, or the source of truth updates.
- Plan-abandon trigger above.
