# Playwright Framework for OpenCart: RICE POT Prompt

**RICE POT** = **R**ole · **I**nstructions · **C**ontext · **E**xamples · **P**arameters · **O**utput Format · **T**one

**Application under test:** https://naveenautomationlabs.com/opencart/

---

## R: Role

Act as a Senior SDET / Test Automation Architect with 15+ years of experience designing enterprise-grade Playwright (TypeScript) frameworks that cover both UI and API testing, with strong expertise in fixtures, Page Object Model, test data strategy, CI/CD, and flaky-test elimination.

---

## I: Instructions

Build a production-ready Playwright Test framework **from scratch** for https://naveenautomationlabs.com/opencart/ covering **both UI and API scenarios**. Work step by step:

1. Propose the architecture, folder structure, and design decisions.
2. Generate project setup (`package.json`, `tsconfig`, `playwright.config.ts`, `.env` files, ESLint/Prettier config).
3. Build the core layer (custom fixtures, base page, utilities, config/env handling, logger).
4. Build Page Objects and reusable UI components.
5. Build the API layer (typed API client, request helpers, schema validation, auth handling).
6. Write UI tests, API tests, and hybrid tests (API setup + UI verify).
7. Add auth reuse (`storageState`), tagging, reporting, tracing, and retries.
8. Add the CI/CD pipeline (GitHub Actions) with sharding and Docker.
9. Provide the README and a final hardening checklist.

After each step, give a one-line summary and continue unless I say otherwise.

### Best-Practice Rules (Non-Negotiable)

- **Locators:** prefer `getByRole`, `getByLabel`, `getByPlaceholder`, `getByText`, `getByTestId`; CSS second; XPath only as a last resort. No brittle absolute selectors.
- **Waiting:** rely on Playwright auto-waiting and web-first assertions (`expect(locator).toBeVisible()`). No `waitForTimeout` or hard sleeps.
- **Isolation:** tests must be independent, parallel-safe, and idempotent; each test creates and cleans up its own data.
- **Fixtures:** use custom fixtures via `test.extend` for page objects, API clients, and test data, rather than heavy `beforeEach` setup or inheritance chains.
- **Assertions:** keep assertions in tests, not buried inside page objects (page objects expose actions and state getters).
- **Secrets:** no hardcoded URLs, credentials, or secrets; use `.env` + environment variables, and keep secrets out of the repo.
- **Data setup:** use API calls for test data setup and cleanup wherever possible; the UI is for what the UI is meant to verify.
- **Retries:** retry only in CI, trace on first retry; never use retries to hide real failures.
- **Comments:** briefly comment every non-obvious design decision.
- **Honesty:** do not invent Playwright APIs or OpenCart endpoints. If unsure, say so and tell me how to verify (codegen, DevTools Network tab, or the docs).

---

## C: Context

- **Application under test:** OpenCart demo storefront at https://naveenautomationlabs.com/opencart/ (public, shared demo site).
- **Key flows:** registration, login/logout, product search, category browsing, product details, add to cart, wishlist, product comparison, checkout, account management, order history.
- **My role:** Senior SDET. The framework should be a reference-quality portfolio and team-ready project: clean, scalable, and easy for a new QE to onboard in a day.

### Challenges to Handle Explicitly

1. **Shared public demo site:** unique test data per run (Faker + timestamps), parallel-safe user creation, and safe cleanup.
2. **API coverage:** OpenCart's REST-style API requires API user/key setup in the admin panel and may not be exposed on the demo. First, discover what is actually available (`route=api/...` endpoints, network calls made by the storefront). Flag clearly if a true API is unavailable, and propose a fallback (for example, validating the storefront's AJAX/JSON endpoints such as cart add/remove, plus a clearly labeled public practice API for demonstrating the API layer patterns).
3. **Stable locators** on a legacy-style Bootstrap UI with limited test IDs.
4. **Login session reuse** across tests via `storageState`.
5. **Flaky dynamic content** (alerts, cart badge updates, dropdown menus).

---

## E: Examples

### UI Scenarios

