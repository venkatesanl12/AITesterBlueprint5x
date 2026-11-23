import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || "Request failed.");
  return body;
}

function App() {
  const [page, setPage] = useState("planner");
  const [issueKey, setIssueKey] = useState("");
  const [status, setStatus] = useState(null);
  const [plan, setPlan] = useState(null);
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    request("/api/status").then(setStatus).catch((error) => setNotice({ kind: "error", text: error.message }));
  }, []);

  async function submit(event) {
    event.preventDefault();
    setBusy("plan");
    setNotice(null);
    setPlan(null);
    try {
      const result = await request("/api/test-plan", {
        method: "POST",
        body: JSON.stringify({ issueKey }),
      });
      setPlan(result);
    } catch (error) {
      setNotice({ kind: "error", text: error.message });
    } finally {
      setBusy("");
    }
  }

  async function testConnection(kind) {
    setBusy(kind);
    setNotice(null);
    try {
      const result = await request(`/api/test/${kind}`, { method: "POST", body: "{}" });
      setNotice({ kind: "success", text: result.message });
    } catch (error) {
      setNotice({ kind: "error", text: error.message });
    } finally {
      setBusy("");
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#" onClick={() => setPage("planner")} aria-label="Jira Test Planner home">
          <span className="brand-mark">T</span>
          <span>Test Plan Studio</span>
        </a>
        <nav aria-label="Main navigation">
          <button className={page === "planner" ? "nav-link active" : "nav-link"} onClick={() => setPage("planner")}>Planner</button>
          <button className={page === "settings" ? "nav-link active" : "nav-link"} onClick={() => setPage("settings")}>Settings</button>
        </nav>
        <span className="status-pill"><span /> Jira test planner</span>
      </header>

      {page === "planner" ? (
        <section className="workspace">
          <div className="intro">
            <p className="eyebrow">JIRA · TEST PLANNING</p>
            <h1>Turn an issue into<br />a test plan.</h1>
            <p className="lede">Create a traceable draft from your Jira requirements. Every plan is ready for human review.</p>
          </div>
          <form className="issue-form" onSubmit={submit}>
            <label htmlFor="issueKey">Jira issue</label>
            <div className="input-row">
              <span className="input-icon" aria-hidden="true">⌕</span>
              <input
                id="issueKey"
                autoComplete="off"
                placeholder="e.g. QA-123"
                value={issueKey}
                onChange={(event) => setIssueKey(event.target.value)}
                disabled={busy === "plan"}
              />
              <button className="primary-button" type="submit" disabled={busy === "plan" || !issueKey.trim()}>
                {busy === "plan" ? <><span className="spinner" /> Working</> : <>Generate plan <span aria-hidden="true">→</span></>}
              </button>
            </div>
            <p className="helper">Issue details are retrieved securely through your Jira connection.</p>
          </form>

          {notice && <div className={`notice ${notice.kind}`} role="status">{notice.text}</div>}
          {plan ? (
            <section className="result-card" aria-live="polite">
              <div className="result-heading">
                <div>
                  <p className="eyebrow">DRAFT · {plan.issue.key}</p>
                  <h2>{plan.issue.summary}</h2>
                </div>
                <span className="mode-pill">{plan.mode === "groq" ? "Groq generated" : "Template-based"}</span>
              </div>
              {plan.mode !== "groq" && <p className="mode-note">No GROQ_MODEL is configured. This draft uses a deterministic template; add a model to .env to enable AI generation.</p>}
              <pre className="plan-content">{plan.plan}</pre>
            </section>
          ) : !notice && (
            <div className="empty-card">
              <div className="empty-icon" aria-hidden="true">✳</div>
              <p>Your test plan will appear here</p>
              <span>Enter an issue key to get started</span>
            </div>
          )}
          <footer>Plans are drafts. Review all requirements and proposed tests before sign-off.</footer>
        </section>
      ) : (
        <Settings status={status} busy={busy} notice={notice} onTest={testConnection} />
      )}
    </main>
  );
}

function SettingValue({ label, value, secret = false }) {
  return (
    <div className="setting-field">
      <span>{label}</span>
      <div className={secret ? "field-value secret" : "field-value"}>
        {secret ? (value ? "••••••••  Configured" : "Not configured") : (value || "Not configured")}
      </div>
    </div>
  );
}

function Settings({ status, busy, notice, onTest }) {
  return (
    <section className="settings-page">
      <div className="settings-intro">
        <p className="eyebrow">PREFERENCES</p>
        <h1>Connections</h1>
        <p>Credentials stay on the backend and are read from the repo-root .env file.</p>
      </div>
      {notice && <div className={`notice ${notice.kind}`} role="status">{notice.text}</div>}
      <div className="settings-grid">
        <article className="settings-card">
          <div className="card-title"><div><p className="eyebrow">SOURCE</p><h2>Jira connection</h2></div><span className={status?.jiraConfigured ? "connection-dot ready" : "connection-dot"} /></div>
          <SettingValue label="Base URL" value={status?.jiraBaseUrl} />
          <SettingValue label="Email" value={status?.jiraEmail} />
          <SettingValue label="API token" value={status?.jiraConfigured} secret />
          <button className="secondary-button" disabled={busy === "jira"} onClick={() => onTest("jira")}>
            {busy === "jira" ? "Testing…" : "Test connection"}
          </button>
        </article>
        <article className="settings-card">
          <div className="card-title"><div><p className="eyebrow">GENERATION</p><h2>LLM configuration</h2></div></div>
          <div className="provider">
            <div className="provider-icon local">O</div>
            <div className="provider-copy"><strong>Ollama</strong><span>{status?.ollamaConfigured ? "Endpoint configured" : "Not configured"}</span></div>
            <button className="text-button" disabled={busy === "ollama"} onClick={() => onTest("ollama")}>{busy === "ollama" ? "Testing…" : "Test"}</button>
          </div>
          <div className="provider">
            <div className="provider-icon groq">G</div>
            <div className="provider-copy"><strong>Groq</strong><span>{status?.groqConfigured ? (status.groqModelConfigured ? "API key and model configured" : "API key configured · model missing") : "Not configured"}</span></div>
            <button className="text-button" disabled={busy === "groq"} onClick={() => onTest("groq")}>{busy === "groq" ? "Testing…" : "Test"}</button>
          </div>
          <p className="settings-footnote">For Groq generation, add GROQ_MODEL to .env. To enable Ollama testing, add OLLAMA_BASE_URL.</p>
        </article>
      </div>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
