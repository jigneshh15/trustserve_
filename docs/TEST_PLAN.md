# TrustServe Test Plan

## Scope
Validate account registration/login/logout, service catalogue, booking, booking status lifecycle, simulated payments, reviews, professional verification uploads, admin operations and support tickets. Also assess security, performance and usability. Real payment processing, actual identity verification and live service fulfilment are out of scope.

## Levels and techniques
- Unit: Rules and domain validation via JUnit.
- Integration: API, persistence and role/session behaviour.
- System: end-to-end customer/professional/admin workflows.
- Acceptance: representative users follow documented tasks.
- Black-box: equivalence partitions, boundaries, invalid input, decision/state transitions.
- White-box: JaCoCo statement/branch coverage; investigate uncovered branches.

## Environment
Java 21, Spring Boot 3.4.1, Maven, H2 local test DB; Docker/PostgreSQL staging where configured. Keep test data fictional.

## Roles
QA lead owns test execution and defect reporting; Java lead fixes defects; cloud lead runs staging smoke and controlled performance tests; all members review evidence.

## Entry criteria
Source/build available, environment configured, test data prepared, server health confirmed.

## Exit criteria
All critical/high cases executed; failures logged and retested; coverage report generated and interpreted; deployment smoke tests recorded; open risks disclosed. Do not claim a case passed without evidence.

## Evidence
Use `TEST_CASES_36.csv`, `DEFECT_LOG.csv`, screenshots, test console output and JaCoCo HTML report.
