const missing = "Insufficient information to determine.";

function clean(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function escapeCell(value) {
  return clean(value).replace(/\|/g, "\\|");
}

export function buildTemplatePlan(issue) {
  const summary = clean(issue.summary) || missing;
  const description = clean(issue.description) || missing;
  const criteria = (issue.acceptanceCriteria ?? []).map(clean).filter(Boolean);
  const requirement = description === missing
    ? missing
    : `${description}${criteria.length ? ` Acceptance criteria: ${criteria.join("; ")}` : ""}`;
  const gap = description === missing
    ? "No issue description or acceptance criteria were available."
    : criteria.length
      ? missing
      : "Explicit acceptance criteria were not identified in the Jira issue.";
  const scenarios = criteria.length
    ? criteria.map((criterion, index) =>
      `| TS-${index + 1} | P1 | pos | Proposal: Verify documented criterion — ${escapeCell(criterion)} | Acceptance criterion ${index + 1} |`
    ).join("\n")
    : `| TS-1 | P0 | ${missing} | ${missing} | Missing acceptance criteria |`;
  const jiraReference = issue.key && issue.browseUrl
    ? `Source: [${issue.key}](${issue.browseUrl})`
    : `Source: ${issue.key || missing}`;

  return `# Test Plan — ${issue.key || missing}: ${summary}

> Status: **DRAFT — pending human review.** Not approved until a QA owner signs off.

${jiraReference}

## 1. Scope & Objectives
- **In scope:** ${requirement}
- **Out of scope:** ${missing}
- **Objective:** ${missing}

## 2. Gaps & Questions for the author
| # | Area | Finding (⚠️/❌) | Question to author |
|---|------|----------------|--------------------|
| 1 | Acceptance criteria | ${gap} | Please provide or confirm the acceptance criteria. |

## 3. Test Scenarios
| ID | Priority | Type (pos/neg/boundary) | Scenario | Maps to (AC / gap) |
|----|----------|-------------------------|----------|--------------------|
${scenarios}

## 4. Test Data & Environment
- **Data:** ${missing}
- **Environment / flags:** ${missing}
- **Roles / permissions:** ${missing}

## 5. Risks & Assumptions
- **Assumptions made:** None.
- **Risks:** ${missing}

## 6. Entry / Exit criteria
- **Entry:** ${missing}
- **Exit:** ${missing}

## 7. Resource Allocation
${missing}

## 8. Timelines, Sprint Details
${missing}

---
## HUMAN REVIEW GATE
- **I assumed:** None.
- **I could not confirm:** ${missing}
- **Open questions blocking sign-off:** ${gap}
- **Approve, or edit, before I write test cases / automation.**
`;
}
