# 17 — Test Coverage

> **Framework:** CLEAR
> **Use when:** You need to know how much of a feature, module, or codebase is actually covered — and what the uncovered part costs you.
> **Skip when:** You need requirement-level traceability for an audit — use `06-rtm-RICEPOT.md`.

---

## Prompt Template

```text
### C — Context
I need a coverage assessment for [PRODUCT / MODULE].
- Coverage type required: [FUNCTIONAL / CODE / API / RISK-BASED / MIXED]
- Source of truth: [REQUIREMENTS LIST / CODEBASE / ENDPOINT LIST]
- Existing tests: [PASTE TEST LIST OR COVERAGE REPORT]
- Coverage tool output: [PASTE — e.g. JaCoCo, Istanbul, coverage.py — OR "None supplied"]
- Known untestable areas: [PASTE OR "None"]
- Release criticality: [WHICH AREAS MUST BE COVERED]

### L — Limits
- Report only coverage you can derive from the supplied data. No estimates presented as fact.
- Distinguish line/branch coverage from behavioural coverage — they are not interchangeable.
- Do not count a test as covering an item unless the test actually asserts that item's behaviour.
- Do not propose new tests beyond a one-line pointer per gap.
- Do not report a single coverage percentage for the whole system if coverage varies by area — break it down.

### E — Examples
| Login | 12 requirements | 10 | 83% | 9 | 75% | Blank-password validation unasserted (GAP-02) |
| Payments | 20 requirements | 4 | 20% | 2 | 10% | Release-blocking: no refund path tested |

### A — Action
Produce an area-by-area coverage assessment with computed percentages, explicitly
separating requirement coverage from assertion coverage, and rank uncovered areas
by risk.

### R — Review
Check:
- Every percentage is computed from counted rows, not estimated.
- Requirement coverage and assertion coverage are reported separately.
- Release-critical uncovered areas are called out at the top.
- No test is credited with covering behaviour it never asserts.
- Limitations of the supplied data are stated plainly.
```

---

## Filled Example

```text
### C — Context
- Product / module: VWO — Login
- Coverage type: Functional (requirements-based)
- Source of truth: 4 approved login requirements
- Tests: VWO-LOGIN-TC-001 to TC-012
- Tool output: None supplied

### A — Action (output excerpt)
| Login | 4 | 3 | 75% | 1 | 25% | REQ-003 has no asserting test; TC-004 asserts presence only, not blocking |
| Login — validation | 2 | 1 | 50% | 0 | 0% | Both validation requirements lack an assertion |

**Risk ranking:** (1) Validation coverage 0% assertion — blocks release gate.
(2) REQ-003 access control unverified.

**Limitations:** No coverage tool output supplied; these figures are requirement-based,
not line or branch coverage.
```

---

## Output Contract

| Section | Required | Shape |
|---|---|---|
| Coverage Scope and Method | Yes | Type, source of truth, limitation statement |
| Coverage by Area | Yes | Area \| Items \| With Tests \| Req Coverage % \| With Assertions \| Assertion Coverage % \| Notes |
| Risk-Ranked Uncovered Areas | Yes | Rank \| Area \| Gap \| Risk \| Pointer |
| Release-Critical Assessment | Yes | Which uncovered areas block release and why |
| Coverage Limitations | Yes | What this measurement cannot tell you |
| Summary | Yes | Overall figures, stated as ranges if heterogeneous |

Rules: percentages computed from counts; requirement coverage and assertion coverage never merged into one number; every uncovered release-critical area appears in the risk ranking.

---

## Self-Check

- [ ] Every percentage recomputed from the row counts.
- [ ] Requirement coverage and assertion coverage reported as distinct columns.
- [ ] No test credited for behaviour it does not assert.
- [ ] Risk ranking puts release-critical gaps first.
- [ ] Measurement limitations stated explicitly.
- [ ] No single misleading whole-system percentage.
- [ ] Suggestions limited to pointers, not full test designs.

---

## SKILL.md Conversion

```yaml
---
name: test-coverage-assessment
description: Assess functional, code, or API coverage area by area, separating requirement coverage from assertion coverage, ranking uncovered areas by risk, and stating measurement limits. Use when judging whether testing is sufficient before release.
---
```

Trigger phrases: "test coverage report", "how much is covered", "coverage gaps for this module", "are we covered enough to release".

Procedure for the skill body: confirm coverage type → enumerate items → map tests → verify assertions → compute both percentages → risk rank gaps → release-critical callout → limitations → self-check.

---

**Alternative:** If the question is traceability rather than sufficiency, `06-rtm-RICEPOT.md` produces the auditable requirement-to-test-to-defect matrix instead.
