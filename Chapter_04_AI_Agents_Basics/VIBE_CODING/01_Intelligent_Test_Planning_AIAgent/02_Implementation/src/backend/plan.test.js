import test from "node:test";
import assert from "node:assert/strict";
import { buildTemplatePlan } from "./plan.js";

test("builds template sections in order and marks missing details", () => {
  const plan = buildTemplatePlan({
    key: "QA-123",
    summary: "Login",
    description: "User can sign in.",
    acceptanceCriteria: ["Valid credentials open the account."],
    browseUrl: "https://jira.example/browse/QA-123",
  });

  const sections = [
    "## 1. Scope & Objectives",
    "## 2. Gaps & Questions for the author",
    "## 3. Test Scenarios",
    "## 4. Test Data & Environment",
    "## 5. Risks & Assumptions",
    "## 6. Entry / Exit criteria",
    "## 7. Resource Allocation",
    "## 8. Timelines, Sprint Details",
    "## HUMAN REVIEW GATE",
  ];
  const positions = sections.map((section) => plan.indexOf(section));
  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  assert.match(plan, /Proposal: Verify documented criterion/);
  assert.match(plan, /Insufficient information to determine\./);
  assert.match(plan, /\[QA-123\]\(https:\/\/jira\.example\/browse\/QA-123\)/);
});

test("does not invent test scenarios when acceptance criteria are missing", () => {
  const plan = buildTemplatePlan({ key: "QA-1", summary: "Unknown", description: "" });
  assert.match(plan, /\| TS-1 \| P0 \| Insufficient information to determine\./);
  assert.match(plan, /\*\*In scope:\*\* Insufficient information to determine\./);
});
