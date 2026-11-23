# 02 — Test Case Design

> **Framework:** RICE-POT
> **Use when:** You need executable, traceable test cases from an approved requirement set.
> **Skip when:** Requirements are still ambiguous — run `01-requirement-analysis-RICEPOT.md` first.

---

## Prompt Template

```text
### R — Role
You are a senior QA engineer who writes test cases a new team member could
execute without asking a single question.

### I — Instructions
1. Use ONLY the supplied requirements. Treat them as the complete source of truth.
2. Assign test case IDs in the form <PROJECT>-<MODULE>-TC-<NNN>, sequentially with no gaps.
3. Cover, in this order: positive path, negative path, boundary, access control, data validation.
4. Write numbered steps that a tester can follow literally, one action per step.
5. Write expected results as observable behaviour, never as "should work correctly".
6. Record the requirement each case verifies in a traceability column.
7. Classify each case as Verified, Inference (low confidence), or Blocked.
8. For any Blocked case, cite the GAP ID that blocks it.

Do NOT:
- Invent validation messages, password rules, session timeouts, or limits.
- Merge two checks into one test case.
- Mark any case Passed or Failed — execution has not happened.
- Create cases for features the requirements do not mention.

### C — Context
- Product / module: [PRODUCT, MODULE]
- Requirements supplied: [PASTE APPROVED REQUIREMENTS]
- Existing test cases to avoid duplicating: [PASTE OR "None"]
- Environment: [URL, BROWSER, BUILD]

### E — Example
| VWO-LOGIN-TC-001 | REQ-001 | Login with valid registered credentials | Registered account exists; user logged out | 1) Open the login URL. 2) Enter registered email. 3) Enter valid password. 4) Submit. | Authenticated dashboard opens | P1 | Positive | Verified |

### P — Parameters
- Output must be deterministic: same input, same output.
- Every case must trace to exactly one supplied requirement.
- If expected behaviour is unstated, write exactly: "Insufficient information to determine." and cite the GAP ID.
- If you infer behaviour, prefix with exactly: "Inference (low confidence)".
- Use placeholders <registered_email>, <valid_password>. Never write real credentials.
- Keep exactly [N] test cases unless coverage truly requires more — then state why.

### O — Output
Return Markdown, in this order:
1. **Coverage Map** — Requirement ID | Verifying Test Case IDs | Coverage (Covered / Partial / Not Covered)
2. **Test Cases** — TC ID | Req ID | Summary | Precondition | Test Data | Steps | Expected Result | Priority | Type | Confidence
3. **Blocked Cases** — TC ID | Blocking GAP ID | What Is Missing
4. **Design Notes** — assumptions avoided, coverage gaps, cases deliberately excluded

### T — Tone
Instructional and unambiguous. Steps in imperative voice. No hedging language.
```

---

## Filled Example

```text
### O — Output (excerpt)
| VWO-LOGIN-TC-001 | REQ-001 | Login with valid registered credentials | Registered account exists; user logged out | <registered_email>, <valid_password> | 1) Open https://app.vwo.com/. 2) Enter registered email. 3) Enter valid password. 4) Submit the form. | Authenticated dashboard opens | P1 | Positive | Verified |
| VWO-LOGIN-TC-004 | REQ-002 | Submit with empty password | Account exists; user logged out | <registered_email>, (blank password) | 1) Open URL. 2) Enter email. 3) Leave password blank. 4) Submit. | Insufficient information to determine. (GAP-02: validation message and blocked-submit behaviour not specified.) | P1 | Negative | Blocked |
```

---

## Output Contract

| Section | Required | Shape |
|---|---|---|
| Coverage Map | Yes | Table, 3 columns, one row per requirement |
| Test Cases | Yes | Table, 10 columns, fixed order, unique sequential IDs |
| Blocked Cases | Yes (may be "None") | Table, 3 columns |
| Design Notes | Yes | Short bullets |

Rules: no case without a `Req ID`; `Type` limited to Positive / Negative / Boundary / Security / Access Control; `Confidence` limited to the three allowed values; `Priority` limited to P1–P4.

---

## Self-Check

- [ ] Every requirement in the coverage map has at least one case or is marked Not Covered.
- [ ] No two cases test the identical check.
- [ ] Steps are literal — no "verify appropriate behaviour" phrasing.
- [ ] Expected results describe something a tester can observe on screen or in a response.
- [ ] No case marked Passed or Failed.
- [ ] All credentials are placeholders.
- [ ] Blocked cases each cite a GAP ID and say what is missing.

---

## SKILL.md Conversion

```yaml
---
name: test-case-design
description: Generate traceable, executable test cases from approved requirements, with a coverage map, blocked-case register, and anti-hallucination labels. Use when designing functional test cases for a module or ticket.
---
```

Trigger phrases: "write test cases for", "design tests for this story", "generate functional test cases", "cover this requirement".

Procedure for the skill body: read requirements → coverage map → cases in positive/negative/boundary/access order → blocked register → design notes → self-check.

---

**Alternative:** If the module is endpoint-driven, use `12-ui-api-testing-CLEAR.md` so request/response assertions replace screen steps.
