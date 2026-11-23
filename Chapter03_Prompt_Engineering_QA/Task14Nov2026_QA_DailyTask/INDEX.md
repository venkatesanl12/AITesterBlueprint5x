# Daily QA Tasks — Prompt Template Library

Framework-backed prompt templates for the QA work that happens every day.
Each template is built on exactly one prompt framework, has a fixed output contract,
a self-check list, and a ready-to-use SKILL.md conversion block.

**Created:** 2026-11-15
**Source frameworks:** `../Templates/Template_CLEAR.md`, `../Templates/Template_CRISP.md`, `../Templates/Template_STAR.md`, `Chapter_02_Prompt_Engineering/RICE_POT/Template_RICE_POT/Template.RICEPPOT.md`

---

## Why one framework per template

Each file commits to a single framework so there is exactly one output contract to
validate against. Mixing frameworks in one file causes the model to blend structures
(e.g. returning a CRISP `Style` section inside a STAR `Result`), which makes review
ambiguous and makes SKILL.md conversion unreliable.

Where a different framework genuinely fits the same task, the file ends with a single
**Alternative** line pointing at the right template — a pointer, not a second skeleton.

---

## Template Index

| # | Task | Framework | File | Key Output |
|---|---|---|---|---|
| 1 | Requirement analysis | RICE-POT | `01-requirement-analysis-RICEPOT.md` | Requirement register + gap register + questions |
| 2 | Test case design | RICE-POT | `02-test-case-design-RICEPOT.md` | Coverage map + 10-column case table + blocked register |
| 3 | Bug report | CRISP | `03-bug-report-CRISP.md` | Reproducible defect report, severity with rationale |
| 4 | Test case execution | CLEAR | `04-test-case-execution-CLEAR.md` | Per-step log + case status + failures + blockers |
| 5 | Defect tracking | CRISP | `05-defect-tracking-CRISP.md` | Normalised defect register with age and ageing flags |
| 6 | RTM | RICE-POT | `06-rtm-RICEPOT.md` | Requirement→test→defect matrix + reverse trace + orphans |
| 7 | Smoke and sanity testing | CLEAR | `07-smoke-sanity-testing-CLEAR.md` | Time-boxed checklist + GO/NO-GO verdict |
| 8 | Bug triaging | CRISP | `08-bug-triaging-CRISP.md` | Severity/priority/decision table with justification |
| 9 | Regression testing | STAR | `09-regression-testing-STAR.md` | Tiered suite + exclusions with risk + entry/exit |
| 10 | Daily scrum notes | STAR | `10-daily-scrum-notes-STAR.md` | Spoken update + durable written note |
| 11 | Gap analysis | RICE-POT | `11-gap-analysis-RICEPOT.md` | Typed gap register + coverage before/after |
| 12 | UI/API testing | CLEAR | `12-ui-api-testing-CLEAR.md` | UI cases + API cases + hybrid consistency cases |
| 13 | Status report | STAR | `13-status-report-STAR.md` | Metrics + trend + risks + verdict + decisions |
| 14 | Code review | CRISP | `14-code-review-CRISP.md` | Located, classified findings + test quality + verdict |
| 15 | Automation code generation | RICE-POT | `15-automation-code-generation-RICEPOT.md` | Runnable code + assumptions + missing-input register |
| 16 | PR merge / review | CRISP | `16-pr-merge-review-CRISP.md` | Merge gate checklist + approve/block decision |
| 17 | Test coverage | CLEAR | `17-test-coverage-CLEAR.md` | Area coverage (req vs assertion) + risk ranking |

---

## Framework Distribution

| Framework | Count | Tasks | Natural strength |
|---|---|---|---|
| RICE-POT | 5 | 1, 2, 6, 11, 15 | Traceability and anti-hallucination on factual output |
| CRISP | 5 | 3, 5, 8, 14, 16 | Role-driven decisions with tight parameters |
| CLEAR | 4 | 4, 7, 12, 17 | Bounded scope with explicit limits and review |
| STAR | 3 | 9, 10, 13 | Planning and reporting narratives |

---

## Shared Conventions

Every template uses the same non-negotiables:

- **Deterministic output** — same input produces the same result.
- **No invented facts** — no selectors, endpoints, error text, IDs, or results that were not supplied.
- **Missing information** is written exactly as `Insufficient information to determine.`
- **Inferred detail** is labelled exactly as `Inference (low confidence)`.
- **Gap IDs** use the form `GAP-NN` and are referenced wherever a case or finding is blocked.
- **Credentials** are always placeholders: `<registered_email>`, `<valid_password>`.
- **No unearned pass** — nothing is marked Passed without observable evidence.

---

## How to Use

1. Pick the template for the task.
2. Copy the fenced `Prompt Template` block into your AI tool.
3. Replace every `[BRACKETED PLACEHOLDER]` with your real inputs.
4. Run it, then run the `Self-Check` list against the output.
5. If the output fails a check, point the model at that specific check rather than re-prompting from scratch.

---

## Converting to SKILL.md

Each file ends with a `SKILL.md Conversion` block containing ready frontmatter:

```yaml
---
name: <skill-name>
description: <when to use>
---
```

To convert:

1. Create `skills/<skill-name>/SKILL.md`.
2. Paste the YAML frontmatter from the template file.
3. Use the template's `Prompt Template` block as the skill body.
4. Add the `Output Contract` and `Self-Check` sections verbatim.
5. List the `Trigger phrases` from the template in the description or body.

The one-framework-per-file rule exists precisely so this conversion is mechanical —
one file becomes one skill with one procedure and one output shape.

---

## Relationship to Existing Chapter 03 Material

| Existing | Relationship |
|---|---|
| `CLEAR.md`, `CRISP.md`, `STAR.md` | Worked single-example prompts; these templates generalise them with output contracts and self-checks |
| `Templates/Template_*.md` | Framework definitions used as the skeleton for every file here |
| `Template.md` | Test plan TOC — output target for planning work, not a prompt framework |
| `Chapter_02 .../Template.RICEPPOT.md` | Canonical RICE-POT blank template plus the anti-hallucination parameters block reused here |
| `01_reuse-templates-testing/`, `02_...`, `03_...` | Earlier all-purpose prompts; this library is task-indexed instead of format-indexed |

---

## Known Gaps in This Library

- Framework coverage is deliberately uneven: cost/benefit is per task, not per framework.
- No template yet for: performance testing, security testing, accessibility testing, release sign-off, test data management.
- Each template is validated by design review only — none has been executed against a live model run as a formal test.
