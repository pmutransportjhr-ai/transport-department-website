# Security audit remediation status

Target branch: `security/audit-remediation-2026-10`

## Changes made in the repository

- Replaced hostname-substring URL checks with the URL parser, HTTP(S)-only protocols, same-origin acceptance, and exact hostname allowlisting for trusted external redirects.
- Removed sessionStorage-generated fake CSRF token injection. A static client cannot secure a server endpoint by inventing its own token; any state-changing endpoint must issue and validate CSRF tokens at the server.
- Removed global JavaScript error/rejection suppression so runtime faults are not silently hidden. This does not replace server-side generic error pages or logging.
- Updated the active Bootstrap CSS and bundle to official Bootstrap 5.3.8 assets. Removed unused duplicate Bootstrap bundles, including the legacy Bootstrap 3.3.5 file that was not referenced by the site's HTML.
- Added Nginx response-header/server-hardening snippets, a generic 50x page, and deployment instructions.

## Audit items and acceptance criteria

| Finding | Repository-side status | What is still required |
|---|---|---|
| Unencrypted communication | Not closed by this commit | Configure/verify valid production TLS and an HTTP-to-HTTPS redirect. Staging is intentionally HTTP. |
| Improper error handling | Generic 50x page and server configuration guide added | Install the page and Nginx error_page directive; test that upstream errors do not expose stack traces or internal paths. |
| Known vulnerable components | Bootstrap upgraded to 5.3.8; unused legacy bundles removed | Run dependency/SCA scan and browser regression tests against the exact deployment. jQuery remains at 3.7.1 to avoid an untested major-version change. |
| Clickjacking / X-Frame header | Nginx snippets added | Install and verify the actual response headers on every relevant host/path. |
| Insecure cookie attributes | Not applicable to code in this static repository | Audit the upstream application/session owner if the live site or reverse proxy issues cookies; configure attributes at that layer. |
| Browser cache | HTML no-store example added to guide | Apply it to the active Nginx server and verify. Public assets may keep an intentional cache policy. |
| Improper Referer / CSRF | False client-only token behaviour removed; redirect checks hardened | Implement CSRF validation server-side if a backend/API has state-changing operations. Referer alone is not authentication. |
| HSTS | Production-only snippet supplied; intentionally not enabled here | Enable on production HTTPS only after TLS/redirect validation. Keep staging without HSTS. |
| X-XSS-Protection | Intentionally not added | This is a deprecated legacy browser header; use CSP and correct output handling instead. Confirm whether the auditor accepts this rationale. |
| CORS | Not added globally | A public static site does not need a generic CORS header. Configure exact origins only on endpoints with a real cross-origin use case. |
| X-Content-Type-Options | Snippet added | Verify the live response header after server configuration is installed. |
| Content-Security-Policy | Starter policy added | Validate with browser console and remove `'unsafe-inline'` after legacy inline code is refactored. |
| Server fingerprinting | `server_tokens off` added to snippet | Verify actual server/proxy headers; Nginx may still identify itself without its version. |
| ETag disclosure | `etag off` added to server hardening snippet | Apply and validate caching effects on the real host/CDN. |
| Framework disclosure | Legacy vulnerable Bootstrap file removed and active Bootstrap upgraded | Version identification may still be possible from public assets; the important control is keeping components patched. Informational finding may remain detectable. |

## Important deployment boundary

These repository changes do not modify the live Nginx configuration or guarantee that a server has reloaded it. Do not mark runtime/header/TLS/cookie findings closed until the active server configuration is changed and the security audit is rerun.
