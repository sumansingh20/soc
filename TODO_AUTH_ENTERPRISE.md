# SOC Academy — Enterprise Auth Implementation TODO

## Step 1 — Add refresh token persistence + rotation
- Add a schema/model to store refresh tokens per user (hashed token, jti, expiresAt, revokedAt).
- Update `/api/auth/login` to return access token + refresh token, and store hashed refresh token.
- Update `/api/auth/refresh` to:
  - validate refresh token + jti
  - rotate refresh token (revoke old, issue new)
- Update `/api/auth/logout` to revoke refresh token (client-provided refresh token).

## Step 2 — Add email verification end-to-end
- Extend `User` schema with: `emailVerified`, `emailVerificationTokenHash`, `emailVerificationTokenExpires`.
- Add endpoints:
  - `POST /api/auth/verify-email` (send token via email)
  - `GET  /api/auth/verify-email/confirm?token=...` (activate account)
- Enforce `emailVerified` in `authenticate` middleware (reject until verified).

## Step 3 — RBAC enforcement across all protected routes
- Ensure admin routes require `admin` role only, instructor routes allow `instructor|admin`.
- Ensure dashboard/progress endpoints enforce `student|instructor|admin` appropriately.
- Add tests/smoke scripts for role access behavior.

## Step 4 — Secure defaults
- Add request validation (Joi or simple validators) for auth endpoints.
- Add rate limiting specific to auth routes.

## Step 5 — Frontend compatibility updates
- Update frontend auth flow to support email verification screens.
- Update refresh handling if needed (token rotation support).


