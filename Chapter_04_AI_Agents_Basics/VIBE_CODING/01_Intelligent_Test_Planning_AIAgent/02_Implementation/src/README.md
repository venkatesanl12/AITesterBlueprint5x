# Jira Test Plan

Run `npm install` and `npm run dev` from this folder, then open http://127.0.0.1:5173.

Locally, the backend reads `JIRA_BASE_URL`, `JIRA_EMAIL`, and `JIRA_TOKEN` from the repository-root `.env`. Never put credentials in the frontend.

Plans use the supplied template deterministically unless `GROQ_API_KEY` and `GROQ_MODEL` are both configured. `OLLAMA_BASE_URL` enables the Ollama connection test. Jira and Groq calls are live; template-based plan output is not an AI response.

## Vercel

Set this folder (`02_Implementation/src`) as the Vercel project root. Use `npm run build` and `frontend/dist` as the output directory. Add `JIRA_BASE_URL`, `JIRA_EMAIL`, and `JIRA_TOKEN` as Vercel environment variables; add `GROQ_API_KEY` and `GROQ_MODEL` only if using Groq. Do not upload or commit `.env`.
