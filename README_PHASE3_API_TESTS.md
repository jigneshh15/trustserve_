# TrustServe API Coverage – Phase 3

This enhancement adds additional MockMvc API tests for controller validation and authorization paths.

Added test scenarios include:
- Public professional review endpoint
- Customer cannot submit verification documents
- Admin document access: missing document and customer forbidden
- Admin service creation rejects invalid price
- Customer forbidden from admin service creation
- Admin support response rejects invalid status and role restriction
- Review moderation authorization and reason validation
- Missing booking invoice/history/review request paths
- Unauthenticated current-user endpoint

## Run
From the backend directory:

```powershell
mvn clean test
start target\site\jacoco\index.html
```

These additional tests have not been executed in the authoring environment because Maven is unavailable there. Run locally and review any failures before relying on the coverage results.