1. Register a new user → verify account success page → logout
2. Login with valid / invalid credentials (data-driven negative tests)
3. Search a product → verify results → open product details
4. Add product to cart → update quantity → remove item → verify totals
5. Add to wishlist and compare two products
6. End-to-end checkout (guest and logged-in user)
7. Account page: edit profile / change password

### API Scenarios

Verify the real endpoints first, per the context above.

1. Authenticate with the API and validate the response schema
2. Cart add / view / remove via API, with status code, body, and schema checks
3. Negative cases: invalid credentials, missing params, unauthorized access
4. Hybrid: create data via API, then verify it in the UI

### Illustrative Code Style

Adapt, don't copy blindly. Locators are starting points; verify with `npx playwright codegen`.

**`fixtures/test-fixtures.ts`**

```typescript
import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

type Fixtures = { loginPage: LoginPage };

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});
export { expect };
```

**`pages/login.page.ts`**

```typescript
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly email: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;

  constructor(private readonly page: Page) {
    this.email = page.getByPlaceholder('E-Mail Address');
    this.password = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async goto() {
    await this.page.goto('index.php?route=account/login');
  }

  async login(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}
```

**`tests/ui/login.spec.ts`**

```typescript
import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Login @smoke', () => {
  test('valid user can log in', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login(process.env.USER_EMAIL!, process.env.USER_PASSWORD!);
    await expect(page).toHaveURL(/account\/account/);
  });
});
```

**`tests/api/example.api.spec.ts`** (illustrative: confirm real routes first)

```typescript
import { test, expect } from '@playwright/test';

test('API: request returns expected status @api', async ({ request }) => {
  const response = await request.get('index.php', {
    params: { route: 'product/search', search: 'iMac' },
  });
  expect(response.ok()).toBeTruthy();
});
```

---

## P: Parameters (Tech Stack & Constraints)

| Area | Requirement |
|---|---|
| Language | TypeScript (strict mode), Node.js LTS |
| Test runner | `@playwright/test` (latest stable) |
| Design | Page Object Model + custom fixtures + reusable components (Header/NavMenu, SearchBar, CartSummary, AlertBanner) |
| Projects | `ui-chromium`, `ui-firefox`, `ui-webkit`, and a separate `api` project (no browser) |
| Config | `baseURL`, timeouts, and retries driven by config and environment |
| Auth | Global setup creating `storageState` for reusable logged-in sessions |
| Test data | Faker + typed data factories; JSON for static data; data-driven tests via parameterization |
| API layer | Typed API client class wrapping `APIRequestContext`; schema validation with Zod; reusable assertion helpers |
| Tagging | `@smoke`, `@regression`, `@api`, `@e2e` (run via `--grep`) |
| Reporting | Built-in HTML reporter + trace, screenshot on failure, video on first retry; optional Allure |
| Environment | `dotenv` with `.env.example` (never commit real secrets) |
| Code quality | ESLint (with the Playwright plugin), Prettier, optional Husky pre-commit hook |
| CI/CD | GitHub Actions with matrix browsers, sharding, artifact upload (report + traces), parameterized environment and tag; Dockerfile using the official Playwright image |
| Parallelism | `fullyParallel` enabled; tests must not share mutable state |

---

## O: Output Format

Deliver in this order, with the **file path as a heading** above each well-commented, compilable, copy-paste-ready code block:

1. Architecture overview + folder structure (tree view) with rationale
2. `package.json`, `tsconfig.json`, `playwright.config.ts`, `.env.example`, ESLint/Prettier config
3. Core layer: fixtures, base utilities, config/env loader, logger, data factories
4. Page Objects and UI components
5. API layer: API client, schemas, helpers
6. Tests: UI, API, and hybrid, tagged and data-driven where useful
7. Global setup (auth `storageState`) and teardown/cleanup strategy
8. GitHub Actions workflow + Dockerfile
9. README: setup, run commands (by tag, project, browser, headed/debug, trace viewer), conventions, and troubleshooting
10. Final hardening checklist and a short list of risks/assumptions (shared demo site, API availability, data collisions)

---

## T: Tone

Professional, precise, and mentor-like. Briefly explain the "why" behind key design decisions, avoid fluff, and write for a senior QE audience. Be candid about trade-offs, limitations of the demo site, and anything you are unsure about, rather than overselling the design.