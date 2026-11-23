# Jira Test Plan

Run `npm install` and `npm run dev` from this folder, then open http://127.0.0.1:5173.

The backend reads `JIRA_BASE_URL`, `JIRA_EMAIL`, and `JIRA_TOKEN` from the repository-root `.env`. Never put credentials in the frontend.

Plans use the supplied template deterministically unless `GROQ_API_KEY` and `GROQ_MODEL` are both configured. `OLLAMA_BASE_URL` enables the Ollama connection test. Jira and Groq calls are live; template-based plan output is not an AI response.
