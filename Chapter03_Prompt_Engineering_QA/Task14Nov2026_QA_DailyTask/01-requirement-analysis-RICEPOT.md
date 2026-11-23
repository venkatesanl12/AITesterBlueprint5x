# 01 — Requirement Analysis

> **Framework:** RICE-POT
> **Use when:** You have a PRD, user story, Jira ticket, or client email and need to turn it into requirements you can actually test.
> **Skip when:** The requirement is already decomposed and you only need cases — go to `02-test-case-design-RICEPOT.md`.

---

## Prompt Template

```text
### R — Role
You are a senior QA analyst with 12+ years of experience reviewing requirements
for testability. You challenge ambiguity and never fill gaps with assumptions.

### I — Instructions
1. Read every supplied requirement source in full before writing anything.
2. Extract each discrete, verifiable requirement as one row.
3. Assign a stable ID in the form REQ-<AREA>-<NNN>.
4. Classify each requirement as Functional, Non-Functional, Data, Security, or Business Rule.
5. For each requirement, cite the exact source (document name + section/clause).
6. Mark each requirement Testable: Yes, No, or Partial, with a one-line reason.
7. List only the acceptance criteria the source states explicitly. Do not author new ones.
8. Record every ambiguity, contradiction, and missing detail in a separate gap register.
9. Raise no more than 10 clarifying questions, highest-impact first.

Do NOT:
- Invent requirements that are not in the supplied sources.
- Assume "typical", "standard", or "common sense" behaviour.
- Rewrite the business intent of a requirement while restating it.

### C — Context
- Product / module: [PRODUCT NAME, MODULE]
- Sources supplied: [PRD section, user story, Jira ticket, email, screenshot]
- Known constraints: [release window, platform, regulatory]

### E — Example
| REQ-001 | Users can log in with a registered email and password | PRD §4.2 Login | Functional | Yes | Successful login opens the dashboard | — |

### P — Parameters
- Output must be deterministic: same input, same output.
- Every requirement row must cite a source. No source, no row.
- If a detail is missing, respond exactly: "Insufficient information to determine."
- If you deduce something, label it exactly: "Inference (low confidence)".
- Never invent field names, validation text, error codes, limits, or SLAs.
- Requirement statements must be single-sentence and objectively verifiable.

### O — Output
Return Markdown, in this order and with these exact columns:
1. **Requirement Register** — Req ID | Requirement Statement | Source | Type | Testable | Acceptance Criteria | Notes
2. **Gap Register** — GAP ID | Area | Missing / Ambiguous Detail | Why It Blocks Testing | Impact | Owner
3. **Contradictions** — ID | Requirement A | Requirement B | Conflict
4. **Clarifying Questions** — numbered, each tied to a GAP ID
5. **Analysis Summary** — total requirements, testable, partial, not testable, open gaps

### T — Tone
Factual and precise. No praise, no filler, no restating of the prompt.
```

---

## Filled Example

```text
### C — Context
- Product / module: VWO — Login Dashboard
- Sources supplied: PRD §4 Authentication (login only)
- Known constraints: none supplied

### O — Output (excerpt)
| REQ-001 | Registered users log in with a valid email and password | PRD §4.1 | Functional | Yes | Authenticated dashboard opens after submit | — |
| REQ-002 | Email and password are mandatory fields | PRD §4.2 | Functional | Yes | Submit is rejected when either field is empty | Exact validation message not supplied |
| REQ-003 | Invalid credentials must not grant access | PRD §4.3 | Security | Partial | Access is denied | Error text not specified — GAP-02 |
```

---

## Output Contract

| Section | Required | Shape |
|---|---|---|
| Requirement Register | Yes | Markdown table, 7 columns, stable IDs |
| Gap Register | Yes | Markdown table, 6 columns, every gap ID prefixed `GAP-` |
| Contradictions | Yes (may say "None identified") | Markdown table, 4 columns |
| Clarifying Questions | Yes | Numbered list, each referencing a GAP ID |
| Analysis Summary | Yes | Counts only |

Rules: no requirement without a source; no acceptance criterion invented; every `Partial` or `No` testability verdict must map to at least one gap.

---

## Self-Check

- [ ] Every row cites a real source section from the supplied material.
- [ ] No requirement appears that was not stated in the source.
- [ ] Every `Partial` / `No` testability row links to a GAP ID.
- [ ] Gaps describe *what is missing*, not a guess at the answer.
- [ ] Questions are answerable by a product owner, not by another AI run.
- [ ] Summary counts match the table row counts exactly.

---

## SKILL.md Conversion

```yaml
---
name: requirement-analysis
description: Analyse a PRD, user story, or ticket and produce a traceable requirement register with a gap register, contradictions, and clarifying questions. Use when requirements must be understood or challenged before test design.
---
```

Trigger phrases: "analyse these requirements", "requirement review", "is this testable", "extract requirements from this PRD", "what's missing in this story".

Procedure for the skill body: read all sources → requirement register → gap register → contradictions → questions → summary → run self-check.

---

**Alternative:** If the source is authoritative and unambiguous and you only need to prove coverage, use `06-rtm-RICEPOT.md` instead of a full analysis pass.
