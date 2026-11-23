# Jira Test Plan Generator

## Run locally
- Node.js 18 or later

## Install and run
```bash
cd implementation
npm install
npm run install:all
npm run dev
```

Open http://localhost:5173.

## Configuration
Local backend searches upward from the implementation folder and loads the nearest `.env`.

Optional `GROQ_MODEL` sets the Groq model (default: `llama-3.1-8b-instant`).
Alternatively, open **Settings** and select a `.env` file containing `JIRA_BASE_URL`, `JIRA_EMAIL`, and `JIRA_TOKEN`. `GROQ_API_KEY` is optional. Only these supported keys are read. The values stay in tab memory and are sent to this app's backend on requests; they are not saved in browser storage or on the server. Only upload credentials to a deployment you trust.

## Use
Enter a Jira issue ID such as `QA-123`, then select **Generate Test Plan**.

## Deploy to Vercel
Import this `implementation` folder as the project root in Vercel. The included `vercel.json` builds the React app and deploys the Express API as a serverless function. Configure `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_TOKEN`, and optionally `GROQ_API_KEY` under Vercel Project Settings → Environment Variables, or users can load their own `.env` from Settings. Never commit `.env`.

## Verification
Run `npm run build --prefix src/frontend`. Live Jira and Groq calls require valid credentials and network access.
