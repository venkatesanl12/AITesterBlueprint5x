import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function App() {
  const [page, setPage] = useState("main");
  const [issueKey, setIssueKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [credentials, setCredentials] = useState({});

  async function submit(event) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/test-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueKey, credentials }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to generate test plan.");
      setResult(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <nav className="nav" aria-label="Main navigation">
        <button className={page === "main" ? "active" : ""} onClick={() => setPage("main")}>Main</button>
        <button className={page === "settings" ? "active" : ""} onClick={() => setPage("settings")}>Settings</button>
      </nav>

      {page === "main" ? (
        <section className="card">
          <h1>Main page</h1>
          <form onSubmit={submit} className="prompt">
            <label htmlFor="issue">Prompt (JIRA Ticket)</label>
            <input id="issue" value={issueKey} onChange={(event) => setIssueKey(event.target.value)} placeholder="QA-123" disabled={loading} />
            <button type="submit" disabled={loading}>{loading ? "Generating..." : "Generate Test Plan"}</button>
          </form>
          {loading && <p className="status">Retrieving Jira issue and generating plan...</p>}
          {error && <p className="status error" role="alert">{error}</p>}
          {!loading && !error && !result && <div className="reply"><p>Reply with Test Plan</p></div>}
          {result && (
            <article className="reply plan">
              <div className="plan-meta">
                <strong>{result.issue.key}</strong>
                <span>{result.generatedBy}</span>
              </div>
              <pre>{result.plan}</pre>
            </article>
          )}
        </section>
      ) : (
        <Settings credentials={credentials} onCredentialsChange={setCredentials} />
      )}
    </main>
  );
}

function Settings({ credentials, onCredentialsChange }) {
  const [state, setState] = useState({ jira: "", groq: "", ollama: "" });
  const [configMessage, setConfigMessage] = useState("");

  async function loadEnvFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 65536) {
      setConfigMessage("File must be smaller than 64 KB.");
      return;
    }
    try {
      const values = {};
      const allowedKeys = new Set(["JIRA_BASE_URL", "JIRA_EMAIL", "JIRA_TOKEN", "GROQ_API_KEY", "GROQ_MODEL"]);
      for (const rawLine of (await file.text()).split(/\r?\n/)) {
        const line = rawLine.trim().replace(/^export\s+/, "");
        if (!line || line.startsWith("#")) continue;
        const separator = line.indexOf("=");
        if (separator < 1) continue;
        const name = line.slice(0, separator).trim();
        if (!allowedKeys.has(name)) continue;
        let value = line.slice(separator + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        } else {
          value = value.replace(/\s+#.*$/, "").trim();
        }
        values[name] = value;
      }
      if (!values.JIRA_BASE_URL || !values.JIRA_EMAIL || !values.JIRA_TOKEN) {
        setConfigMessage("File must include JIRA_BASE_URL, JIRA_EMAIL, and JIRA_TOKEN.");
        return;
      }
      onCredentialsChange(values);
      setConfigMessage("Configuration loaded in this tab's memory. Values are not saved.");
    } catch {
      setConfigMessage("Could not read the selected file.");
    }
  }

  async function test(type) {
    setState((current) => ({ ...current, [type]: "Testing..." }));
    try {
      const response = await fetch(`/api/settings/test-${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credentials }),
      });
      const data = await response.json();
      setState((current) => ({ ...current, [type]: data.ok ? "Connected" : data.error }));
    } catch {
      setState((current) => ({ ...current, [type]: "Connection failed" }));
    }
  }

  return (
    <section className="card">
      <h1>Settings</h1>
      <div className="settings-box">
        <h2>JIRA Connection</h2>
        <label className="file-picker">
          Select .env file
          <input type="file" accept=".env,text/plain" onChange={loadEnvFile} />
        </label>
        <p>{credentials.JIRA_TOKEN ? "Jira credentials loaded" : "No file loaded"}</p>
        <button onClick={() => test("jira")}>Test Connection</button>
        {state.jira && <p className="setting-status">{state.jira}</p>}
        {configMessage && <p className="setting-status" role="status">{configMessage}</p>}
      </div>
      <div className="settings-box">
        <h2>LLM Configuration</h2>
        <ol>
          <li>Ollama Connection</li>
          <li><span className="groq">Groq.com</span> (API Key)</li>
        </ol>
        <button onClick={() => test("groq")}>Test Groq.com</button>
        {state.groq && <p className="setting-status">{state.groq}</p>}
        <p className="privacy-note">Credentials stay in this tab and are sent to the app backend only when you use it. Use this only on a trusted deployment.</p>
      </div>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
