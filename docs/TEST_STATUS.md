# Verification status

- React production build passed from a fresh npm install.
- The packaged JAR started with Java 21 on Linux using a clean H2 database. It served the website and supported direct navigation to service and dashboard routes.
- Live HTTP checks passed for the catalogue, sign-in for all three roles, protected routes, booking, duplicate-slot rejection, simulated payment failure, professional status transitions, booking history, invoice download, review moderation, cancellation/refund, support resolution and logout.
- Chromium could not launch in the verification environment. Interactive browser flows, the Windows launcher, Docker and PostgreSQL were not exercised there.
- See the README for the prototype's remaining scope limits.
