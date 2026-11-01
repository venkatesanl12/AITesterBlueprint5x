# Salesforce Selenium Framework: RICE POT Prompt

**RICE POT** = **R**ole · **I**nstructions · **C**ontext · **E**xamples · **P**arameters · **O**utput Format · **T**one

---

## R: Role

Act as a Principal SDET / Test Automation Architect with 15+ years of experience building enterprise-grade Selenium frameworks, with deep hands-on expertise in Salesforce.com and CI/CD.

---

## I: Instructions

Build a production-ready Selenium WebDriver automation framework **from scratch** for Salesforce Lightning Experience. Work step by step:

1. Propose the architecture and folder structure.
2. Generate `pom.xml` and the config layer.
3. Build the driver, base classes, and utilities.
4. Build Page Objects
5. Write the sample tests and `testng.xml`.
6. Add reporting, logging, listeners, and retry.
7. Add the CI/CD pipeline and Docker/Grid setup.
8. Provide the README and a final hardening checklist.

After each step, give a one-line summary and continue unless I say otherwise.

### Quality Rules

- Follow SOLID, DRY, and clean-code principles; no static WebDriver.
- Every test must be independent, idempotent, and clean up its own data.
- No hardcoded waits, credentials, or environment URLs.
- Retry only for known infra flakiness, never to hide real failures.
- Comment every non-obvious Salesforce-specific workaround.
- Flag assumptions and call out risks (MFA, org limits, API limits).
- Do not invent APIs or library methods; if unsure, say so.

---

## C: Context

- **Application under test:** Salesforce Lightning Experience (Sales Cloud; Service Cloud optional) on a Developer Edition / Sandbox org (**never production**).
- **Goals:** maintainable, stable (non-flaky), parallel-ready, data-driven, CI/CD-ready, and onboardable by a new QE within a day.
- **Team:** QE team of 5, Git-based workflow, Jenkins or GitHub Actions for CI.

### Challenges to Solve Explicitly

1. Dynamic element IDs and Aura/LWC components
2. Lightning spinners, toasts, modals, and lazy-loaded related lists
3. Login with MFA / IP restrictions (sandbox users, session reuse, or `frontdoor.jsp` with a session ID obtained via API)
4. Test data setup/cleanup via Salesforce REST API / SOQL instead of the UI
5. Multiple environments (dev, QA, UAT) and multiple user profiles/roles

---

## E: Examples (Reference Scenarios to Automate)

1. Login → verify Home page → Logout
2. Create / Edit / Delete a Lead, then Convert Lead to Account + Contact + Opportunity
3. Create an Opportunity, move it across stages, mark Closed Won
4. Global search + list view filtering + sorting
5. Basic Report / Dashboard component validation
6. Negative test: required-field validation errors on a record form

---

## P: Parameters (Tech Stack & Constraints)

| Area | Requirement |
|---|---|
| Language | Java 17 (if you recommend otherwise, state why) |
| Automation | Selenium 4.x (native shadow root support, relative locators where useful) |
| Test runner | TestNG (parallel execution, DataProvider, listeners) |
| Build tool | Maven |
| Design | Page Object Model + reusable Lightning Components layer (LightningButton, LightningInput, LightningCombobox, LightningDatePicker, Toast, Modal, RelatedList, Spinner) |
| Reporting | Allure (or ExtentReports) with screenshots on failure |
| Logging | Log4j2 |
| Config | `.properties` / YAML per environment + environment variables for secrets |
| Test data | JSON/Excel + Faker; API utilities with REST Assured |
| Cross-browser | Chrome, Firefox, Edge; headless mode; Selenium Grid / Docker |
| Locator priority | Stable attributes (`data-*`, `aria-label`, `lightning-*` tags, `name`) > CSS > XPath (last resort). No absolute XPaths |
| Waits | Explicit/fluent waits only. No `Thread.sleep` |
| CI/CD | Jenkinsfile or GitHub Actions workflow with parameterized browser/env/suite and report publishing |

---

## O: Output Format

Deliver in this order, with the **file path as a heading** above each well-commented, compilable, copy-paste-ready code block:

1. Architecture overview + folder/package structure (tree view)
2. `pom.xml` with all dependencies and plugins
3. Core framework: `DriverFactory` (ThreadLocal WebDriver), `BasePage`, `BaseTest`, `ConfigReader`, `WaitUtils`,JS executor utils, Lightning component wrappers, listeners (screenshot, retry analyzer, reporting hooks)
4. Page Objects: `LoginPage`, `HomePage`, `LeadsPage`, `OpportunitiesPage`
5. Sample tests for the example scenarios
6. API utility for auth (OAuth/session) and data setup/cleanup
7. `testng.xml` (smoke + regression + parallel config)
8. CI/CD pipeline file
9. README: setup, run commands, conventions, troubleshooting

---

## T: Tone

Professional, precise, and mentor-like. Briefly explain the "why" behind key design decisions, avoid fluff, and write for a mid-to-senior QE audience. Be candid about trade-offs and risks rather than overselling the design.