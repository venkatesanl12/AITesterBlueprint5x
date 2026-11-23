# 13 — Status Report

> **Framework:** STAR
> **Use when:** You must report testing progress to stakeholders — weekly, at a milestone, or before a release gate.
> **Skip when:** The audience is your own team at stand-up — use `10-daily-scrum-notes-STAR.md`.

---

## Prompt Template

```text
### S — Situation
Prepare a QA status report for [PROJECT / RELEASE].
- Reporting period: [START → END DATE]
- Audience: [MANAGER / CLIENT / STEERING GROUP]
- Release / build under test: [VERSION, BUILD]
- Planned vs actual: [PLAN SUPPLIED? YES/NO]
- Raw inputs: [EXECUTION RESULTS, DEFECT COUNTS, RISK LIST]
- Release date: [DATE OR "Not set"]
- Prior report: [PASTE OR "None"]

### T — Task
Report status honestly: what was tested, what the results mean, what is at risk,
and what decision the audience needs to make. Do not soften bad news.

### A — Action
1. Summarise progress against plan with numbers, not adjectives.
2. Report execution metrics: planned, executed, passed, failed, blocked, not run, pass rate.
3. Report defect metrics: opened, closed, open by severity, ageing count.
4. State the top risks with likelihood, impact, and mitigation owner.
5. Give a clear quality verdict: On Track / At Risk / Off Track, with the reason.
6. State decisions or help needed, addressed to a named role.
7. Show trend against the prior report where one was supplied.

Do NOT:
- Report percentages you cannot derive from supplied numbers.
- Use "almost done" or "nearly complete" without a number.
- Bury a release-blocking risk below routine items.
- Claim a milestone met without evidence.

### R — Result
1. **Executive Summary** — 3 sentences: status, headline number, key risk
2. **Progress Against Plan** — Planned | Actual | Variance
3. **Execution Metrics** — table with counts and computed pass rate
4. **Defect Metrics** — opened/closed/open by severity, ageing
5. **Trend vs Prior Report** — improving / flat / worsening, with numbers
6. **Risks and Issues** — Risk | Likelihood | Impact | Mitigation | Owner
7. **Quality Verdict** — On Track / At Risk / Off Track + reason
8. **Decisions Needed** — Decision | Owner | Needed By
```

---

## Filled Example

```text
### R — Result (output excerpt)
**Executive Summary:** Testing is At Risk. 42 of 60 planned cases executed (70%),
pass rate 81%. One release-blocking gap remains: no locked-account test data, so
8 cases cannot run.

| Planned 60 | Executed 42 | Variance -18 |
| Passed 34 | Failed 6 | Blocked 8 | Not Run 12 | Pass rate 81% (34/42) |

**Quality Verdict:** At Risk — 8 blocked cases depend on GAP-07 and cannot be
executed before the release date.
```

---

## Output Contract

| Section | Required | Shape |
|---|---|---|
| Executive Summary | Yes | Exactly 3 sentences |
| Progress Against Plan | Yes | Table, 3 columns, variance computed |
| Execution Metrics | Yes | Counts + computed pass rate |
| Defect Metrics | Yes | Per-severity open/closed + ageing count |
| Trend vs Prior Report | Yes (or "Baseline report") | Direction + numbers |
| Risks and Issues | Yes | Table, 5 columns, named owner |
| Quality Verdict | Yes | One of three verdicts + reason |
| Decisions Needed | Yes (or "None") | Table, 3 columns |

Rules: every percentage derived from supplied counts; verdict consistent with metrics; release blockers surfaced in the executive summary.

---

## Self-Check

- [ ] All arithmetic re-checked against supplied inputs.
- [ ] Pass rate denominator is executed cases, not planned cases — and stated.
- [ ] No qualitative hedging replacing a number.
- [ ] Release-blocking risks appear in the executive summary.
- [ ] Verdict is consistent with the metrics shown.
- [ ] Trend compares like-for-like periods.
- [ ] Every decision has an owner and a date.

---

## SKILL.md Conversion

```yaml
---
name: qa-status-report
description: Produce a stakeholder QA status report with plan variance, execution and defect metrics, trend, risks, a clear quality verdict, and the decisions needed. Use for weekly, milestone, or release-gate reporting.
---
```

Trigger phrases: "QA status report", "weekly test report", "report testing progress", "release readiness report".

Procedure for the skill body: gather metrics → progress vs plan → execution → defects → trend → risks → verdict → decisions → arithmetic check → self-check.

---

**Alternative:** If the reader needs to act on individual defects rather than overall progress, `08-bug-triaging-CRISP.md` gives them the decision table instead.
