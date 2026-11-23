import test from "node:test";
import assert from "node:assert/strict";
import { fetchJiraIssue } from "./jira.js";

function configureJira(t) {
  const previous = Object.fromEntries(
    ["JIRA_BASE_URL", "JIRA_EMAIL", "JIRA_TOKEN"].map((key) => [key, process.env[key]])
  );
  process.env.JIRA_BASE_URL = "https://jira.example";
  process.env.JIRA_EMAIL = "qa@example.test";
  process.env.JIRA_TOKEN = "test-token";
  t.after(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
}

test("retrieves a Jira issue and extracts description and named acceptance criteria", async (t) => {
  configureJira(t);
  const calls = [];
  t.mock.method(globalThis, "fetch", async (input, options) => {
    calls.push({ url: String(input), authorization: options.headers.Authorization });
    if (calls.length === 1) return Response.json({ accountId: "test" });
    return Response.json({
      key: "QA-123",
      names: { customfield_1: "Acceptance Criteria" },
      fields: {
        summary: "Sign in",
        description: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "User can sign in." }] }] },
        customfield_1: "Valid credentials open the account.",
      },
    });
  });

  const issue = await fetchJiraIssue("QA-123");

  assert.equal(issue.key, "QA-123");
  assert.equal(issue.summary, "Sign in");
  assert.equal(issue.description, "User can sign in.");
  assert.deepEqual(issue.acceptanceCriteria, ["Valid credentials open the account."]);
  assert.equal(calls.length, 2);
  assert.match(calls[0].url, /\/rest\/api\/3\/myself$/);
  assert.match(calls[1].url, /\/rest\/api\/3\/issue\/QA-123/);
  assert.ok(calls.every((call) => call.authorization.startsWith("Basic ")));
});

test("reports invalid credentials before treating an issue as missing", async (t) => {
  configureJira(t);
  t.mock.method(globalThis, "fetch", async () =>
    new Response("", { status: 401 })
  );

  await assert.rejects(fetchJiraIssue("QA-123"), /Jira authentication failed/);
});
