# 10 — Daily Scrum Notes

> **Framework:** STAR
> **Use when:** You need to write your daily stand-up update or keep a team scrum log that stays useful weeks later.
> **Skip when:** You need an audience-facing summary of progress — use `13-status-report-STAR.md`.

---

## Prompt Template

```text
### S — Situation
Prepare my daily scrum notes for [DATE].
- Team / project: [PROJECT, SPRINT]
- My role: [QA ENGINEER / QA LEAD]
- What I was assigned: [TICKETS / CASES OWNED]
- Today's build: [BUILD ID AND STATUS]
- Raw material: [PASTE NOTES, TICKET UPDATES, EXECUTION RESULTS]
- Sprint goal: [ONE LINE]

### T — Task
Produce a stand-up update that answers the three questions, plus a written note
that captures context a verbal update would lose.

### A — Action
1. Split raw notes into Done, Doing, Blockers, using evidence supplied only.
2. For Done: name the artefact (test cases written, cases executed, defects raised) with IDs or counts.
3. For Doing: name the next concrete action and its owner.
4. For Blockers: state the blocker, who owns it, and how long it has been open.
5. Flag anything that threatens the sprint goal.
6. Keep the spoken version under 60 seconds; keep the written version searchable.
7. List follow-ups for tomorrow with owners.

Do NOT:
- Claim completion without supplied evidence.
- Write "testing in progress" without naming what is being tested.
- Invent counts, ticket IDs, or defect numbers.
- Include anything confidential in the spoken version.

### R — Result
1. **Spoken Update** — Done / Doing / Blockers, three sentences maximum
2. **Written Notes** — table: Item | Type | Evidence | Owner | Status
3. **Sprint Goal Impact** — On track / At risk / Blocked + reason
4. **Blockers** — Blocker | Owner | Days Open | Needed By
5. **Tomorrow** — numbered actions with owners
```

---

## Filled Example

```text
### R — Result (output excerpt)
**Spoken:** Yesterday I completed the login sanity pass on build rc1 — 2 of 2 checks
passed — and raised DEF-101 for the blank-password defect. Today I'm writing the
regression suite for the login area. No blockers.

| Completed login sanity (SAN-01, SAN-02) | Completed | Sanity checklist 2026-11-15 | A. Sharma | Done |
| Raised DEF-101 blank password accepted | Completed | Defect log row DEF-101 | A. Sharma | Done |
| Regression suite for login | In Progress | Not yet produced | A. Sharma | Due today |
| Blocked on locked test account | Blocker | GAP-02 still open | R. Iyer | Open 3 days |

**Sprint Goal Impact:** On track.
```

---

## Output Contract

| Section | Required | Shape |
|---|---|---|
| Spoken Update | Yes | ≤3 sentences, Done/Doing/Blockers |
| Written Notes | Yes | Table, 5 columns, every claim evidenced |
| Sprint Goal Impact | Yes | One of three verdicts + reason |
| Blockers | Yes (or "None") | Table, 4 columns, days open computed |
| Tomorrow | Yes | Numbered actions with owners |

Rules: no claim without evidence; blocker day-count derived from supplied dates; spoken version free of ticket noise.

---

## Self-Check

- [ ] Every Done item names a concrete artefact or ID.
- [ ] Every Doing item names the next action, not a vague activity.
- [ ] Blockers include owner and days open.
- [ ] Sprint goal verdict is consistent with the notes.
- [ ] Spoken version reads aloud in under 60 seconds.
- [ ] No invented counts or IDs.

---

## SKILL.md Conversion

```yaml
---
name: daily-scrum-notes
description: Turn raw daily QA activity into a short spoken stand-up update plus a durable written scrum note with evidence, blockers, sprint-goal impact, and tomorrow's actions. Use when preparing a daily stand-up or maintaining a scrum log.
---
```

Trigger phrases: "daily scrum notes", "stand-up update", "what do I say in standup", "scrum log for today".

Procedure for the skill body: ingest raw activity → classify Done/Doing/Blockers with evidence → spoken summary → written table → goal impact → blockers with age → tomorrow's actions → self-check.

---

**Alternative:** If the audience is a stakeholder rather than the team, use `13-status-report-STAR.md` so metrics and trend replace task granularity.
