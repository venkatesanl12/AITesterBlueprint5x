# 16 — PR Merge / Review

> **Framework:** CRISP
> **Use when:** You are the reviewer or approver on a pull request and must decide merge readiness using gates, not impressions.
> **Skip when:** You only need code-quality feedback — use `14-code-review-CRISP.md`.

---

## Prompt Template

```text
### C — Context
Assess whether this pull request is ready to merge.
- Repository / branch: [REPO, SOURCE BRANCH → TARGET BRANCH]
- PR title / description: [PASTE]
- Linked tickets: [JIRA / ISSUE IDs]
- Files changed: [PASTE FILE LIST OR DIFF]
- CI status: [PASSED / FAILED / NOT RUN — with job names]
- Test evidence: [UNIT / INTEGRATION / E2E RESULTS, OR "None supplied"]
- Reviewers assigned: [NAMES]
- Merge policy: [REQUIRED APPROVALS, REQUIRED CHECKS]

### R — Role
Act as the approver accountable for the merge. You approve only what is provable
from the supplied evidence.

### I — Instructions
1. Verify the change does what the linked ticket says — nothing more, nothing less.
2. Run the merge gate checklist below and mark each item Pass / Fail / Unknown.
3. Identify scope creep: any change unrelated to the linked ticket.
4. Confirm tests exist for new behaviour and that CI actually ran them.
5. Check for secrets, debug logging, commented-out code, and leftover TODOs.
6. Check that migration/config changes are reversible and documented.
7. Verify the PR description would let a future reader understand *why*.
8. State the decision using only: Approve / Approve with follow-ups / Request changes / Block.
9. For every Fail or Unknown gate, state exactly what evidence is needed.

Do NOT:
- Approve on "looks fine" without gate evidence.
- Assume CI passed — if status was not supplied, the gate is Unknown.
- Expand the review into unrelated refactoring suggestions.
- Invent linked tickets or test results.

### S — Style
Checklist-driven, terse, verdict-first. One line per gate item.

### P — Parameters
- Gate statuses limited to: Pass / Fail / Unknown.
- Decision limited to: Approve / Approve with follow-ups / Request changes / Block.
- Unknown gates cannot be treated as Pass.
- If the diff is truncated, state precisely which files were not reviewed.
```

---

## Filled Example

```text
### I — Instructions (output excerpt)
| Linked ticket scope matches change | Pass | PR touches only LoginPage and LoginTest |
| Tests cover new behaviour | Pass | 3 new cases: valid, invalid, blank password |
| CI executed and passed | Unknown | CI status not supplied |
| No secrets committed | Pass | Grepped diff: no credentials |
| No debug logging left in | Fail | System.out.println at LoginPage.java:52 |
| Reversible migration/config | Pass | No migration; config added to env template |

**Decision: Request changes.** One Fail (debug logging) and one Unknown (CI status).
To proceed: remove the println at LoginPage.java:52 and attach the CI job result.
```

---

## Output Contract

| Section | Required | Shape |
|---|---|---|
| Scope Check | Yes | Ticket intent vs actual diff |
| Merge Gate Checklist | Yes | Gate \| Status \| Evidence |
| Scope Creep | Yes (or "None") | Files/areas outside ticket scope |
| Hygiene Findings | Yes (or "None found") | Secrets, debug code, TODOs, dead code |
| Test Evidence Assessment | Yes | What was proven, what is claimed but unproven |
| Decision | Yes | One of four values + required actions |
| Follow-ups | Yes (or "None") | Item \| Owner \| Suggested Ticket |

Rules: `Unknown` never counts as `Pass`; decision must follow from gate statuses; every Fail lists the exact evidence or fix needed.

---

## Self-Check

- [ ] Every gate has Pass / Fail / Unknown with evidence.
- [ ] CI status treated as Unknown unless supplied.
- [ ] Scope creep assessed against the linked ticket, not against taste.
- [ ] Secrets and debug code explicitly checked.
- [ ] Decision is consistent with the gate results.
- [ ] Unreviewed files declared.
- [ ] No test result asserted that was not supplied.

---

## SKILL.md Conversion

```yaml
---
name: pr-merge-review
description: Decide pull request merge readiness with a gate checklist covering scope, tests, CI, secrets, debug code, and reversibility, returning Approve, Approve with follow-ups, Request changes, or Block. Use when reviewing or approving a PR for merge.
---
```

Trigger phrases: "review this PR", "is this ready to merge", "PR approval checklist", "merge gate check".

Procedure for the skill body: read ticket + diff → scope check → gate checklist → hygiene scan → test evidence → decision → follow-ups → self-check.

---

**Alternative:** If the PR is already going to merge and you only want defect-level feedback, use `14-code-review-CRISP.md`, which is scoped to code quality rather than gates.
