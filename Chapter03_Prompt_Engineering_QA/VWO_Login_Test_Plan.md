# Test Plan - Login Module

## Test Plan ID and Title

- **Test Plan ID:** TP-LOGIN-001
- **Title:** Functional Test Plan for the VWO Login Module
- **Target URL:** https://app.vwo.com/
- **Requirements source:** Approved login requirements supplied in `STAR.md`

---

## 1. Test Plan

### Objective

Verify that the login module permits registered users to log in with valid credentials, prevents invalid credentials from granting access, enforces mandatory email and password fields, and opens the authenticated dashboard after successful login.

### Scope

#### In Scope

- Valid login for a registered user
- Invalid email and/or password combinations
- Mandatory email and password fields
- Invalid-login error handling
- Redirection to the authenticated dashboard after successful login
- Dashboard access protection for unauthenticated users
- Positive, negative, and boundary scenarios that can be supported by the supplied requirements
- Desktop browser behavior, subject to environment availability

#### Out of Scope

- Registration and account creation
- Password reset and account recovery
- Email verification
- Password complexity and password-format policies
- Account lockout and brute-force protection
- Single sign-on and third-party authentication
- Role-based permissions and dashboard feature testing
- Security penetration testing
- Performance, load, and stress testing
- Localization and accessibility testing
- Mobile application testing
- Session timeout behavior

> **Clarification:** The items above are out of scope unless their behavior is explicitly added to the approved requirements or test scope.

### Defect Reporting Procedure

- Record defects with test case ID, environment, browser, steps to reproduce, expected result, actual result, evidence, severity, and priority.
- Attach screenshots or screen recordings for incorrect login results or dashboard navigation.
- Retest corrected defects in the same environment and browser before closing them.
- Escalate blockers that prevent login testing or make a valid test account unavailable.

### Test Inclusions

- Functional login scenarios
- Client-side and server-side validation only to the extent observable through the application
- Successful and unsuccessful authentication behavior
- Direct access protection, where testable
- Basic UI feedback for empty fields and invalid credentials

---

## 2. Test Strategy

Testing will combine black-box functional testing and limited boundary testing. Test cases will be executed manually and evidence will be captured for successful login, failed login, validation messages, and dashboard navigation.

| Test type | Coverage |
|---|---|
| Positive | Registered user logs in successfully and reaches the dashboard |
| Negative | Invalid credentials, missing email, missing password, and unauthenticated dashboard access |
| Boundary | One field missing, both fields missing, and one-character values where supplied requirements do not define format constraints |
| Exploratory | Optional review of login behavior after test cases are stable |

### Test Scenarios

| ID | Scenario | Test Data / Input | Steps | Expected Result | Priority | Boundary / Notes |
|---|---|---|---|---|---|---|
| TC-LOGIN-001 | Successful login with valid registered credentials | Valid registered email and password | Open login page; enter valid credentials; submit | Authentication succeeds and the authenticated dashboard opens | High | Positive |
| TC-LOGIN-002 | Invalid password | Valid registered email and invalid password | Open login page; enter inputs; submit | Access is not granted and the supplied invalid-login error is displayed | High | Negative |
| TC-LOGIN-003 | Invalid email | Invalid or unregistered email and valid password | Open login page; enter inputs; submit | Access is not granted and the supplied invalid-login error is displayed | High | Negative |
| TC-LOGIN-004 | Both credentials invalid | Invalid email and invalid password | Open login page; enter inputs; submit | Access is not granted and the supplied invalid-login error is displayed | High | Negative |
| TC-LOGIN-005 | Email is mandatory | Password entered; email left empty | Open login page; enter password only; submit | Login does not proceed and the user is required to provide email | High | Negative |
| TC-LOGIN-006 | Password is mandatory | Email entered; password left empty | Open login page; enter email only; submit | Login does not proceed and the user is required to provide password | High | Negative |
| TC-LOGIN-007 | Email and password are mandatory | Both fields left empty | Open login page; leave fields empty; submit | Login does not proceed and the user is required to provide both fields | High | Negative / boundary |
| TC-LOGIN-008 | Email field whitespace | Whitespace in email field and valid password | Open login page; enter whitespace for email; submit | **Requires clarification:** the approved requirements do not define whether whitespace-only input is accepted or normalized | Medium | Boundary |
| TC-LOGIN-009 | Password field whitespace | Valid email and whitespace-only password | Open login page; enter whitespace for password; submit | Login must not succeed unless these inputs represent a valid registered credential set | Medium | **Requires clarification:** password policy and whitespace behavior are unspecified |
| TC-LOGIN-010 | Direct dashboard access while unauthenticated | Authenticated dashboard URL or current route | Open dashboard URL in a new unauthenticated session | User is not granted authenticated-dashboard access; **Requires clarification:** expected redirect or displayed response | High | Negative / access control |
| TC-LOGIN-011 | Dashboard access after successful login | Valid registered credentials | Complete successful login; navigate to or use dashboard | Authenticated dashboard is available and login credentials are not exposed | High | Positive |
| TC-LOGIN-012 | Email case behavior | Registered email with a changed character case | Open login page; enter email case variant and valid password; submit | **Requires clarification:** whether email matching is case-sensitive | Medium | Boundary |

### Invalid-Login Error

When the supplied invalid-login error must be verified, compare the displayed message with:

> `Your email, password, IP address or location did not match`

Do not add, replace, or translate this text unless the approved requirements are amended.

### Test Environment

