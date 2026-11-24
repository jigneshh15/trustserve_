# Phase 5 – Workflow and authorization edge-case coverage

This phase adds focused MockMvc checks to the existing API test suite for:
- Missing booking IDs when changing status.
- Customer attempts to use a professional-only status action.
- Professional status action against a nonexistent booking.
- Customer attempts to use the admin support-response endpoint.
- Admin support response validation.
- Review submission edge case with a nonexistent booking.

## Verification on Windows
Run from `TrustServe/backend`:

```powershell
mvn clean test
```

If tests pass, inspect `target/site/jacoco/index.html` and record the updated instruction and branch coverage in your report. The new tests are additions to existing tests, not a substitute for manual test evidence. Coverage and test success must be confirmed on the submission machine.
