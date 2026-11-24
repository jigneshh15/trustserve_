# TrustServe — Phase 1 Audit & Stabilization Plan

Audit basis: source files and configuration contained in the supplied `TrustServe_Project_Verified(1).zip`, reviewed 23 November 2026. This is a static review; runtime verification is pending.

## Existing strengths
- React/Vite frontend and Spring Boot 3.4.1 / Java 21 backend.
- JPA persistence, H2 defaults and PostgreSQL configuration.
- Role-aware Spring Security configuration and CSRF cookie repository.
- Booking rules for future slots, booking status transitions, password checks and slot blocking.
- Async notification service, repositories for application records and file upload path configuration.
- JUnit unit tests and MockMvc API tests, JaCoCo configured.
- Dockerfiles, Docker Compose, GitHub Actions build/test workflow, launcher scripts and bundled executable JAR.
- README describes demo roles, workflows and known limitations honestly.

## Important risks / gaps found in static review
1. **Rule validation relies on `IllegalArgumentException`.** The brief specifically asks for custom exception handling; introduce a domain-specific exception hierarchy and test it.
2. **Password rule is limited to length plus letters/digits.** Consider a configurable policy and document usability/security trade-offs rather than silently imposing complexity rules.
3. **Slot conflict locking is documented as single-process only.** A deployed multi-instance system requires database-level uniqueness/transactional protection.
4. **Demo seeded credentials and demo workflows must never be exposed as production authentication.** Disable or gate demo seed accounts on deployment.
5. **Uploads need production hardening:** content/type validation, randomized storage names, authorization, malware scanning strategy, and object storage for cloud deployment.
6. **Schema evolution uses Hibernate `update`.** For a deployment-quality project, use versioned migrations (Flyway or Liquibase).
7. **Static and dynamic testing still need evidence:** 30+ manual cases, defect records, regression evidence, load/security/usability testing and a test summary.
8. **Cloud requirements are not fulfilled yet:** public deployment, managed DB, object storage, HTTPS, monitoring evidence, backup/recovery, cost estimates and architecture diagram.
9. **Business/startup submission materials are missing:** Lean Canvas, Business Model Canvas, SWOT, PESTEL, MVP/funding plan, DPIIT readiness, IP/privacy/legal/security note, marketing/fulfilment plans.
10. **Presentation/report package remains outstanding:** UML, final report, 10–12-slide pitch, demo video and viva preparation.

## Verification performed
- Static inspection of README, Maven configuration, application properties, Docker Compose, GitHub Actions, Java Rules/Security classes and test classes.
- Maven test execution could not be performed in this environment because Maven is not installed. This is not a test failure; execution remains unverified.
- Docker deployment was not executed in this environment.

## Phase sequence
1. Stabilize Java validations/security and expand automated tests.
2. Create and execute a documented 30+ case testing plan; record actual results and defects honestly.
3. Container/cloud deployment with managed DB, object storage, HTTPS, monitoring, backup and cost estimate.
4. Create startup, E-Commerce, policies and compliance documents.
5. Assemble UML, final report, pitch deck, demo recording and viva prep.
