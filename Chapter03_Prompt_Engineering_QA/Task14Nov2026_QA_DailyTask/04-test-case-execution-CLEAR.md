# 04 — Test Case Execution

> **Framework:** CLEAR
> **Use when:** You are running an existing test suite and need a defensible execution record.
> **Skip when:** The cases do not exist yet — use `02-test-case-design-RICEPOT.md`.

---

## Prompt Template

```text
### C — Context
I am executing the following test cases against a live build.
- Product / module: [PRODUCT, MODULE]
- Build / version: [BUILD ID]
- Environment: [URL, BROWSER + VERSION, OS, DEVICE]
- Execution window: [DATE-TIME START → END]
- Test cases to execute: [PASTE CASE IDs AND STEPS]
- Evidence captured: [SCREENSHOTS, LOGS, HAR, VIDEO — or "None"]

### L — Limits
- Use ONLY the supplied test cases. Do not add, rewrite, or "improve" them.
- Record status only from actual evidence supplied. Never assume a result.
- Allowed statuses, exactly: Passed / Failed / Blocked / Not Run / Skipped.
- If a step could not be executed, the case is Blocked — not Passed.
- If evidence is missing for a step, mark that step "No evidence supplied."
- Do not assign defect IDs you were not given.

### E — Examples
| VWO-LOGIN-TC-001 | Step 1 | Open https://app.vwo.com/ | Login page loaded | Passed | Screenshot 01 |
| VWO-LOGIN-TC-004 | Step 4 | Submit with blank password | Submit blocked with validation | Failed | Screenshot 04 — form submitted |
| VWO-LOGIN-TC-007 | Step 2 | Enter locked-account credentials | Login rejected | Blocked | No locked test account available |

### A — Action
Produce an execution record for every supplied test case: per-step status,
overall case status, observed result, evidence reference, and defect reference
where a case failed.

### R — Review
Before returning, verify:
- No case is Passed without evidence for every step.
- Every Failed case has an observed actual result and a defect reference or an
  explicit "Defect not yet raised."
- Every Blocked case states what blocked it.
- Overall status is consistent with the worst per-step status.
```

---

## Filled Example

```text
### C — Context
- Product / module: VWO — Login Dashboard
- Build / version: 2026.11.15-rc1
- Environment: Chrome 141 / Windows 11 / desktop
- Execution window: 2026-11-15 09:10 → 10:25
- Test cases: VWO-LOGIN-TC-001, TC-002, TC-004
- Evidence: screenshots 01–06

### A — Action (output excerpt)
| TC ID | Step | Action | Expected | Status | Evidence |
| VWO-LOGIN-TC-001 | 1 | Open login URL | Login page loads | Passed | 01.png |
| VWO-LOGIN-TC-001 | 4 | Submit valid credentials | Dashboard opens | Passed | 02.png |
| VWO-LOGIN-TC-004 | 4 | Submit blank password | Submission blocked with validation | Failed | 04.png — form submitted, no message |
```

---

## Output Contract

| Section | Required | Shape |
|---|---|---|
| Execution Summary | Yes | Total / Passed / Failed / Blocked / Not Run / Skipped + pass rate |
| Step-Level Log | Yes | TC ID \| Step \| Action \| Expected \| Status \| Evidence |
| Case-Level Result | Yes | TC ID \| Overall Status \| Observed Result \| Defect Ref \| Notes |
| Failures | Yes (or "None") | TC ID \| Step \| Expected \| Actual \| Suggested Severity |
| Blockers | Yes (or "None") | TC ID \| What Blocked Execution \| Owner To Unblock |

Rules: no `Passed` without evidence; no invented defect IDs; summary counts must equal table rows.

---

## Self-Check

- [ ] Every supplied test case appears exactly once in the case-level result.
- [ ] Every `Passed` case has evidence against each of its steps.
- [ ] Every `Failed` case has a concrete observed actual result.
- [ ] Every `Blocked` case names the blocker and the owner who can unblock it.
- [ ] No status outside the five allowed values.
- [ ] Summary arithmetic matches the tables.

---

## SKILL.md Conversion

```yaml
---
name: test-case-execution
description: Produce an evidence-backed execution record — per-step log, case-level status, failures, and blockers — using only the supplied test cases and without inventing results. Use when running a test suite against a build.
---
```

Trigger phrases: "record execution results", "log test run", "execution report for this build", "run these test cases and record status".

Procedure for the skill body: load cases → execute/record per step → roll up case status → list failures → list blockers → verify no unearned Passed → self-check.

---

**Alternative:** If a failed case needs to become a filed defect, hand the failure row to `03-bug-report-CRISP.md`.
