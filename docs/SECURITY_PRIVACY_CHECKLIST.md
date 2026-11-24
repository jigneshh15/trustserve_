# Security, Privacy and Ethical E-commerce Checklist

- [ ] Confirm roles and permissions for each endpoint; test privilege escalation
- [ ] Protect admin endpoints and uploaded documents
- [ ] Use TLS in deployment; secure session cookie configuration
- [ ] Store secrets in environment/platform secrets; rotate leaked credentials
- [ ] Validate and sanitize inputs; handle errors without stack traces
- [ ] Upload allowlist, size limits, content validation, private storage, malware scanning plan
- [ ] Rate-limit registration/login and sensitive actions
- [ ] Review CSRF/session fixation and logout invalidation
- [ ] Do not expose unnecessary account fields in API responses
- [ ] Consent and purpose limitation for personal data
- [ ] Data retention, export and deletion process documented
- [ ] Fake review prevention: only completed bookings eligible; moderation and disclosure
- [ ] Avoid dark patterns: transparent fees, opt-in consent, no forced add-ons, clear cancellation
- [ ] Incident response contact and backup/restore procedure
- [ ] Basic dependency and vulnerability review

Status is not asserted until each item is tested and evidence is recorded.
