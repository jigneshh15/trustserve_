# API Coverage Enhancement - Phase 4

## Additional API integration scenarios

This phase adds 9 API integration tests to the existing Phase 3 test suite:
- Booking rejects a missing service ID.
- Booking rejects a missing professional ID.
- Booking rejects an incomplete address.
- Booking rejects an unsupported payment method.
- Booking rejects a simulated payment failure.
- Booking rejects an invalid date format.
- Professional document upload rejects an unsupported file type.
- Admin support response rejects a nonexistent ticket.
- Admin review moderation rejects a nonexistent review.

The test source contains these added scenarios. They must be run locally before being recorded as passing. The prior verified Phase 3 baseline was 85 passing tests.

## Run

From the backend folder:

```powershell
mvn clean test
```

Then open the JaCoCo report:

```powershell
start target\site\jacoco\index.html
```
