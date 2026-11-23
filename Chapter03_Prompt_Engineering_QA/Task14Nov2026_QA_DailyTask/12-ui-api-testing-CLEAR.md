# 12 — UI and API Testing

> **Framework:** CLEAR
> **Use when:** You need a combined UI + API verification pass for a feature, with request/response assertions and a UI-to-API cross-check.
> **Skip when:** Only screen behaviour matters — use `02-test-case-design-RICEPOT.md`.

---

## Prompt Template

```text
### C — Context
I need to verify [FEATURE] at both the UI and API layers.
- Product / module: [PRODUCT, MODULE]
- UI under test: [URL, SCREEN]
- API base URL: [BASE URL]
- Requirements / contract: [PASTE REQS, OPENAPI SPEC, OR SAMPLE RESPONSES]
- Auth method: [TOKEN TYPE, HEADER NAME — placeholders only]
- Environment: [ENV, BUILD, BROWSER]
- Known data: [SEED DATA, EXISTING IDs]

### L — Limits
- Use only the supplied endpoints and fields. Do not invent parameters, headers, or status codes.
- Every API case must assert: HTTP status, response body shape, and at least one field-level value.
- Every UI case must assert an observable element state, not a feeling.
- Include at least one UI↔API consistency case per feature flow.
- Negative API cases must state which validation layer is expected to reject (client, gateway, service).
- Do not assert exact error message text unless it was supplied.
- No performance, load, or security-penetration testing here.

### E — Examples
API:
| API-01 | POST /login | {"email":"<registered_email>","password":"<valid_password>"} | 200 | token present, non-empty | Body contains token and user object |
UI:
| UI-01 | Login screen | Valid credentials submitted | Dashboard loads, user menu shows account name | Screenshot evidence |
Hybrid:
| HYB-01 | Login | UI submit → capture login API response | UI success matches API 200 + token | No silent failure |

### A — Action
Produce UI cases, API cases, and hybrid consistency cases covering the feature's
happy path, at least three negative paths, and one contract-shape check.

### R — Review
Verify:
- Every API case names method, path, payload, expected status, and body assertion.
- Every negative case names the rejecting layer.
- Hybrid cases prove the UI reflects the actual API outcome.
- No invented endpoints, fields, or status codes.
- Auth values are placeholders.
```

---

## Filled Example

```text
### C — Context
- Product / module: VWO — Login
- UI: https://app.vwo.com/ | API base: [NOT SUPPLIED]
- Contract: PRD §4 only; no OpenAPI spec supplied
- Auth: not applicable to login endpoint itself

### A — Action (output excerpt)
| UI-01 | Login screen | Submit valid credentials | Dashboard opens; account name visible in header | Verified |
| HYB-01 | Login | Capture the login request during UI submit | Request payload contains email and password; response returns auth token | Insufficient information to determine. (GAP-08: no API endpoint or contract supplied, so the request cannot be verified.) |

### R — Review
API-layer cases for login are blocked: GAP-08 — endpoint path, request schema, and
response body are not supplied. UI cases proceed independently.
```

---

## Output Contract

| Section | Required | Shape |
|---|---|---|
| Coverage Map | Yes | Requirement \| UI Case IDs \| API Case IDs \| Hybrid Case IDs |
| UI Test Cases | Yes | ID \| Screen \| Action \| Expected Element State \| Confidence |
| API Test Cases | Yes | ID \| Method \| Path \| Payload \| Expected Status \| Body Assertion \| Rejecting Layer |
| Hybrid Consistency Cases | Yes | ID \| Flow \| UI Expectation \| API Expectation \| Consistency Check |
| Environment and Auth | Yes | Placeholders only |
| Blocked Cases | Yes (or "None") | ID \| GAP ID \| Missing Contract Detail |

Rules: every API case asserts status + shape + one field; every negative names the rejecting layer; no invented status codes.

---

## Self-Check

- [ ] No endpoint, field, header, or status code appears that was not supplied.
- [ ] Each API case asserts status, body shape, and a field value.
- [ ] Each negative case names the layer expected to reject.
- [ ] Hybrid cases genuinely compare UI outcome to API outcome.
- [ ] Auth tokens and credentials are placeholders.
- [ ] Blocked cases cite a GAP ID rather than guessing the contract.

---

## SKILL.md Conversion

```yaml
---
name: ui-api-testing
description: Design and record UI, API, and hybrid consistency tests for a feature, asserting status codes, response shape, and observable UI state without inventing endpoints. Use when a feature must be verified at both layers.
---
```

Trigger phrases: "test the API for", "UI and API testing", "verify the endpoint", "cross-check UI against API".

Procedure for the skill body: establish contract → UI cases → API cases → hybrid cases → negative cases with rejecting layer → blocked register → self-check.

---

**Alternative:** If you have an OpenAPI spec and need requirement-to-endpoint traceability rather than case design, use `06-rtm-RICEPOT.md` with endpoints as the test column.
