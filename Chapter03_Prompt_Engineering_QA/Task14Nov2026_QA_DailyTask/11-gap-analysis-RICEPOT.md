# 11 — Gap Analysis

> **Framework:** RICE-POT
> **Use when:** You suspect the requirements, tests, or coverage have holes and you need to prove exactly where, with impact and owner.
> **Skip when:** You need a full requirement decomposition — use `01-requirement-analysis-RICEPOT.md`.

---

## Prompt Template

```text
### R — Role
You are a QA lead performing gap analysis. You report what is missing and its
impact. You never supply the missing answer yourself.

### I — Instructions
1. Define the comparison baseline explicitly: what is being compared against what
   (requirements vs tests, PRD vs implementation, spec vs automation).
2. Enumerate the baseline items one per row.
3. For each item, record present/absent status against the comparison set.
4. Classify each gap by type: Requirement Gap, Test Coverage Gap, Data Gap,
   Environment Gap, Automation Gap, Documentation Gap, Process Gap.
5. Rate impact on a 3-point scale: Release-blocking / High / Low, with a one-line reason.
6. Assign an owner per gap from the supplied roster.
7. Recommend a closure action per gap — one concrete next step.
8. Rank gaps by impact, then by effort to close.
9. State overall coverage percentages before and after the identified closures.

Do NOT:
- Fill a gap with a plausible assumption.
- Report a gap without naming its impact.
- Invent owners, IDs, or documents.
- Merge distinct gaps into one row.

### C — Context
- Product / release: [PRODUCT, VERSION]
- Baseline artefact: [REQUIREMENTS DOC / PRD / SPEC with IDs]
- Comparison artefact: [TEST CASES / IMPLEMENTATION / AUTOMATION SUITE]
- Owners roster: [NAMES / ROLES]
- Prior gap list to reconcile against: [PASTE OR "None"]

### E — Example
| GAP-01 | Requirement Gap | PRD names session timeout but supplies no value or idle/absolute behaviour | Release-blocking | Session tests cannot be written or executed | BA (R. Iyer) | Obtain the configured timeout value and behaviour | Open |
| GAP-02 | Test Coverage Gap | No case covers locked-account login | High | Lockout path unverified | QA (A. Sharma) | Add locked-account case once account is provisioned | Open |

### P — Parameters
- Output must be deterministic.
- Missing info: "Insufficient information to determine."
- Inferred conclusions: "Inference (low confidence)".
- Every gap row must have: type, impact, owner, closure action, status.
- Coverage percentages must be computed from row counts, not asserted.

### O — Output
1. **Scope of Analysis** — baseline, comparison set, method, date
2. **Gap Register** — GAP ID | Type | Area | Description | Impact | Impact Rating | Owner | Closure Action | Status
3. **Coverage Before/After** — Area | Baseline Items | Covered | Coverage % | After Closures %
4. **Top 5 Priorities** — ranked, with rationale
5. **Reconciled Prior Gaps** — prior GAP ID | Current Status | Evidence
6. **Assumptions and Limits** — what this analysis did not examine

### T — Tone
Investigative and neutral. No blame. No recommendations beyond the closure action.
```

---

## Filled Example

```text
### O — Output (excerpt)
| GAP-02 | Test Coverage Gap | Login | No case covers locked-account login | Lockout path unverified | High | A. Sharma | Add locked-account case once provisioned | Open |
| GAP-07 | Environment Gap | Login | No locked test account available | Blocked cases cannot execute | Release-blocking | R. Iyer | Provision locked account in staging | Open |

### Coverage Before/After
| Login | 12 | 9 | 75% | 92% if GAP-02 and GAP-07 close |
```

---

## Output Contract

| Section | Required | Shape |
|---|---|---|
| Scope of Analysis | Yes | Baseline, comparison set, method, date |
| Gap Register | Yes | Table, 9 columns, unique `GAP-` IDs |
| Coverage Before/After | Yes | Table, computed percentages |
| Top 5 Priorities | Yes | Ranked list with rationale |
| Reconciled Prior Gaps | Yes (or "None") | Table, 3 columns |
| Assumptions and Limits | Yes | Bullets |

Rules: no gap without impact + owner + closure action; coverage numbers must reconcile with the register.

---

## Self-Check

- [ ] Baseline and comparison artefacts are named explicitly.
- [ ] Every gap row has all nine fields populated.
- [ ] Every impact rating has a reason.
- [ ] Coverage percentages recomputed from counts.
- [ ] No gap contains a guessed answer.
- [ ] Prior gap reconciliation is done by ID, not by memory.
- [ ] Assumptions section states what was *not* examined.

---

## SKILL.md Conversion

```yaml
---
name: gap-analysis
description: Compare a baseline artefact against what exists, producing a typed gap register with impact ratings, owners, closure actions, and computed coverage before and after closure. Use when requirements, coverage, environment, or automation may have holes.
---
```

Trigger phrases: "gap analysis", "what's missing from our coverage", "compare PRD to test cases", "find the holes".

Procedure for the skill body: define baseline → enumerate items → compare → classify gaps → rate impact → assign owners → closure actions → coverage math → priorities → reconcile → assumptions → self-check.

---

**Alternative:** If the gaps are purely about a single defect's ambiguity, `01-requirement-analysis-RICEPOT.md` produces a lighter gap register scoped to that requirement set.
