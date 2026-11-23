# 05 — Defect Tracking

> **Framework:** CRISP
> **Use when:** You are maintaining a defect log across a cycle and need one consistent row per defect with state, ageing, and ownership.
> **Skip when:** You are filing a single detailed defect — use `03-bug-report-CRISP.md`.

---

## Prompt Template

```text
### C — Context
I maintain the defect log for [PROJECT / RELEASE]. Defects arrive from several
testers and are tracked in [JIRA / AZURE DEVOPS / SHEET].
- Reporting period: [START DATE → END DATE]
- Release / build under test: [BUILD ID]
- Defects supplied: [PASTE DEFECT LIST OR TABLE]
- Team roster / owners: [NAMES OR ROLES]

### R — Role
Act as the QA lead accountable for defect hygiene: nothing untracked, nothing
duplicated, nothing ageing silently.

### I — Instructions
1. Normalise every defect into one row using the fixed column set below.
2. Preserve any supplied defect IDs exactly. Never renumber them.
3. Detect probable duplicates and link them instead of deleting them.
4. Assign state using only: New / Open / In Progress / Fixed / Retest / Closed / Reopened / Deferred / Rejected.
5. Compute age in days from raised date to today.
6. Flag every defect open beyond [SLA DAYS] as ageing.
7. Group defects by severity and by module for the summary.
8. Identify defects missing a mandatory field and list them separately.

Do NOT:
- Change a supplied severity without stating the change and the reason.
- Close or mark Fixed a defect without supplied evidence.
- Invent missing dates, owners, or build numbers.

### S — Style
Tabular and terse. One row per defect. No narrative inside cells beyond the
summary fields.

### P — Parameters
- One row per defect, no merging of distinct issues.
- Missing values: "Not supplied."
- Ageing threshold: [SLA DAYS, default 5].
- Severity: Critical / High / Medium / Low. Priority: P1 / P2 / P3 / P4.
- Sort the main table by severity, then by age descending.
```

---

## Filled Example

```text
### I — Instructions (output excerpt)
| DEF-101 | Login | Submit with blank password is accepted | Critical | P1 | Open | A. Sharma | 2026-11-13 | 2 | No | — |
| DEF-102 | Login | Password field accepts 3-character value | Medium | P3 | Retest | R. Iyer | 2026-11-11 | 4 | No | Blocks on GAP-05 |
| DEF-103 | Dashboard | Widget count label shows stale value | Low | P4 | Fixed | A. Sharma | 2026-11-05 | 10 | Yes | Duplicate of DEF-089 |
```

---

## Output Contract

| Section | Required | Shape |
|---|---|---|
| Defect Register | Yes | ID \| Module \| Summary \| Severity \| Priority \| State \| Owner \| Raised Date \| Age (days) \| Ageing \| Linked Duplicate |
| Summary by Severity | Yes | Severity \| Open \| Closed \| Total |
| Summary by Module | Yes | Module \| Open \| Closed \| Total |
| Ageing Defects | Yes (or "None") | ID \| Module \| Severity \| Age \| Days Over SLA \| Owner |
| Data Quality Gaps | Yes (or "None") | ID \| Missing Field \| Impact |

Rules: supplied IDs unchanged; no defect closed without evidence; duplicate links must be bidirectional.

---

## Self-Check

- [ ] Every supplied defect appears exactly once in the register.
- [ ] All states come from the allowed list.
- [ ] Age is computed, not guessed, from the raised date.
- [ ] Ageing flags use the stated SLA, consistently.
- [ ] Duplicates are linked, not deleted.
- [ ] Severity totals equal register row totals.

---

## SKILL.md Conversion

```yaml
---
name: defect-tracking
description: Normalise defects into a single tracking register with consistent states, computed age, ageing flags, duplicate links, severity and module summaries, and data-quality gaps. Use when maintaining a defect log across a test cycle.
---
```

Trigger phrases: "update the defect log", "defect tracking report", "which bugs are ageing", "defect summary by severity".

Procedure for the skill body: ingest defects → normalise rows → dedupe/link → compute age → flag ageing → summarise by severity and module → list data gaps → self-check.

---

**Alternative:** If you need defect-to-requirement traceability rather than hygiene, use `06-rtm-RICEPOT.md`, which carries the defect column.
