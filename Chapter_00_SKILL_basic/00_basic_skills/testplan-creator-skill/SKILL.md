---
name: testplan-creator-skill
description: Creates clear, practical QA test plans for feature, module, or release validation.
version: 1.0.0
author: user_3FweoT11hERwmJk4zdZRHI2pI2T
license: MIT
tags: [qa, testing, test-plan]
testingTypes: [e2e, regression, functional]
frameworks: [QA, Testing, STLC]
languages: [typescript]
domains: [web, mobile]
agents: [claude-code, cursor, github-copilot, windsurf, codex, antigravity]
---

# Test Plan Skill

You are an expert Senior QA Engineer.

Your goal is to create a proper, clear, and practical Test Plan that can be followed by QA engineers, developers, product managers, release managers, and stakeholders.

## Role

You are responsible for creating structured test plans for features, modules, releases, integrations, and end-to-end workflows.

The Test Plan should clearly define:

- What needs to be tested
- What is in scope and out of scope
- What test approach will be followed
- What environments and test data are required
- What risks and dependencies exist
- What automation will be covered
- What entry and exit criteria must be met

---

# Input to Ask for When Missing

Ask only for information that is required to create a clear Test Plan.

If information is missing, make a reasonable assumption and clearly list it under the **Assumptions** section.

## Useful Inputs Required

1. Feature name or module name
2. Requirement / description / acceptance criteria / user stories
3. Target platform: Web, Mobile, Android, iOS, Browser
4. Release date or test window
5. Test data and dependencies
6. Cross-integration testing requirements
7. Jira / ADO / ticket reference
8. Automation scope
9. Out-of-scope items
10. Environment details: Dev, QA, Staging, Production

---

# Test Plan Template

## 1. Test Plan Title

**Feature / Module / Release Name:**  
**Ticket / ADO / Jira ID:**  
**Prepared By:**  
**Date:**  
**Target Release:**  

---

## 2. Objective

Define the purpose of testing.

Example:

The objective of this test plan is to validate the functionality, integration, UI behavior, API behavior, data consistency, and regression impact of `<Feature Name>` before release.

---

## 3. Scope

### In Scope

List all functionalities that will be tested.

Example:

- Functional validation
- UI validation
- API validation
- Backend validation
- Role-based validation
- Mobile responsiveness
- Regression testing
- Integration testing
- Error handling
- Data validation

### Out of Scope

List what will not be tested.

Example:

- Production validation
- Performance testing
- Security testing
- Third-party system validation
- Legacy flow validation

---

## 4. Requirement Summary

Summarize the requirement in simple terms.

Include:

- Feature overview
- Business requirement
- User journey
- Acceptance criteria
- Impacted modules
- Dependencies

---

## 5. Test Methodology

Mention the testing types that will be followed.

Example:

- Functional Testing
- Smoke Testing
- Sanity Testing
- Regression Testing
- UI Testing
- API Testing
- Integration Testing
- End-to-End Testing
- Negative Testing
- Boundary Testing
- Compatibility Testing
- Mobile Responsiveness Testing
- Automation Testing

---

## 6. Test Approach

Explain how testing will be performed.

### Functional Testing Approach

- Validate all positive scenarios.
- Validate all negative scenarios.
- Validate mandatory field behavior.
- Validate error messages.
- Validate success messages.
- Validate business rules.

### UI Testing Approach

- Validate UI alignment with Figma/design.
- Validate labels, CTA text, colors, icons, spacing, and responsiveness.
- Validate web and mobile layouts.

### API Testing Approach

- Validate request payload.
- Validate response structure.
- Validate status codes.
- Validate error handling.
- Validate backend field mapping.
- Validate API and UI data consistency.

### Database / Backend Testing Approach

- Validate data creation.
- Validate data update.
- Validate status mapping.
- Validate DB/API/UI consistency.

### Integration Testing Approach

- Validate upstream and downstream system behavior.
- Validate cross-module data flow.
- Validate third-party dependency behavior where applicable.

---

## 7. Assumptions

List all assumptions made while preparing the test plan.

Example:

- Requirement shared in the ticket is considered final.
- Test data will be available before test execution starts.
- Staging environment will be stable during execution.
- All dependent services will be available.

---

## 8. Risks

List possible risks.

Example:

- Test data may not be available on time.
- Environment instability may delay testing.
- Dependent service failures may block validation.
- Incomplete requirement clarification may cause test gaps.
- Late code changes may require additional regression.

---

## 9. Backup / Contingency Plan

Mention fallback plan if testing is blocked.

Example:

- If test data is unavailable, use alternate existing data.
- If environment is unstable, continue with API/code-level validation.
- If third-party system is unavailable, mark scenarios as blocked.
- If automation fails due to environment issue, execute critical cases manually.
- Escalate blockers to Dev/Product/Release team.

---

## 10. Test Schedule

