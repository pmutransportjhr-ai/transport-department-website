# Authentication backend integration required

## Scope

The repository is a static HTML/CSS/JavaScript portal. The staging Nginx virtual host observed during the November 2026 deployment review has a document root at `/var/www/html`, no `proxy_pass` or FastCGI route, and returns 404 for `/login`. No Express application source, authentication routes, session middleware, or backend package manifest is present in this repository.

For that reason, the changes below are **not implemented or production-verified by this static-site branch**. The existing files `express-error-handler.example.js` and `express-csrf-integration.example.js` are examples only. Do not copy them into a static web root or assume that Nginx includes activate them.

## Required work in the actual authentication service

1. Disable Express fingerprinting with `app.disable('x-powered-by')`.
2. Add the generic error handler after application routes. Log exception details only to protected server logs; return a generic response body to clients.
3. Use the production session middleware and a persistent session store. Do not use Express MemoryStore for production.
4. Set the real session cookie deliberately: `HttpOnly`, `Secure` on HTTPS, `SameSite=Lax` unless a documented SSO flow requires a narrowly scoped `SameSite=None; Secure`, plus an intentional `Path` and expiry/`Max-Age`.
5. Issue a cryptographically random CSRF token on the server and validate it on every state-changing route. Origin/Referer checks are defense-in-depth, not a replacement for CSRF tokens or authorization.
6. Verify the full login, logout, password reset, SSO callback, and authenticated session flows.

## Backend acceptance tests

- Trigger representative 400, 401, 403, 404, 409, 429, and 500 responses. Confirm no stack trace, source path, SQL, database details, or framework internals are returned.
- Inspect pre-authentication and post-authentication `Set-Cookie` headers. Confirm cookie flags, path and expiry, and verify SSO still works.
- Submit missing, invalid, expired, and valid CSRF tokens to every state-changing route. Invalid/missing/expired tokens must be rejected.
- Confirm unauthenticated users cannot access protected routes, and authenticated users cannot exceed their authorization.
- Retest the actual `/login` response headers for `Server`, `X-Powered-By`, cache controls, and cookie attributes.

**Status:** Pending until the authentication-service owner supplies the actual backend repository/source and the tests above pass. This is a documented handoff, not a completed remediation.
