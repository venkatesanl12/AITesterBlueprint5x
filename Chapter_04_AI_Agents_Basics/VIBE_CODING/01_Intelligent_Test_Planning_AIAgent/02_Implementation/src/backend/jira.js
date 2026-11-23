function adfToText(value) {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  if (value.type === "text") return value.text ?? "";

  const children = Array.isArray(value.content) ? value.content.map(adfToText) : [];
  const separator = ["paragraph", "heading", "listItem", "blockquote"].includes(value.type) ? "\n" : "";
  const content = children.join("");
  return `${separator}${content}${separator}`;
}

function getCredentials() {
  const baseUrl = process.env.JIRA_BASE_URL?.replace(/\/+$/, "");
  const email = process.env.JIRA_EMAIL;
  const token = process.env.JIRA_TOKEN;
  if (!baseUrl || !email || !token) {
    throw new Error("Jira is not configured. Set JIRA_BASE_URL, JIRA_EMAIL, and JIRA_TOKEN in the repo-root .env file.");
  }
  return { baseUrl, email, token };
}

function headers(email, token) {
  return {
    Authorization: `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`,
    Accept: "application/json",
  };
}

async function requestJira(url, options) {
  try {
    return await fetch(url, options);
  } catch {
    throw new Error("Could not reach Jira. Check JIRA_BASE_URL and the network.");
  }
}

export async function testJiraConnection() {
  const { baseUrl, email, token } = getCredentials();
  let response = await requestJira(`${baseUrl}/rest/api/3/myself`, { headers: headers(email, token) });
  if (response.status === 404) {
    response = await requestJira(`${baseUrl}/rest/api/2/myself`, { headers: headers(email, token) });
  }
  if (!response.ok) throw jiraError(response.status);
  return true;
}

function jiraError(status) {
  if (status === 401) return new Error("Jira authentication failed. Check the email and API token in .env.");
  if (status === 403) return new Error("Jira denied access. Check the account permissions.");
  if (status === 404) return new Error("Jira could not find this issue or your account lacks access. Check the issue key and permissions.");
  return new Error(`Jira request failed (HTTP ${status}).`);
}

function extractIssue(data, baseUrl, fallbackKey) {
  const fields = data.fields ?? {};
  const names = data.names ?? {};
  const criteriaField = Object.entries(fields).find(([id]) =>
    /acceptance criteria/i.test(names[id] ?? "")
  )?.[1];
  const criteriaText = adfToText(criteriaField).trim();
  const acceptanceCriteria = criteriaText
    ? criteriaText.split(/\n+|(?<=[.!?])\s+(?=[A-Z0-9])/).map((text) => text.trim()).filter(Boolean)
    : [];
  const components = (fields.components ?? []).map((component) => component.name).filter(Boolean);
  const labels = fields.labels ?? [];

  return {
    key: data.key || fallbackKey,
    summary: fields.summary ?? "",
    description: adfToText(fields.description).trim(),
    acceptanceCriteria,
    issueType: fields.issuetype?.name ?? "",
    status: fields.status?.name ?? "",
    priority: fields.priority?.name ?? "",
    components,
    labels,
    browseUrl: `${baseUrl}/browse/${encodeURIComponent(data.key || fallbackKey)}`,
  };
}

export async function fetchJiraIssue(issueKey) {
  const { baseUrl, email, token } = getCredentials();
  await testJiraConnection();
  const encodedKey = encodeURIComponent(issueKey);
  const options = { headers: headers(email, token) };
  let response = await requestJira(
    `${baseUrl}/rest/api/3/issue/${encodedKey}?fields=*all&expand=names`,
    options
  );
  if (response.status === 404) {
    response = await requestJira(
      `${baseUrl}/rest/api/2/issue/${encodedKey}?fields=*all&expand=names`,
      options
    );
  }
  if (!response.ok) throw jiraError(response.status);
  const data = await response.json();
  return extractIssue(data, baseUrl, issueKey);
}
