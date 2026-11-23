# 03 — Bug Report

> **Framework:** CRISP
> **Use when:** You found a defect and need a report a developer can reproduce without asking you anything.
> **Skip when:** You are logging many defects at once — use `05-defect-tracking-CRISP.md`.

---

## Prompt Template

```text
### C — Context
Assume I observed the following defect:
- Product / module: [PRODUCT, MODULE]
- Requirement being violated: [REQ ID + SHORT STATEMENT]
- Starting state: [logged out / specific account / specific data]
- Action performed: [EXACT STEPS I TOOK]
- Observation: [WHAT I SAW]
- Reproducibility: [N out of M attempts]
- Environment: browser + version, OS, build/version, date-time — or "Not supplied"
- Evidence: screenshots, video, console logs, network trace, HAR — or "Not provided"

### R — Role
Act as a senior QA engineer writing a clear, reproducible defect report for a
developer who has never seen this issue.

### I — Instructions
1. Write a title in the form: [Area] — [Action] — [Observed problem]. Max 120 characters.
2. State the environment. If a detail was not supplied, write "Not supplied."
3. Describe preconditions precisely enough to recreate the starting state.
4. Write reproduction steps numbered, one action per step, no compound actions.
5. State the expected result, anchored to the violated requirement.
6. State the actual result as pure observation — what appeared, what did not.
7. Record reproducibility as N/M with attempts described.
8. Propose a severity and a priority, each with a one-line rationale.
9. Separate observed behaviour from anything you suspect.
10. List attachments, or write "Not provided."

Do NOT:
- Invent the exact validation message, error code, or log entry.
- Merge two defects into one report.
- Assert root cause — you observed behaviour, you did not diagnose code.
- State severity as final if the requirement is ambiguous; label it provisional.

### S — Style
Concise, factual, numbered. Present tense for observed behaviour. No adjectives
like "bad", "broken", "weird". A developer should reproduce it in one read.

### P — Parameters
- Produce one bug report.
- Maximum 500 words.
- Use <placeholders> for all account identifiers and credentials.
- Missing environment fields: "Not supplied." Missing evidence: "Not provided."
- Severity scale: Critical / High / Medium / Low. Priority scale: P1 / P2 / P3 / P4.
- If expected behaviour is not defined by a requirement, prefix with exactly:
  "Insufficient information to determine." and name the gap.
```

---

## Filled Example

```text
### C — Context
- Product / module: VWO — Login Dashboard
- Requirement being violated: REQ-002 Email and password are mandatory
- Starting state: User logged out
- Action performed: Entered registered email, left password empty, submitted the form
- Observation: Form submitted; no visible validation feedback appeared
- Reproducibility: 3 out of 3 attempts
- Environment: Not supplied
- Evidence: Not provided

### I — Instructions (output excerpt)
**Title:** Login — Submit with empty password — No validation feedback shown

**Expected Result:** Per REQ-002, password is mandatory; submission with an empty
password should be rejected and the user should see validation feedback. Exact
validation message: Insufficient information to determine. (GAP-02)

**Actual Result:** The form submitted and no visible validation feedback was
displayed anywhere on the page.

**Severity:** High (provisional) — mandatory-field enforcement appears absent,
allowing malformed submissions. Severity is provisional because the required
validation behaviour is not fully specified.
```

---

## Output Contract

| Section | Required | Notes |
|---|---|---|
| Title | Yes | `[Area] — [Action] — [Problem]`, ≤120 chars |
| Environment | Yes | "Not supplied." where unknown |
| Preconditions | Yes | Enough to recreate state |
| Test Data | Yes | Placeholders only |
| Steps to Reproduce | Yes | Numbered, atomic |
| Expected Result | Yes | Tied to a requirement ID |
| Actual Result | Yes | Observation only |
| Reproducibility | Yes | `N/M` |
| Severity + rationale | Yes | Mark provisional if requirement is unclear |
| Priority + rationale | Yes | — |
| Attachments | Yes | Or "Not provided." |

---

## Self-Check

- [ ] Title follows the three-part form and fits 120 characters.
- [ ] Every step is a single action.
- [ ] Expected result cites the requirement it comes from.
- [ ] Actual result contains no diagnosis or root-cause claim.
- [ ] Severity has a rationale and is marked provisional if the requirement is vague.
- [ ] No real credentials, emails, or customer data appear.
- [ ] Word count is under 500.

---

## SKILL.md Conversion

```yaml
---
name: bug-report
description: Write a concise, reproducible bug report with environment, numbered steps, expected vs actual, reproducibility, and provisional severity with rationale. Use when a defect has been observed and must be filed.
---
```

Trigger phrases: "write a bug report", "log this defect", "file a bug for this", "create a Jira bug".

Procedure for the skill body: collect context → title → environment → preconditions → steps → expected → actual → reproducibility → severity/priority → attachments → self-check.

---

**Alternative:** If the defect must be tied to a PRD clause with full traceability, pair this with `01-requirement-analysis-RICEPOT.md` to generate the requirement IDs this report cites.
