# 08 — Bug Triaging

> **Framework:** CRISP
> **Use when:** You have a pile of defects and a triage call to run — you need consistent, defensible severity, priority, owner, and decision per defect.
> **Skip when:** You are writing up one defect — use `03-bug-report-CRISP.md`.

---

## Prompt Template

```text
### C — Context
I am preparing a defect triage for [PROJECT / RELEASE].
- Defect list: [PASTE DEFECTS]
- Release deadline / window: [DATE OR SPRINT]
- Blocking release: [WHAT MUST BE CLEAN — e.g. payments, login]
- Team capacity this sprint: [N DEVELOPERS / N DAYS]
- Known workarounds: [PASTE OR "None"]

### R — Role
Act as the triage lead: a QA manager who decides severity on impact, priority on
business value and timing, and refuses to accept vague defects.

### I — Instructions
1. For each defect, confirm it is actionable. If not, mark it Needs Info and state exactly what is missing.
2. Assign severity purely from technical impact: Critical (data loss / security / complete block), High (major function broken, no workaround), Medium (function impaired, workaround exists), Low (cosmetic / minor).
3. Assign priority from business timing, independent of severity: P1 fix now, P2 this sprint, P3 next sprint, P4 backlog.
4. State the business justification for each priority in one line.
5. Recommend a decision using only: Fix Now / Fix This Sprint / Defer / Reject / Duplicate / Needs Info.
6. Where a workaround exists, name it.
7. Flag any defect where severity and priority diverge and explain why.
8. Identify defects that should be merged as duplicates.

Do NOT:
- Accept a defect with no reproduction steps as actionable.
- Assign priority by gut feel without naming the business impact.
- Assume a workaround exists.
- Change a reporter's severity silently — state the change and the reason.

### S — Style
Decision-table style. One row per defect. Terse rationale, no paragraphs.

### P — Parameters
- One row per defect; no merging except explicit duplicates.
- Scales: Severity Critical/High/Medium/Low; Priority P1–P4.
- Decisions limited to the six listed values.
- If impact cannot be judged from the supplied information, write exactly
  "Insufficient information to determine." and set decision to Needs Info.
```

---

## Filled Example

```text
### I — Instructions (output excerpt)
| DEF-101 | Login | Blank password accepted, submission proceeds | Critical | P1 | Fix Now | Mandatory-field enforcement absent; entry point to the app is compromised | None | — |
| DEF-102 | Login | Message text truncated in German locale | Low | P3 | Defer | Cosmetic, one locale, no functional impact | Read field tooltip | — |
| DEF-103 | Dashboard | Widget count stale after filter change | Medium | P2 | Fix This Sprint | Misreports data to users; refresh workaround is poor UX | Manual refresh | Severity Medium, priority P2 — data accuracy matters to the release |
| DEF-104 | Login | Login fails for SSO accounts | High | — | Needs Info | Insufficient information to determine. | Not supplied | Missing: SSO config, account state, error text |
```

---

## Output Contract

| Section | Required | Shape |
|---|---|---|
| Triage Table | Yes | Defect ID \| Module \| Summary \| Severity \| Priority \| Decision \| Business Justification \| Workaround \| Notes |
| Needs Info List | Yes (or "None") | Defect ID \| Missing Information \| Who Must Supply |
| Duplicate Map | Yes (or "None") | Primary ID \| Duplicate IDs \| Reason |
| Severity/Priority Divergence | Yes (or "None") | Defect ID \| Severity \| Priority \| Why They Differ |
| Triage Summary | Yes | Counts per decision, count blocking release |

Rules: no decision without a justification line; Needs Info must name the missing field; duplicates must reference a primary.

---

## Self-Check

- [ ] Severity is technical impact only; priority is business timing only.
- [ ] Every row has a one-line business justification.
- [ ] Every Needs Info row names exactly what is missing and who can supply it.
- [ ] Divergences between severity and priority are explained, not hidden.
- [ ] No defect is deferred without an accepted reason.
- [ ] Decision counts match table rows.

---

## SKILL.md Conversion

```yaml
---
name: bug-triaging
description: Triage a defect list into severity, priority, decision, owner and workaround with business justification, flagging severity/priority divergence, duplicates, and defects that need more information. Use when preparing or running a triage meeting.
---
```

Trigger phrases: "triage these bugs", "severity and priority for these defects", "what do we fix this sprint", "triage call prep".

Procedure for the skill body: validate actionability → assign severity → assign priority → justify → decide → dupes → divergence flags → summary → self-check.

---

**Alternative:** If the output must feed a tracked log rather than a decision meeting, use `05-defect-tracking-CRISP.md` after triage to normalise the rows.
