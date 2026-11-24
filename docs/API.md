# API
All mutations require the CSRF token from GET /api/auth/csrf, sent in the returned header, and the same session cookies. Login uses server sessions and BCrypt hashes.

Public: GET /api/services, /api/services/{id}, /api/categories, /api/professionals, /api/professionals/{id}/reviews.
Auth: POST /api/auth/register, /api/auth/login, /api/auth/logout; GET /api/auth/me.
Accounts: GET/PUT /api/profile; POST multipart /api/verification (file).
Bookings: GET/POST /api/bookings; POST /api/bookings/{id}/status; GET /api/bookings/{id}/history and /invoice.
Other: GET /api/payments, /api/notifications, /api/support; POST /api/reviews and /api/support.
Admin: GET /api/admin/data; POST /api/admin/verification/{id}, /users/{id}, /services, /categories, /reviews/{id}, /support/{id}; GET /api/admin/document/{id}.

See Api.java for request field names and authorization rules. Demo payment failure intentionally creates no booking. Reviews require a completed booking and are limited to one per booking.
