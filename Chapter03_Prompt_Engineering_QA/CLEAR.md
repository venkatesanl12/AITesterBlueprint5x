
# CLEAR-Based Test Case Generation for JIRA

## Objective

Generate comprehensive test cases from a Test Plan document using the CLEAR prompt framework, with output structured for standard JIRA CSV import.

## 1. CLEAR Framework

| Element | Application |
|---|---|
| C – Context | Explain the application, project, and Test Plan |
| L – Limitations | Never invent requirements or expected results |
| E – Examples | Provide sample test cases and JIRA structure |
| A – Audience | QA Engineers, Test Leads, Automation Engineers |
| R – Role | Senior QA Architect / Test Lead |

## 2. Test Case Generation Process

1. Upload the Test Plan document.
2. Analyse functional requirements and business rules.
3. Identify positive, negative, boundary, validation and integration scenarios.
4. Generate detailed test cases.
5. Prepare JIRA-compatible CSV output.

## 3. JIRA CSV Structure

| Field | Purpose |
|---|---|
| Issue Type | Test |
| Summary | Test case title |
| Description | Test objective |
| Priority | Highest / High / Medium / Low |
| Labels | Functional / Negative / Regression |
| Preconditions | Initial conditions |
| Test Steps | Execution instructions |
| Expected Result | Expected outcome |

## 4. Mandatory Quality Rules

- Never invent functionality or business requirements.
- Every test case must be traceable to the Test Plan.
- Never assume unspecified application behavior.
- Identify missing or ambiguous requirements.
- Avoid duplicate test cases.
- Include positive and negative scenarios.
- Expected results must be explicit and verifiable.
- Highlight requirements that cannot be tested due to insufficient information.

## 5. Expected Deliverables

1. Complete Test Plan analysis.
2. Extracted testable requirements.
3. Test scenarios.
4. Detailed functional test cases.
5. Requirement-to-test-case traceability.
6. JIRA-compatible CSV file.
7. Separate ambiguity and missing-requirements report.

## 6. Input

Upload the Test Plan document in PDF, Word, or Excel format.
