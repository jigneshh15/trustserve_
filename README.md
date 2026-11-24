# TrustServe
React + Java Spring Boot home-service marketplace prototype.

## Quick start

1. Extract the entire ZIP to a writable folder. Install Java 21 if needed.
2. On Windows, double-click `Start-TrustServe.bat`. On macOS/Linux, run `sh start-trustserve.sh`.
3. Keep the launcher open and visit http://localhost:8080. On the first launch, allow a few seconds for the demo catalogue to populate.
4. Sign in with any demo email below and password `TrustDemo123!`.

The included JAR serves the React website and Java API together. The launcher needs no Maven, Node.js, Docker or separate database. It stores local records under `data/` next to the JAR. If port 8080 is already in use, stop the other app first.

## Developer setup from source
Install JDK 21, Maven 3.9+, Node.js 22+.
Terminal 1, from backend:
Windows PowerShell: `$env:DEMO_PASSWORD="TrustDemo123!"`
macOS/Linux: `export DEMO_PASSWORD='TrustDemo123!'`
Then run `mvn spring-boot:run`.
Terminal 2, from frontend: `npm ci`, then `npm run dev`.
Open the local URL printed by Vite. The API listens on port 8080.
H2 persists records under backend/data. PostgreSQL is configurable with DB_URL, DB_USER and DB_PASSWORD.

## Demo accounts
All seeded accounts use the DEMO_PASSWORD configured on the FIRST start.
- customer@trustserve.demo
- professional@trustserve.demo
- admin@trustserve.demo
Seed creates 15 services, 10 fictional professionals, customer and administrator accounts. Other professionals: pro2@trustserve.demo through pro10@trustserve.demo.
Never use these demo credentials on a public production service.

## Included flows
Registration, session login/logout, role checks, service search/category/price filters, professional details, future-slot booking, duplicate-slot prevention, customer cancellation, professional acceptance/rejection/start/completion, simulated payments/refunds, invoice text download, completed-booking reviews, asynchronous notifications, profile editing, demo verification upload, admin review, user suspension, service editing/archival, support tickets and audit records.

## Test commands
Backend: `mvn test` (JUnit and Spring integration tests); JaCoCo reports under target/site/jacoco.
Frontend: `npm run build`.
See docs/TEST_STATUS.md for the checks run on this release.

## Docker
Copy .env.example to .env and replace the sample passwords. Run `docker compose up --build`. Open http://localhost:3000.
Docker configuration is supplied but has not been executed in this environment.

## Limitations
- No public-cloud deployment or object-storage integration has been performed. Uploads use local persistent storage.
- No real identity checks, charges, refunds, email delivery or home services.
- Professional availability is a global toggle plus fixed appointment slots, not a full calendar. Slot locking is single-process only.
- Rating filters, profile-photo upload, detailed category update/delete, sample completed-booking seeds and full academic documentation/pitch deck are not complete.
- Database schema uses Hibernate update for the prototype, not versioned production migrations.
- Full OOP inheritance demonstration, custom exception hierarchy, 30 documented manual cases, load tests and real-user usability results remain outstanding.
- Session scaling, rate limiting, malware scanning, production security review and privacy/legal review are required before real deployment.
- The separate assignment DOCX referenced in the PDF was not supplied.

## Structure
frontend/src: React pages, routing, Axios integration and styles.
backend/src/main/java/com/trustserve: entities, repositories, API, security, seeding, booking rules and async notices.
backend/src/test: executable JUnit and integration tests.
docs: status and API notes.

## Images
Bundled illustrative home/service photographs from Unsplash image endpoints. See docs/assets.md. Photos are illustrative, not portraits of verified providers.

## Academic completion roadmap
See `docs/PHASE1_AUDIT.md` for the static audit, verification limitations and prioritized completion roadmap. Runtime checks must be performed on the team's Windows/Java/Maven/Docker environment and recorded honestly.


## Assignment completion documents
- `docs/TEST_PLAN.md` and `docs/TEST_CASES_36.csv`: plan and 36 designed cases (execution results are blank/not-run until evidence).
- `docs/DEFECT_LOG.csv`: defect logging template.
- `docs/COVERAGE_REFLECTION_TEMPLATE.md`: coverage reflection template.
- `docs/CLOUD_ARCHITECTURE.md`: cloud design/deployment checklist and cost worksheet.
- `docs/STARTUP_BRIEF.md`: canvases, SWOT/PESTEL, MVP, funding and compliance planning.
- `docs/SECURITY_PRIVACY_CHECKLIST.md`: security, privacy and ethical e-commerce checks.
- `docs/PITCH_DECK_OUTLINE.md`, `docs/FINAL_REPORT_OUTLINE.md`: final presentation/report structure.

These documents provide planning and design artifacts; cloud deployment, load/usability tests, test execution, user validation and evidence remain to be completed and recorded.
