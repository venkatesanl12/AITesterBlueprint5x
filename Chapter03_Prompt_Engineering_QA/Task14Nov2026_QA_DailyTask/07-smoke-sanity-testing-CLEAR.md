# 07 — Smoke and Sanity Testing

> **Framework:** CLEAR
> **Use when:** A build has landed and you need a fast go/no-go verdict — either broad smoke on a new build, or narrow sanity on a specific fix.
> **Skip when:** You need full functional confirmation — use `04-test-case-execution-CLEAR.md` or `09-regression-testing-STAR.md`.

---

## Prompt Template

```text
### C — Context
A [NEW BUILD / HOTFIX / CONFIG CHANGE] has landed and I need a [SMOKE / SANITY]
verdict before [FURTHER TESTING / RELEASE / HANDOVER].
- Product / module: [PRODUCT, MODULE]
- Build / version: [BUILD ID]
- Environment: [URL, BROWSER, OS]
- Time budget: [N MINUTES]
- Change summary: [WHAT CHANGED — required for sane sanity scope]
- Critical paths known: [LOGIN, CHECKOUT, SEARCH, ...]

### L — Limits
- Smoke scope: critical paths only, breadth over depth. Maximum [N] checks.
- Sanity scope: the changed area plus its immediate dependents only. Do not widen.
- Each check must be a single, binary pass/fail assertion.
- No exploratory testing, no edge cases, no boundary values.
- If a critical path is not testable in the stated time, say so — do not silently drop it.
- Do not mark anything Passed without an observable result.

### E — Examples
| SMK-01 | Login | Valid user reaches dashboard | Passed | 00:40 |
| SMK-02 | Search | Results return for a known term | Failed | 01:10 — spinner never resolved |
| SAN-01 | Login (changed) | Fixed validation message displays on blank password | Passed | 00:35 |

### A — Action
Produce the checklist, the verdict, and the blocking issues. The verdict is
GO only if every critical path check passed.

### R — Review
Confirm:
- Every check is binary and independently verifiable.
- The verdict is consistent with the individual results.
- Any failure is classified as blocking or non-blocking with a reason.
- Total estimated time is within the stated budget.
```

---

## Filled Example

```text
### C — Context
- Product / module: VWO — Login Dashboard
- Build / version: 2026.11.15-rc1
- Environment: Chrome 141 / Windows 11
- Time budget: 15 minutes
- Change summary: Login validation fix for blank password (DEF-101)
- Critical paths known: Login, Dashboard load, Logout

### L — Limits: Smoke scope, maximum 6 checks; sanity on the changed area only.

### A — Action (output excerpt)
| SAN-01 | Login | Blank password shows validation and blocks submit | Passed | 00:35 |
| SAN-02 | Login | Valid login still succeeds (regression of the fix area) | Passed | 00:40 |

**Verdict: GO for further testing.** 2/2 sanity checks passed; fix area is stable.
```

---

## Output Contract

| Section | Required | Shape |
|---|---|---|
| Scope Statement | Yes | Smoke or Sanity + what is in/out |
| Checklist | Yes | ID \| Area \| Check \| Binary Expected | Status \| Duration |
| Verdict | Yes | GO / NO-GO / CONDITIONAL + one-line reason |
| Blocking Issues | Yes (or "None") | Check ID \| Observed \| Why Blocking \| Owner |
| Time Used vs Budget | Yes | Actual / Budget |

Rules: verdict must be derivable from the checklist; every failure classified; no check without a binary expectation.

---

## Self-Check

- [ ] Every check has a binary expected result — no "works correctly".
- [ ] Smoke stayed at critical-path breadth; sanity stayed inside the change area.
- [ ] Verdict matches the results with no contradiction.
- [ ] Each failure is labelled blocking or non-blocking with a reason.
- [ ] Total duration is within or explicitly over budget.
- [ ] No exploratory or edge-case checks smuggled in.

---

## SKILL.md Conversion

```yaml
---
name: smoke-sanity-testing
description: Produce a time-boxed smoke or sanity checklist with binary pass/fail checks, a go/no-go verdict, and classified blocking issues. Use when a new build or hotfix needs a fast readiness decision.
---
```

Trigger phrases: "smoke test this build", "sanity check the fix", "go no-go", "is this build testable".

Procedure for the skill body: confirm smoke vs sanity → bound scope and time → build binary checklist → execute/record → classify failures → issue verdict → self-check.

---

**Alternative:** If you need assurance that nothing else broke, follow the verdict with `09-regression-testing-STAR.md`.
