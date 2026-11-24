# Enhancement Status

This bundle includes existing application source plus structured academic deliverable templates. Static review is not a substitute for execution.

## Prepared in bundle
- Custom exception hierarchy and Rules validation (from Phase 2 bundle).
- 36 test-case designs, test plan, defect log and coverage reflection template.
- Cloud architecture and deployment checklist.
- Startup brief, Lean Canvas/BMC summaries, SWOT/PESTEL, MVP and funding hypotheses.
- Security/privacy/ethical commerce checklist.
- Pitch deck and final report outlines.

## Must be executed/verified by team
- Run Maven unit/integration tests and frontend build; capture outputs.
- Review/refactor API security and upload handling; execute security checks.
- Test Docker compose locally; record result.
- Deploy to public cloud, add object storage, HTTPS, managed DB, monitoring, budget alert and backup evidence.
- Execute all manual cases; actual results/status/screenshot evidence.
- Run controlled performance and usability tests.
- Obtain real market/user feedback; use only consented data.

## Known risks from static review
- Booking slot conflict check is synchronized only within one process and uses repository scanning; multi-instance deployment requires DB-level constraints/locking and transaction design.
- Verification uploads are local file storage in prototype; production requires private object storage, access policy and scanning.
- Demo payments are simulated; no live payment integration.
- Seeded/demo credentials and accounts are for local demo only; never use them on public deployment.
- Database migrations and production session scaling are not fully established.

## Production-profile configuration added
- `backend/src/main/resources/application-prod.properties` selects validation-only schema mode, secure cookies and disables demo seeding. Use `SPRING_PROFILES_ACTIVE=prod` only after provisioning/migrating a database and setting secrets.
- `.env.example` contains placeholders, not intended credentials.
- The production profile has not been runtime-tested; do not deploy it without database schema migration/validation and configuration checks.
