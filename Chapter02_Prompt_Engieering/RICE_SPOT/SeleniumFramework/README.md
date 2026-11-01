# Salesforce Selenium Framework

Java 17, Selenium 4, TestNG, Maven, REST Assured, Allure, and Log4j2 starter framework for non-production Salesforce Lightning orgs.

## Architecture

```text
src/main/java/com/aitester/salesforce/
  api/          Authenticated REST API create/query/delete client
  components/   Reusable Lightning controls
  config/       Properties and environment-variable configuration
  driver/       ThreadLocal local/Grid browser lifecycle
  listeners/    Failure screenshot attachment and infra-only retry
  pages/        Login, Home, Leads, and Opportunities page objects
  utils/        Explicit waits, locator parsing, JS, native shadow roots
src/test/java/  Shared lifecycle, browser fixture, sandbox-gated scenarios
src/test/resources/
  config/       dev, qa, uat
  locators.properties
  testng-smoke.xml
  testng-regression.xml
```

The browser smoke test uses a local HTML data URL and verifies a click plus native Shadow DOM lookup without Salesforce credentials. Salesforce login and API-driven record tests are explicitly gated until sandbox credentials and verified org-specific UI selectors are supplied.

## Build and run

Requirements: Java 17+, Maven 3.9+, and a supported browser. Selenium Manager obtains a local driver as needed.

```bash
mvn -Psmoke test
mvn -Pregression test

# Visible Chrome on a desktop session
mvn -Pregression test -Dbrowser=chrome -Dheadless=false
```

Configuration precedence: JVM system properties, environment variables, then the selected properties file. Select QA, for example:

```bash
mvn -Pregression test -Denvironment=qa \
  -Dconfig.file=src/test/resources/config/qa.properties
```

Supply secrets through the process environment or CI secret store, not committed files:

```text
SF_BASE_URL
SF_USERNAME
SF_PASSWORD
SF_INSTANCE_URL
SF_ACCESS_TOKEN
SELENIUM_REMOTE_URL
```

The API client consumes an externally obtained Salesforce OAuth access token; authentication/MFA is not bypassed or automated. Never point tests at production. Use a dedicated least-privilege sandbox user and confirm org/API limits.

## Salesforce configuration

Populate `src/test/resources/locators.properties` with selectors verified in the target org. Blank selectors are intentional: Lightning markup varies by release, profile, locale, and enabled features, so they are not fabricated. Configure exact record view paths and row locators. Set `salesforce.opportunityStage` to a stage available in that org. Review required fields, validation rules, record sharing, and API permissions before enabling integration tests.

The Lead example creates each record via REST, verifies it in the configured UI list, and deletes its own record in `finally`. The Opportunity example creates its own Account and Opportunity and removes both. Generated data are independent for parallel execution. API calls fail explicitly for non-success responses.

## Reports and logs

Surefire HTML: `target/surefire-reports/index.html`.

Generate and open the Allure report:

```bash
allure generate target/allure-results --clean -o target/allure-report
```

Allure HTML: `target/allure-report/index.html`. Log4j2 writes to console and `target/logs/selenium-framework.log`. TestNG listeners attach screenshots on failures. Retry is enabled only on sandbox tests and only for an allowlist of browser transport failures; assertion failures are not retried.

## Grid and CI

```bash
docker compose up -d
mvn -Pregression test -Dselenium.remoteUrl=http://localhost:4444 -Dheadless=true
docker compose down
```

The GitHub Actions workflow supports choosing environment and suite, runs headless Chrome and uploads Surefire/Allure results. Configure CI `SF_*` secrets before enabling sandbox scenarios.

## Hardening checklist and scope

- Verify selectors and login behavior in each sandbox; MFA, SSO, and IP restrictions are environment prerequisites.
- Use per-test unique records, teardown only data owned by that test, and review Salesforce API limits.
- Protect credentials and redact sensitive fields from screenshots and reports.
- Pin CI browser/Grid versions together; validate Firefox and Edge on the target runners.
- Use explicit frame switching for any org-specific iframe; no iframe is assumed.
- Lead conversion, edit/delete, global search, dashboard/report, and required-field negative flows need verified org-specific selectors, permissions, and expected results before deterministic tests can be added.
