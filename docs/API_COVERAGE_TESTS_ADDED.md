# API Controller Coverage Expansion

This revision expands `backend/src/test/java/com/trustserve/ApiTest.java` with MockMvc integration tests for:
- Public catalogue/category/professional endpoints and service lookup errors
- Authentication/CSRF behavior and registration validation
- Protected endpoints and role-based access
- Customer profile/list access and administrator data access

These tests are added but must be executed in the project's Java/Maven environment before reporting their results or updated JaCoCo percentages. The authoring environment used to prepare this revision did not have Maven installed.

Run from the `backend` folder:
```powershell
mvn clean test
```
Then open:
```powershell
start target\site\jacoco\index.html
```