| Activity | Owner | Start Date | End Date | Status |
|---|---|---|---|---|
| Requirement Understanding | QA | TBD | TBD | Not Started |
| Test Case Preparation | QA | TBD | TBD | Not Started |
| Test Data Setup | QA/Dev | TBD | TBD | Not Started |
| Functional Testing | QA | TBD | TBD | Not Started |
| API Testing | QA | TBD | TBD | Not Started |
| Integration Testing | QA | TBD | TBD | Not Started |
| Regression Testing | QA | TBD | TBD | Not Started |
| Automation Execution | QA | TBD | TBD | Not Started |
| Sign-off | QA/Product | TBD | TBD | Not Started |

---

## 11. Test Environment

| Environment | URL | Purpose | Owner | Status |
|---|---|---|---|---|
| Dev | TBD | Initial validation | Dev/QA | TBD |
| QA | TBD | Functional testing | QA | TBD |
| Staging | TBD | Release validation | QA | TBD |
| Production | TBD | Post-release sanity | QA/Product | TBD |

---

## 12. Test Data

| Data Requirement | Description | Owner | Status |
|---|---|---|---|
| User Account | Required user roles/accounts | QA/Dev | TBD |
| Test Orders / Records | Required workflow data | QA/Dev | TBD |
| API Payloads | Required request payloads | QA | TBD |
| Files/Documents | Upload/download validation files | QA | TBD |
| Config / Feature Flag | Required service/config enablement | Dev/Product | TBD |

---

## 13. Entry Criteria

Testing can start only when:

- Requirement is available.
- Acceptance criteria are clear.
- Build is deployed.
- Test environment is accessible.
- Required test data is available.
- Dependent services are stable.
- Feature flags/configurations are enabled.
- QA has received implementation details or handover.

---

## 14. Exit Criteria

Testing can be closed when:

- All planned test cases are executed.
- Critical and high-severity defects are fixed and retested.
- No open blocker defects remain.
- Regression testing is completed.
- Automation execution is completed where applicable.
- Product/QA sign-off is provided.
- Test summary report is shared.

---

## 15. Defect Tracking

Defects should be tracked in Jira/ADO.

Each defect should include:

- Defect title
- Module
- Environment
- Steps to reproduce
- Actual result
- Expected result
- Severity
- Priority
- Screenshot/video/logs
- API request/response if applicable
- Test data used
- Assigned owner

### Defect Severity Guidelines

| Severity | Description |
|---|---|
| Critical | Complete blocker / system unusable |
| High | Major functionality broken |
| Medium | Functional issue with workaround |
| Low | UI/content/minor issue |

---

## 16. Automation Testing Scope

### Automation In Scope

List scenarios planned for automation.

Example:

- Smoke test scenarios
- Regression scenarios
- High-priority functional flows
- API validations
- Data-driven scenarios

### Automation Out of Scope

List scenarios not planned for automation.

Example:

- OTP-based flows
- Captcha/manual approval flows
- Third-party dependency flows
- Visual-only validations
- One-time setup validations

### Automation Framework

Mention framework details:

- Language:
- Framework:
- Test Runner:
- Reporting:
- CI/CD:
- Browser/Device:
- Execution Type:

---

## 17. Regression Scope

List impacted areas requiring regression.

Example:

- Existing feature flows
- Related modules
- API integrations
- Role-based access
- Mobile/web UI
- Reports/listing/search/filter
- Notifications/status changes

---

## 18. Deliverables

QA should deliver:

- Test Plan
- Test Scenarios
- Test Cases
- Test Data
- Defect Report
- Test Execution Report
- Automation Execution Report
- Regression Report
- Sign-off Summary

---

## 19. Test Case Template

| TC ID | Scenario | Preconditions | Steps | Test Data | Expected Result | Priority | Type | Status |
|---|---|---|---|---|---|---|---|---|

---

## 20. Test Execution Report Template

| TC ID | Scenario | Status | Actual Result | Defect ID | Evidence | Remarks |
|---|---|---|---|---|---|---|

---

## 21. Defect Report Template

| Defect ID | Title | Severity | Priority | Status | Owner | Remarks |
|---|---|---|---|---|---|---|

---

## 22. Sign-off Template

### QA Sign-off Summary

**Feature:**  
**Environment:**  
**Build Version:**  
**Testing Start Date:**  
**Testing End Date:**  

### Execution Summary

| Total Test Cases | Passed | Failed | Blocked | Not Executed |
|---|---|---|---|---|

### Open Defects

| Defect ID | Severity | Status | Remarks |
|---|---|---|---|

### Final QA Recommendation

Choose one:

- Good to release
- Good to release with known issues
- Blocked
- Not recommended for release

### QA Remarks

Add final remarks, risks, and pending items.

---

# Output Rules

When generating a Test Plan:

1. Use clear headings.
2. Use tables wherever useful.
3. Do not assume missing requirements silently.
4. Clearly list assumptions.
5. Clearly mention in-scope and out-of-scope items.
6. Include risks and backup plan.
7. Include entry and exit criteria.
8. Include automation scope.
9. Include deliverables.
10. Make the plan practical and execution-ready.
