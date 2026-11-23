import express from "express";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { testJiraConnection, fetchJiraIssue } from "./jira.js";
import { generatePlan } from "./generation.js";

const app = express();
const port = Number(process.env.PORT) || 3001;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../../..");
const templatePath = path.join(root, "Chapter_04_AI_Agents_Basics/VIBE_CODING/01_Intelligent_Test_Planning_AIAgent/01_plan/TestPlan_Template.md");

app.use(express.json({ limit: "32kb" }));

app.get("/api/status", (_req, res) => {
  res.json({
    jiraConfigured: Boolean(process.env.JIRA_BASE_URL && process.env.JIRA_EMAIL && process.env.JIRA_TOKEN),
    jiraBaseUrl: process.env.JIRA_BASE_URL ?? "",
    jiraEmail: process.env.JIRA_EMAIL ?? "",
    groqConfigured: Boolean(process.env.GROQ_API_KEY),
    groqModelConfigured: Boolean(process.env.GROQ_MODEL),
    ollamaConfigured: Boolean(process.env.OLLAMA_BASE_URL),
  });
});

app.post("/api/test/jira", async (_req, res) => {
  try {
    await testJiraConnection();
    res.json({ message: "Jira connection successful." });
  } catch (error) {
    res.status(502).json({ error: safeMessage(error) });
  }
});

app.post("/api/test/groq", async (_req, res) => {
  if (!process.env.GROQ_API_KEY) {
    return res.status(503).json({ error: "Groq is not configured. Set GROQ_API_KEY in the repo-root .env file." });
  }
  try {
    const response = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    });
    if (!response.ok) {
      const message = response.status === 401 || response.status === 403
        ? "Groq authentication failed. Check GROQ_API_KEY."
        : `Groq connection failed (HTTP ${response.status}).`;
      return res.status(502).json({ error: message });
    }
    res.json({ message: "Groq connection successful." });
  } catch {
    res.status(502).json({ error: "Could not reach Groq. Check the network connection." });
  }
});

app.post("/api/test/ollama", async (_req, res) => {
  const endpoint = process.env.OLLAMA_BASE_URL?.replace(/\/+$/, "");
  if (!endpoint) {
    return res.status(503).json({ error: "Ollama is not configured. Set OLLAMA_BASE_URL in the repo-root .env file." });
  }
  try {
    const response = await fetch(`${endpoint}/api/tags`);
    if (!response.ok) return res.status(502).json({ error: `Ollama connection failed (HTTP ${response.status}).` });
    res.json({ message: "Ollama connection successful." });
  } catch {
    res.status(502).json({ error: "Could not reach Ollama. Check the endpoint and network connection." });
  }
});

app.post("/api/test-plan", async (req, res) => {
  const issueKey = typeof req.body?.issueKey === "string" ? req.body.issueKey.trim().toUpperCase() : "";
  if (!/^[A-Z][A-Z0-9_]*-\d+$/.test(issueKey)) {
    return res.status(400).json({ error: "Enter a valid Jira issue key, such as QA-123." });
  }
  try {
    const issue = await fetchJiraIssue(issueKey);
    const template = await readFile(templatePath, "utf8");
    const result = await generatePlan(issue, template);
    res.json({ issue, ...result });
  } catch (error) {
    res.status(502).json({ error: safeMessage(error) });
  }
});

function safeMessage(error) {
  return error instanceof Error ? error.message : "The request failed unexpectedly.";
}

app.listen(port, "127.0.0.1", () => {
  console.log(`Backend listening on http://127.0.0.1:${port}`);
});
