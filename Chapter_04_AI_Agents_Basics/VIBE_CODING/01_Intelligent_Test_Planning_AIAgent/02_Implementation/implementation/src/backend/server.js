import express from "express";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
app.use(express.json({ limit: "1mb" }));

function findParentEnv(startDir) {
  let dir = startDir;
  for (let i = 0; i < 8; i += 1) {
    const candidate = path.join(dir, ".env");
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

const backendDir = path.dirname(fileURLToPath(import.meta.url));
const envPath = findParentEnv(backendDir);
if (envPath) dotenv.config({ path: envPath });

const port = Number(process.env.PORT || 3001);
const missing = (value) => !value || !String(value).trim();
const MISSING = "Insufficient information to determine.";

function textFromContent(value) {
  if (typeof value === "string") return value.trim();
  if (!value) return "";
  if (ArrayBuffer.isView(value)) return "";
  if (Array.isArray(value)) return value.map(textFromContent).filter(Boolean).join("\n").trim();
  if (typeof value === "object") {
    if (typeof value.text === "string") return value.text;
    if (Array.isArray(value.content)) return value.content.map(textFromContent).filter(Boolean).join("\n").trim();
  }
  return "";
}

function jiraConfig(credentials = {}) {
  return {
    baseUrl: (credentials.JIRA_BASE_URL || process.env.JIRA_BASE_URL || "").replace(/\/+$/, ""),
    email: credentials.JIRA_EMAIL || process.env.JIRA_EMAIL || "",
    token: credentials.JIRA_TOKEN || process.env.JIRA_TOKEN || "",
  };
}

function jiraAuthHeader(config) {
  return `Basic ${Buffer.from(`${config.email}:${config.token}`).toString("base64")}`;
}

async function jiraRequest(issueKey, config) {
  if (missing(config.baseUrl) || missing(config.email) || missing(config.token)) {
    const error = new Error("Jira configuration is missing.");
    error.status = 503;
    throw error;
  }
  const url = `${config.baseUrl}/rest/api/3/issue/${encodeURIComponent(issueKey)}?fields=*all`;
  let response;
  try {
    response = await fetch(url, {
      headers: { Authorization: jiraAuthHeader(config), Accept: "application/json" },
    });
  } catch {
    const error = new Error("Unable to connect to Jira.");
    error.status = 502;
    throw error;
  }
  if (response.status === 404) {
    const error = new Error(`Jira issue ${issueKey} was not found.`);
    error.status = 404;
    throw error;
  }
  if (response.status === 401) {
    const error = new Error("Jira authentication failed.");
    error.status = 401;
    throw error;
  }
  if (response.status === 403) {
    const error = new Error("Jira permission denied.");
    error.status = 403;
    throw error;
  }
  if (!response.ok) {
    const error = new Error(`Jira request failed (${response.status}).`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

function extractIssue(issue) {
  const fields = issue.fields || {};
  const acceptanceField = Object.entries(fields).find(([key, value]) =>
    /acceptance|acceptance.?criteria|criteria/i.test(key) ||
    /acceptance|acceptance.?criteria|criteria/i.test(value?.name || "")
  );
  return {
    key: issue.key,
    title: fields.summary || MISSING,
    description: textFromContent(fields.description) || MISSING,
    acceptanceCriteria: acceptanceField ? textFromContent(acceptanceField[1]) || MISSING : MISSING,
    status: fields.status?.name || MISSING,
    priority: fields.priority?.name || MISSING,
    issueType: fields.issuetype?.name || MISSING,
    labels: Array.isArray(fields.labels) && fields.labels.length ? fields.labels.join(", ") : MISSING,
  };
}

function fallbackPlan(issue) {
  return `# Test Plan — ${issue.key}: ${issue.title}

> Status: **DRAFT — pending human review.** Not approved until a QA owner signs off.

## 1. Scope & Objectives
- **In scope:** ${issue.description}
- **Out of scope:** ${MISSING}
- **Objective:** Proposed testing activities for ${issue.key}. ${MISSING}

## 2. Gaps & Questions for the author
| # | Area | Finding (⚠️/❌) | Question to author |
|---|------|----------------|--------------------|
| 1 | Acceptance criteria | ⚠️ | Is the acceptance criteria for ${issue.key} available? |
| 2 | Out of scope | ⚠️ | What is explicitly out of scope? |

## 3. Test Scenarios
| ID | Priority | Type (pos/neg/boundary) | Scenario | Maps to (AC / gap) |
|----|----------|-------------------------|----------|--------------------|
| TS-1 | P0 | positive | Proposal: verify the documented Jira description. | ${issue.acceptanceCriteria} |

## 4. Test Data & Environment
- **Data:** ${MISSING}
- **Environment / flags:** ${MISSING}
- **Roles / permissions:** ${MISSING}

## 5. Risks & Assumptions
- **Assumptions made:** No product behavior beyond Jira and supplied planning materials is assumed.
- **Risks:** ${MISSING}

## 6. Entry / Exit criteria
- **Entry:** ${MISSING}
- **Exit:** ${MISSING}

## 7. Resource Allocation
${MISSING}

## 8. Timelines, Sprint Details
${MISSING}

---
## HUMAN REVIEW GATE
- **I assumed:** No product behavior beyond the retrieved Jira information.
- **I could not confirm:** Test data, environment, roles, entry/exit criteria, resources, and timelines.
- **Open questions blocking sign-off:** Acceptance criteria and application details.
- **Approve, or edit, before I write test cases / automation.**`;
}

async function generateWithGroq(issue, credentials = {}) {
  const key = credentials.GROQ_API_KEY || process.env.GROQ_API_KEY;
  if (missing(key)) return null;
  const model = credentials.GROQ_MODEL || process.env.GROQ_MODEL || "llama-3.1-8b-instant";
  const template = `# Test Plan — <JIRA-KEY>: <title>

> Status: **DRAFT — pending human review.** Not approved until a QA owner signs off.

## 1. Scope & Objectives
- **In scope:**
- **Out of scope:**
- **Objective:** what "tested" means for this ticket.

## 2. Gaps & Questions for the author
| # | Area | Finding (⚠️/❌) | Question to author |
|---|------|----------------|--------------------|
| 1 |      |                |                    |

## 3. Test Scenarios
| ID | Priority | Type (pos/neg/boundary) | Scenario | Maps to (AC / gap) |
|----|----------|-------------------------|----------|--------------------|
| TS-1 | P0 |                       |          |                    |

## 4. Test Data & Environment
- **Data:**
- **Environment / flags:**
- **Roles / permissions:**

## 5. Risks & Assumptions
- **Assumptions made:**
- **Risks:**

## 6. Entry / Exit criteria
- **Entry:**
- **Exit:**

## 7. Resource Allocation

## 8. Timelines, Sprint Details

---
## HUMAN REVIEW GATE
- **I assumed:** …
- **I could not confirm:** …
- **Open questions blocking sign-off:** …
- **Approve, or edit, before I write test cases / automation.**`;
  const prompt = `Use only this Jira data. Return only Markdown that follows the exact section names and order of the template. Missing details must be exactly "Insufficient information to determine.". Clearly label all test scenarios as proposals. Do not invent requirements.

Template:
${template}

Jira data:
${JSON.stringify(issue)}

Acceptance criteria:
${issue.acceptanceCriteria}`;
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      temperature: 0,
      messages: [
        { role: "system", content: "You are a senior QA automation architect. Produce traceable, conservative test plans." },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!response.ok) return null;
  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || null;
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/test-plan", async (req, res) => {
  const body = req.body || {};
  const issueKey = String(body.issueKey || "").trim().toUpperCase();
  if (!/^[A-Z][A-Z0-9]*-[0-9]+$/.test(issueKey)) {
    return res.status(400).json({ error: "Enter a valid Jira issue ID, for example QA-123." });
  }
  try {
    const credentials = body.credentials || {};
    const raw = await jiraRequest(issueKey, jiraConfig(credentials));
    const issue = extractIssue(raw);
    let plan = await generateWithGroq(issue, credentials);
    let generatedBy = "Groq";
    if (!plan) {
      plan = fallbackPlan(issue);
      generatedBy = (credentials.GROQ_API_KEY || process.env.GROQ_API_KEY)
        ? "Unavailable (deterministic fallback)"
        : "Deterministic fallback";
    }
    res.json({ issue, plan, generatedBy });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || "Test plan generation failed." });
  }
});

app.post("/api/settings/test-jira", async (req, res) => {
  const config = jiraConfig(req.body?.credentials || {});
  if (missing(config.baseUrl) || missing(config.email) || missing(config.token)) {
    return res.status(503).json({ ok: false, error: "Jira configuration is missing." });
  }
  try {
    const result = await fetch(`${config.baseUrl}/rest/api/3/myself`, {
      headers: { Authorization: jiraAuthHeader(config), Accept: "application/json" },
    });
    res.json({ ok: result.ok, error: result.ok ? undefined : `Jira returned ${result.status}.` });
  } catch {
    res.status(502).json({ ok: false, error: "Unable to connect to Jira." });
  }
});

app.post("/api/settings/test-groq", async (req, res) => {
  const key = req.body?.credentials?.GROQ_API_KEY || process.env.GROQ_API_KEY;
  if (missing(key)) {
    return res.status(503).json({ ok: false, error: "Groq API key is missing." });
  }
  try {
    const result = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: `Bearer ${key}` },
    });
    res.json({ ok: result.ok, error: result.ok ? undefined : `Groq returned ${result.status}.` });
  } catch {
    res.status(502).json({ ok: false, error: "Unable to connect to Groq." });
  }
});

export default app;

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`));
}
