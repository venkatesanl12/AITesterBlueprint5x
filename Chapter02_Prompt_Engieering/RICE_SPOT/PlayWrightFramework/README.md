# OpenCart Playwright Framework

TypeScript starter framework for browser UI, public storefront JSON, and hybrid checks against the shared OpenCart demo. The target site is shared and mutable: examples use read-only product/cart checks and do not register accounts, place orders, or change demo data.

## Architecture

```text
PlayWrightFramework/
  .github/workflows/playwright.yml
  src/
    api/                 Typed request client and Zod response schema
    components/          Search, cart summary, and alert components
    config/              Validated environment and generated-state paths
    data/                Faker-backed unique account factory
    fixtures/            Page-object and API-client fixtures
    pages/               Base, home, search, product, and login pages
    utils/               Structured console logger
  tests/
    api/                 Verified public JSON and storefront routes
    hybrid/              API discovery followed by UI verification
    ui/                   Search and product-detail browser flow
  global-setup.ts         Optional login and storageState generation
  playwright.config.ts    API, Chromium, Firefox, WebKit, and hybrid projects
```

The demo exposes a public `route=api/cart/products` JSON response and HTML search route. The OpenCart installation's admin-managed API user/key and authenticated cart endpoints are not configured here, so the API suite is deliberately limited to verified public behavior; it does not claim coverage of authenticated REST operations.

## Setup

Requirements: Node.js 22+ and npm. Install the dependencies and copy the sample environment:

```bash
npm ci
cp .env.example .env
npx playwright install chromium firefox webkit
```

Set `BASE_URL` in `.env` to the intended OpenCart target. The environment loader fails clearly when the URL is missing or invalid. Never place real credentials in `.env.example` or commit `.env`.

## Run

```bash
npm test
npm run test:smoke
npm run test:api
npx playwright test --project=ui-firefox
npx playwright test --project=ui-webkit
npx playwright test --grep @e2e

# Visible desktop Chrome session
npm run test:headed

# Inspector and visible Chrome
npm run test:debug

# Trace/report tools
npx playwright show-trace test-results/<test-folder>/trace.zip
npm run test:report
```

Tags used: `@smoke`, `@regression`, `@api`, and `@e2e`. CI retries once and captures a trace on retry; local runs do not retry. Screenshots are retained on failure and videos on retry/failure.

## Conventions and extension points

- Prefer role, label, placeholder, and text locators; use scoped CSS only where the legacy storefront has no semantic hook.
- Keep assertions in tests; page objects provide navigation and actions.
- Use per-test browser contexts and API request fixtures. The Faker account factory supports future registration flows, but tests must not create persistent demo accounts without a verified cleanup path.
- Use `OpenCartApiClient` for known public routes and validate JSON with Zod. Add authenticated routes only after an administrator configures and verifies API access in a non-production environment.
- `global-setup.ts` creates `playwright/.auth/user.json` only when both `AUTH_EMAIL` and `AUTH_PASSWORD` are set. Configure a dedicated demo account; an invalid login fails setup explicitly. Generated auth state is git-ignored.
- Environment variables: `BASE_URL`, `TEST_TIMEOUT_MS`, `EXPECT_TIMEOUT_MS`, `WORKERS`, and optional `AUTH_EMAIL` / `AUTH_PASSWORD`.

## Quality and CI

```bash
npm run lint
npm run typecheck
npm run format:check
```

The GitHub Actions workflow runs the API, Chromium, Firefox, WebKit, and hybrid projects in two shards and uploads reports/traces. Define the repository variable `OPENCART_BASE_URL` for CI. The Docker image uses the matching official Playwright browser image:

```bash
docker build -t opencart-playwright .
docker run --rm -e BASE_URL="$OPENCART_BASE_URL" opencart-playwright
```

## Hardening checklist and known limits

- [ ] Configure a private/staging OpenCart instance for account, checkout, and mutation tests.
- [ ] Verify API user/key setup and permissions before implementing authenticated API coverage.
- [ ] Add teardown only for records owned by the current test; never clean up shared demo data by broad queries.
- [ ] Verify selectors and product availability when the public demo is upgraded.
- [ ] Review report/video retention before uploading data from any environment containing personal information.
- The public storefront is shared and may change or rate-limit requests. Tests do not assume unique control of its catalog.
- Authentication reuse is opt-in and requires working credentials; no credentials are included.
- Cart JSON shape and product ID 41 were observed on the live demo during framework creation and may change.