| Item | Requirement |
|---|---|
| Application URL | https://app.vwo.com/ |
| Network | Approved test network with access to the application |
| Browser | Recommendation: current stable versions of Chrome and Firefox |
| Operating system | Recommendation: approved desktop OS used by the test team |
| Test account | At least one active registered user with valid credentials |
| Invalid test data | Values that are known not to belong to a registered account |
| Test evidence | Screenshots or recordings and application logs, if available |

> Browser and operating-system combinations are proposed criteria because the supplied requirements do not specify a supported environment. They require confirmation.

### Test Data

| Data | Usage |
|---|---|
| Valid registered email | Successful login |
| Valid password for that registered email | Successful login |
| Invalid email | Invalid credentials and mandatory-email negative testing |
| Invalid password | Invalid credentials |
| Empty email | Mandatory email validation |
| Empty password | Mandatory password validation |
| Whitespace-only inputs | Boundary testing; behavior requires clarification |
| Authenticated dashboard URL or route | Direct access testing |

Credentials must be stored and shared securely. Do not include real passwords, secrets, or personal data in this test plan or defect evidence.

---

## 3. Test Schedule

The exact start and end dates require confirmation.

| Phase | Activities |
|---|---|
| Preparation | Confirm requirements, environment, browser support, registered test account, and dashboard URL |
| Test case review | Review scenarios and confirm open questions |
| Test execution | Execute functional login and access scenarios |
| Defect retest | Retest fixed login defects |
| Test closure | Summarize evidence, unresolved risks, defects, and coverage |

> Dates and effort estimates are recommendations because no project schedule was supplied.

---

## 4. Test Deliverables

- This functional test plan
- Executed test cases and observed results
- Screenshots or recordings for key login outcomes
- Defect reports
- Test summary report
- Open-questions log

---

## 5. Entry and Exit Criteria

### Entry Criteria

- Approved login requirements are available.
- The application URL is reachable.
- Test data for at least one registered user is available.
- The test environment and browser support are confirmed.
- Any open issues that block login testing are resolved.

### Exit Criteria

- All planned login test scenarios are executed or explicitly waived.
- All high-priority scenarios pass.
- No open defect prevents valid users from logging in or prevents invalid users from being denied access.
- Dashboard redirection after successful login is verified.
- Remaining defects and open questions are documented.

> The entry and exit criteria above are recommendations and require approval by the project team.

---

## 6. Test Execution

### Execution Entry Criteria

- Entry criteria in Section 5 are met.
- Test case review is complete.
- Test evidence location is available.

### Execution Exit Criteria

- Test execution status is updated for every scenario.
- Evidence is attached for failed and successful login cases.
- Defects are logged, prioritized, and assigned.

---

## 7. Test Closure

### Closure Entry Criteria

- Execution exit criteria are met.
- Required retesting is complete.
- Unresolved risks and open questions are communicated.

### Closure Exit Criteria

- Test summary report is approved.
- Deliverables are archived.
- Defects not fixed in this cycle are accepted and documented by the appropriate stakeholder.

---

## 8. Tools

| Tool | Purpose |
|---|---|
| Web browser | Manual login testing |
| Screen capture tool | Evidence collection |
| Defect tracking system | Defect lifecycle management |
| Test case repository | Scenario execution tracking |
| Browser developer tools | Optional diagnostic review, if permitted |

Specific tools require confirmation by the project team.

---

## 9. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Valid registered test account is unavailable | Successful-login scenarios cannot be verified | Obtain and validate a non-production test account before execution |
| Password or credential information is exposed | Security and privacy risk | Use test-only credentials and secure evidence handling |
| Browser or environment is unspecified | Inconsistent test coverage and results | Confirm supported browsers and operating systems |
| Whitespace and email-case behavior is unspecified | Test outcomes may be ambiguous | Mark as “Requires clarification” and obtain approved behavior |
| Password-format rules are not provided | A boundary test could invent an unsupported requirement | Do not assume password rules; test only supplied behavior |
| Session timeout behavior is unspecified | Session-related scenarios cannot be defined | Keep session timeout testing out of scope until approved |
| Dashboard route differs from assumptions | Direct-access testing may target an incorrect URL | Confirm the dashboard route or use navigation reached from successful login |
| Application environment changes during testing | Test results may become inconsistent | Record build, time, browser, and environment with evidence |
| Third-party or network dependencies fail | Login may be blocked independently of application behavior | Record network evidence and escalate environmental defects |

## Open Questions

| ID | Question | Owner | Status |
|---|---|---|---|
| OQ-001 | What exact behavior applies to whitespace-only email or password values? | Product / QA | Requires clarification |
| OQ-002 | Is email matching case-sensitive? | Product / Engineering | Requires clarification |
| OQ-003 | What should unauthenticated users see or be redirected to when they try to open the dashboard directly? | Product / Security | Requires clarification |
| OQ-004 | Which browsers and desktop operating systems are supported? | Engineering / Product | Requires clarification |
| OQ-005 | Are there password-format or password-length rules relevant to login testing? | Product / Security | Requires clarification; none are assumed |
| OQ-006 | What session timeout behavior is required? | Product / Security | Requires clarification |
| OQ-007 | Is account lockout or brute-force protection in scope? | Product / Security | Requires clarification |

---

## 10. Approvals

| Role | Name | Decision | Date |
|---|---|---|---|
| Test lead | | Approved / Rejected / Revisions required | |
| Product owner | | Approved / Rejected / Revisions required | |
| Development lead | | Approved / Rejected / Revisions required | |
