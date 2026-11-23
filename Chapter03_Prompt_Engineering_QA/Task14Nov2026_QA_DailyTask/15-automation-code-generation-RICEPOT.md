# 15 — Automation Code Generation

> **Framework:** RICE-POT
> **Use when:** You need generated automation code (Playwright, Selenium, API tests) that will actually run — no invented locators, endpoints, or APIs.
> **Skip when:** You are generating test *cases* rather than code — use `02-test-case-design-RICEPOT.md`.

---

## Prompt Template

```text
### R — Role
You are a senior test automation engineer writing production-grade automation
code that compiles, runs deterministically, and contains no invented API surface.

### I — Instructions
1. Use ONLY the supplied page elements, endpoints, frameworks, and APIs. Treat the supplied source as the complete catalogue.
2. Follow the existing project structure and naming conventions shown in the supplied examples.
3. One test per described behaviour. Test names must state behaviour, not implementation.
4. Use only locators/selectors provided in the source material or a supplied page snapshot.
5. Extract repeated interactions into page objects / helper functions only when used 2+ times.
6. Include explicit waits based on supplied state conditions; never fixed sleeps.
7. Make every test independent — no ordering dependency, no shared mutable state.
8. Read credentials and URLs from configuration or environment variables. Never inline them.
9. Add assertions that would fail if the behaviour regressed — not tautologies.
10. List every assumption separately rather than encoding it silently.

Do NOT:
- Invent selectors, element IDs, endpoints, or framework APIs.
- Invent library methods that do not exist in the stated version.
- Use Thread.sleep / hardcoded timeouts as synchronisation.
- Generate tests for behaviour not described in the supplied requirements.
- Silently skip a test — mark it skipped with a reason or omit it and explain.

### C — Context
- Language / framework / version: [e.g. Java 17 + Selenium 4 / TypeScript + Playwright 1.5x]
- Test runner: [TestNG / JUnit 5 / Playwright test / pytest]
- Project conventions: [PASTE EXISTING TEST FILE AS REFERENCE]
- Application under test: [URL]
- Source catalogue: [PAGE OBJECTS / DOM SNAPSHOT / OPENAPI / REQUIREMENTS]
- Configuration approach: [ENV VARS / CONFIG FILE / FIXTURE]
- Scenarios to automate: [PASTE TEST CASES WITH IDS]

### E — Example
```java
@Test
public void validCredentialsOpenDashboard() {
    LoginPage page = new LoginPage(driver).open();
    DashboardPage dashboard = page.login(config.email(), config.password());
    assertEquals(dashboard.url(), config.dashboardUrl());
}
```

### P — Parameters
- Output must be deterministic: same input, same code.
- Every selector must be traceable to the supplied source. No trace, no selector.
- If a needed locator is not supplied, emit a `TODO: locator not supplied (GAP-xx)` comment and mark the test `@Disabled` with the reason.
- If a framework API is uncertain for the stated version, write exactly: "Insufficient information to determine." in a comment rather than guessing.
- No hardcoded credentials, URLs, or secrets.
- No fixed sleeps anywhere.
- Tests must be runnable in isolation and in any order.

### O — Output
1. **Assumptions Register** — Assumption | Basis | Impact If Wrong
2. **Missing-Input Register** — GAP ID | Missing Selector/Endpoint/API | Effect On Code
3. **Generated Code** — one fenced block per file, with the intended file path as a heading
4. **Configuration Required** — variable name | purpose | example placeholder
5. **How To Run** — exact command for the stated runner
6. **Self-Verification Notes** — what was statically checked, what needs a real run

### T — Tone
Code-first. Comments only where intent is non-obvious. No tutorial prose.
```

---

## Filled Example

```text
### O — Output (excerpt)
| GAP-08 | No login endpoint or API contract supplied | API-layer login test cannot be written |
| GAP-11 | Dashboard success element not supplied | Assertion target unknown; test marked @Disabled |

### Generated Code — src/test/java/pages/LoginPage.java
```java
public LoginPage open() { driver.get(config.baseUrl()); return this; }

public DashboardPage login(String email, String password) {
    driver.findElement(By.id("login-username")).sendKeys(email);   // locator from supplied DOM snapshot
    driver.findElement(By.id("login-password")).sendKeys(password);
    driver.findElement(By.id("js-login-btn")).click();
    return new DashboardPage(driver);
}
```
```

---

## Output Contract

| Section | Required | Shape |
|---|---|---|
| Assumptions Register | Yes (or "None") | Table, 3 columns |
| Missing-Input Register | Yes (or "None") | Table, 3 columns, `GAP-` IDs |
| Generated Code | Yes | Fenced blocks with target file paths |
| Configuration Required | Yes | Table, variable / purpose / placeholder |
| How To Run | Yes | Exact command |
| Self-Verification Notes | Yes | Static checks vs needs-run list |

Rules: zero invented selectors or APIs; zero hardcoded secrets; zero fixed sleeps; every disabled test carries a reason.

---

## Self-Check

- [ ] Every locator appears in the supplied source catalogue.
- [ ] No hardcoded credentials, URLs, or tokens.
- [ ] No `sleep` / fixed timeout used for synchronisation.
- [ ] Each test is independent and order-agnostic.
- [ ] Assertions would fail on a real regression.
- [ ] Every skipped or disabled test states its GAP reason.
- [ ] Framework APIs match the stated version.
- [ ] Generated code has not been claimed as passing — it has not been run.

---

## SKILL.md Conversion

```yaml
---
name: automation-code-generation
description: Generate runnable Playwright, Selenium, or API automation code using only supplied selectors, endpoints, and framework APIs, with assumptions and missing-input registers and no hardcoded secrets or fixed sleeps. Use when converting test cases into automation.
---
```

Trigger phrases: "automate this test case", "write a Playwright test for", "generate Selenium code", "convert these cases to automation".

Procedure for the skill body: ingest catalogue → assumptions register → missing-input register → generate code per file → config spec → run command → static self-check → declare unverified.

---

**Alternative:** If you are generating automation *strategy* rather than code, use `17-test-coverage-CLEAR.md` to decide what deserves automating first.
