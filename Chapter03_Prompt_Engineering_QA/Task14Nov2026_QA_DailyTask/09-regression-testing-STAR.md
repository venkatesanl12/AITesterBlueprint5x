# 09 — Regression Testing

> **Framework:** STAR
> **Use when:** You need a risk-based regression suite for a release, sprint, or change, with selection rationale and a defensible scope.
> **Skip when:** You only need a quick readiness verdict — use `07-smoke-sanity-testing-CLEAR.md`.

---

## Prompt Template

```text
### S — Situation
I am preparing regression testing for [PRODUCT] release [VERSION].
- Change summary since last release: [PASTE CHANGELOG / FIXED DEFECTS / FEATURES]
- Modules affected: [MODULES]
- Modules NOT changed but business-critical: [MODULES]
- Existing suite size: [N CASES]
- Available time: [N DAYS / N TESTER-HOURS]
- Historical defect hotspots: [AREAS WITH PAST DEFECTS]
- Environment: [URL, BROWSER/OS MATRIX, BUILDS]

### T — Task
Build a prioritised regression suite that fits the available time, covering
(i) everything the change touched, (ii) all business-critical paths,
(iii) historical defect hotspots. State what will NOT be covered and the risk
of that exclusion.

### A — Action
1. Classify every candidate area as Tier 1 (must run), Tier 2 (should run), or Tier 3 (optional).
2. Select cases per tier, respecting the time budget. Estimate time per case.
3. Justify each Tier 1 inclusion by change impact, criticality, or defect history.
4. Identify dependencies and data setup per area.
5. Define entry criteria (what must be true to start) and exit criteria (what must be true to sign off).
6. List excluded areas with the residual risk each exclusion creates.
7. Recommend the execution order — highest risk first.

Do NOT:
- Assume an area is safe because it was not in the changelog.
- Invent historical defect data.
- Present a suite that exceeds the stated time budget without flagging the overrun.
- Omit exit criteria.

### R — Result
Return:
1. **Scope and Coverage Rationale** — what is in and why
2. **Regression Suite** — Tier \| Area \| Case IDs \| Purpose \| Time \| Data Setup \| Priority
3. **Excluded Areas and Residual Risk** — Area \| Reason Excluded \| Risk If It Breaks \| Accepting Owner
4. **Entry Criteria**
5. **Exit Criteria**
6. **Execution Order** — numbered, risk-first
7. **Time Budget vs Estimate** — per tier and total

Tone: structured planning language. Tables where useful. Label anything you
propose as a recommendation.
```

---

## Filled Example

```text
### S — Situation
- Release: VWO 2026.11 | Change: login validation fix (DEF-101), dashboard filter change
- Time: 2 tester-days | Hotspots: login (3 defects last cycle)

### A — Action (output excerpt)
| Tier 1 | Login | TC-001–TC-012 | Changed area + top defect hotspot | 3.5h | Registered accounts | P1 |
| Tier 1 | Dashboard | TC-030–TC-038 | Changed filter logic | 2.5h | Seeded dataset | P1 |
| Tier 2 | Reports | TC-060–TC-065 | Consumes dashboard filters | 2.0h | Seeded dataset | P2 |
| Tier 3 | Settings | TC-090–TC-092 | Unchanged, low traffic | 1.0h | Default account | P3 |

### Excluded: Billing | No change, previous cycle fully green | Revenue loss if broken | QA Lead accepts
### Exit Criteria: all Tier 1 passed; no open Critical; ≤2 open High with accepted workarounds.
```

---

## Output Contract

| Section | Required | Shape |
|---|---|---|
| Scope and Coverage Rationale | Yes | Bullets tied to change, criticality, history |
| Regression Suite | Yes | Table, 7 columns, tiered |
| Excluded Areas and Residual Risk | Yes (or "None") | Table, 4 columns, named risk acceptor |
| Entry Criteria | Yes | Checklist |
| Exit Criteria | Yes | Checklist |
| Execution Order | Yes | Numbered, risk-first |
| Time Budget vs Estimate | Yes | Per tier + total |

Rules: every Tier 1 row justified; exclusions must name an accepting owner; total estimate must be compared against the budget explicitly.

---

## Self-Check

- [ ] Every changed area appears in Tier 1.
- [ ] All business-critical paths are represented regardless of change status.
- [ ] Hotspot areas are included or their exclusion is justified and risk-accepted.
- [ ] Time estimate totals against the budget, with overrun flagged.
- [ ] Exit criteria are objectively checkable.
- [ ] No invented historical defect data.

---

## SKILL.md Conversion

```yaml
---
name: regression-testing
description: Build a risk-based, time-budgeted regression suite with tiers, inclusion justification, excluded-area residual risk, entry and exit criteria, and a risk-first execution order. Use when planning regression for a release or sprint.
---
```

Trigger phrases: "plan regression testing", "regression suite for this release", "what should we re-test", "regression scope".

Procedure for the skill body: gather change + criticality + history → tier candidates → select within budget → justify → exclusions with risk → entry/exit → order → budget check → self-check.

---

**Alternative:** If the change is tiny and contained, `07-smoke-sanity-testing-CLEAR.md` may give you the same confidence far cheaper.
