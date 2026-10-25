#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/../.env"

load_env_file() {
  local line key value line_number=0

  [[ -f "$ENV_FILE" ]] || return 0

  while IFS= read -r line || [[ -n "$line" ]]; do
    line_number=$((line_number + 1))
    [[ "$line" =~ ^[[:space:]]*$ || "$line" =~ ^[[:space:]]*# ]] && continue

    if [[ ! "$line" =~ ^[[:space:]]*(export[[:space:]]+)?([A-Za-z_][A-Za-z0-9_]*)[[:space:]]*=[[:space:]]*(.*)$ ]]; then
      printf 'Error: invalid entry in %s at line %d\n' "$ENV_FILE" "$line_number" >&2
      return 1
    fi

    key="${BASH_REMATCH[2]}"
    value="${BASH_REMATCH[3]}"
    value="${value#"${value%%[![:space:]]*}"}"
    value="${value%"${value##*[![:space:]]}"}"

    if [[ ${#value} -ge 2 ]]; then
      if [[ "$value" == \"*\" || "$value" == \'*\' ]]; then
        value="${value:1:${#value}-2}"
      fi
    fi

    case "$key" in
      JIRA_BASE_URL)
        [[ -n "${JIRA_BASE_URL:-}" ]] || JIRA_BASE_URL="$value"
        ;;
      JIRA_EMAIL)
        [[ -n "${JIRA_EMAIL:-}" ]] || JIRA_EMAIL="$value"
        ;;
      JIRA_TOKEN)
        [[ -n "${JIRA_TOKEN:-}" ]] || JIRA_TOKEN="$value"
        ;;
      JIRA_API_TOKEN)
        [[ -n "${JIRA_API_TOKEN:-}" ]] || JIRA_API_TOKEN="$value"
        ;;
    esac
  done < "$ENV_FILE"
}

usage() {
  printf 'Usage: %s <JIRA-ISSUE-KEY>\n' "${0##*/}" >&2
  printf 'Configure JIRA_BASE_URL, JIRA_EMAIL, and JIRA_TOKEN in %s or the environment.\n' "$ENV_FILE" >&2
}

if [[ $# -ne 1 ]]; then
  usage
  exit 2
fi

issue_key="$1"
if [[ ! "$issue_key" =~ ^[A-Za-z][A-Za-z0-9_]*-[0-9]+$ ]]; then
  printf 'Error: invalid JIRA issue key: %s\n' "$issue_key" >&2
  exit 2
fi

load_env_file
JIRA_TOKEN="${JIRA_TOKEN:-${JIRA_API_TOKEN:-}}"

if [[ -z "${JIRA_BASE_URL:-}" || -z "${JIRA_EMAIL:-}" || -z "$JIRA_TOKEN" ]]; then
  printf 'Error: JIRA_BASE_URL, JIRA_EMAIL, and JIRA_TOKEN must be configured.\n' >&2
  usage
  exit 2
fi

if [[ ! "$JIRA_BASE_URL" =~ ^https://[^/]+(/.*)?$ ]]; then
  printf 'Error: JIRA_BASE_URL must be an HTTPS URL.\n' >&2
  exit 2
fi

if ! command -v curl >/dev/null 2>&1; then
  printf 'Error: curl is required but was not found in PATH.\n' >&2
  exit 127
fi

curl --fail --silent --show-error --request GET \
  --url "${JIRA_BASE_URL%/}/rest/api/3/issue/${issue_key}" \
  --user "${JIRA_EMAIL}:${JIRA_TOKEN}" \
  --header "Accept: application/json"
