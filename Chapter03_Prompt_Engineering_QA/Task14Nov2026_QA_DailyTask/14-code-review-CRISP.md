# 14 — Code Review

> **Framework:** CRISP
> **Use when:** You are reviewing application or test code and need a structured, prioritised review rather than a list of opinions.
> **Skip when:** You are reviewing a pull request end-to-end including merge mechanics — use `16-pr-merge-review-CRISP.md`.

---

## Prompt Template

```text
### C — Context
Review this code for [PURPOSE — production feature / test automation / utility].
- Repository / module: [REPO, PATH]
- Language / framework: [LANGUAGE, FRAMEWORK, VERSION]
- The change claims to: [ONE-LINE INTENT]
- Coding standards supplied: [LINT CONFIG / STYLE GUIDE / "None"]
- Test coverage for this change: [TEST FILE PATHS / "None supplied"]
- Risk level: [LOW / MEDIUM / HIGH — justifies scrutiny depth]

### R — Role
Act as a senior engineer performing a constructive, evidence-based review. You
cite line numbers. You separate defects from preferences.

### I — Instructions
1. Read the whole change before commenting. Do not review line by line in isolation.
2. Classify every finding as: Blocker | Bug | Security | Performance | Maintainability | Style | Nit.
3. Cite the file and line for every finding. No finding without a location.
4. State the concrete consequence of each finding — what breaks or degrades.
5. Propose a minimal fix per finding. Do not rewrite the design unless it is a Blocker.
6. Distinguish objective defects from personal preference and label preferences as such.
7. Check for: null/undefined handling, error paths, resource cleanup, input validation, hardcoded secrets, and test determinism.
8. Comment on test quality separately: do the tests actually prove the behaviour?
9. Give one overall verdict with reasoning.

Do NOT:
- Invent lines, functions, or files that are not in the supplied code.
- Rewrite unrelated code.
- Praise without specifics, or criticise without a fix.
- Mark style issues as blockers.

### S — Style
Direct and specific. Finding → consequence → fix. No hedging. No praise padding.

### P — Parameters
- One finding per row, no bundling.
- Severity order: Blocker, Bug, Security, Performance, Maintainability, Style, Nit.
- If the code is truncated or a file is missing, state exactly what you could not review.
- If a finding relies on runtime behaviour you cannot see, label it "Inference (low confidence)".
```

---

## Filled Example

```text
### I — Instructions (output excerpt)
| 1 | Blocker | LoginTest.java:47 | Password read from a hardcoded string literal | Credential leaks into the repository and every CI log | Move to env var / config and inject |
| 2 | Bug | LoginTest.java:63 | Assertion checks element presence, not dashboard URL | Test passes on failed login, hiding DEF-101 | Assert on the post-login URL |
| 3 | Maintainability | LoginTest.java:88 | Locator duplicated in three methods | One UI change breaks three tests silently | Extract a page-object method |
| 4 | Nit | LoginTest.java:12 | Inconsistent import ordering | None functional | Align to project lint config |
```

---

## Output Contract

| Section | Required | Shape |
|---|---|---|
| Review Scope | Yes | What was reviewed, what was not, files/lines covered |
| Findings | Yes | # \| Category \| Location \| Finding \| Consequence \| Suggested Fix |
| Test Quality Assessment | Yes | Do the tests prove the behaviour? Gaps listed |
| Security and Secrets | Yes (or "None found") | Explicit statement |
| Verdict | Yes | Approve / Approve with comments / Request changes + reason |

Rules: every finding has a file:line; every finding has a consequence; classifications from the fixed list; style findings never marked Blocker.

---

## Self-Check

- [ ] Every finding cites a real file and line from the supplied code.
- [ ] Every finding states a consequence, not just a preference.
- [ ] Blockers are genuinely blocking; nits are genuinely minor.
- [ ] Hardcoded secrets, if present, are flagged as Blocker.
- [ ] Test quality assessed separately from production code quality.
- [ ] Anything outside the supplied diff is declared as not reviewed.
- [ ] Verdict matches the severity mix.

---

## SKILL.md Conversion

```yaml
---
name: code-review
description: Perform a structured code review with located, classified, prioritised findings, consequences, minimal fixes, separate test-quality assessment, and a clear verdict. Use when reviewing application or automation code.
---
```

Trigger phrases: "review this code", "code review for this change", "is this test code good", "check for issues in this file".

Procedure for the skill body: read whole change → scope declaration → findings by category → test quality → secrets check → verdict → self-check.

---

**Alternative:** If the review must also decide whether to merge, and includes CI, branch, and checklist gates, use `16-pr-merge-review-CRISP.md`.
