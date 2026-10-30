# Security audit remediation and QA evidence — 30 October 2026

Target branch: `security/audit-remediation-2026-10`  
Main branch: unchanged.  
Repository scope: static Transport Department portal. Authentication/session behavior for `/login` is in a separate Express service and is not part of this repository.

## Current code verification

- jQuery: official `4.0.0` asset committed.
- Bootstrap CSS and JS: official `5.3.8` assets committed.
- Removed unused duplicate/legacy Bootstrap files.
- Removed explicit Font Awesome `4.4.0` version strings and URL query markers. Font Awesome remains identifiable from its class/font structure.
- Portal JS and both Express examples pass Node syntax parsing. A repository source scan found no uses of common jQuery 4-removed APIs (`$.trim`, `$.isFunction`, `$.parseJSON`, `$.isArray`, `andSelf`, `.size()`, `.bind()`, `$.browser`).
- The complete browser visual fixture used jQuery 3.7.1 and Bootstrap 5.3.3 at the time of capture; therefore the visual suite is not a full-app runtime test of the newly committed jQuery 4.0.0 and Bootstrap 5.3.8 assets. Run a post-deployment browser regression with the final assets and a full SCA scan before signing off the component finding.

## Chromium responsive UI test (local fixture)

Viewports tested: 360, 390, 430, 768, 991, 992, 1024, 1199, 1280, and 1440 px. All 10 viewport checks passed with no horizontal overflow. The mobile navbar starts collapsed, opens on click, and its dropdown opens. Desktop hides the mobile toggler. Captured console errors: 0; uncaught page errors: 0; broken images: 0.

Screenshots available in the evidence package:
- `transport_qa_desktop_viewport_2026-10-30.png`
- `transport_qa_mobile_menu_open_2026-10-30.png`
- `transport_qa_mobile_dropdown_open_2026-10-30.png`

## Isolated local Nginx response tests

Environment: `127.0.0.1` local fixture, not the production host.

| Test | Result |
|---|---|
| HTML response headers | 10/10 assertions passed: X-Frame-Options SAMEORIGIN; X-XSS-Protection 0; nosniff; Referrer-Policy; CSP; exact-origin CORS; HTML no-store; ETag absent; Nginx version hidden |
| Login proxy cookie | 4/4 assertions passed: Secure, HttpOnly, SameSite=Lax, X-Powered-By hidden |
| Generic HTTP 500 | 3/3 assertions passed: generic message; no stack trace; no SQL details |
| CORS preflight | 4/4 assertions passed: 204; exact origin; GET/HEAD/OPTIONS; no credentials |
| Production HTTP redirect fixture | 308 to HTTPS passed |
| Local HTTPS/HSTS fixture | HSTS max-age=31536000 passed with a self-signed test certificate |
| Server banner | Partial: version hidden but `Server: nginx` remains. Optional headers-more module was not loaded. |

Supporting screenshot: `transport_qa_network_evidence_2026-10-30.png`. This is a local fixture response-evidence screen, not a live production DevTools capture.

## Express example middleware unit tests

Six assertions passed: CSRF token issued; valid POST accepted; invalid token rejected; GET bypasses CSRF check; generic error page returned; server-side logger called. These tests execute the example middleware files only. They do not mean that the separate real login service has been modified.

## Case-by-case disposition

| # | Finding | Current disposition |
|---:|---|---|
| 1 | Unencrypted Communication | Open until real production certificate, TLS and HTTP-to-HTTPS redirect are deployed and verified. Staging intentionally remains HTTP. |
| 2 | Improper Error Handling | Partial: generic 50x + local synthetic 500 tested; integrate middleware and inspect all real Express error routes. |
| 3 | Components with Known Vulnerabilities | Code fix committed: jQuery 4.0.0 and Bootstrap 5.3.8; legacy bundles removed. Full SCA and deployed-app browser regression still required. |
| 4 | Clickjacking Attack | Local Nginx X-Frame/CSP test passed; production deployment pending. |
| 5 | Insecure Cookie Attributes | Local proxy fixture test passed; real login/session cookie deployment and SSO check pending. |
| 6 | Browser Cache Issue | Local HTML no-store test passed; production origin/CDN deployment pending. |
| 7 | Improper Referer Check | Client URL validation hardened; real CSRF token integration required in backend. |
| 8 | HSTS | Local HTTPS HSTS test passed; production-only deploy pending. Never set on HTTP staging. |
| 9 | X-XSS Protection | `X-XSS-Protection: 0` disables deprecated legacy browser filtering; requires auditor approval of modern policy rather than obsolete `1; mode=block`. |
| 10 | X-Frame Header | Local test passed; production deployment pending (same control as #4). |
| 11 | CORS | Exact-origin, read-only CORS preflight passed locally; confirm endpoint scope and deploy on the correct production endpoint. |
| 12 | X-Content-Type | nosniff passed locally; production deployment pending. |
| 13 | CSP | CSP passed locally; `unsafe-inline` remains for compatibility, deployment/browser regression and hardening still pending. |
| 14 | Server Fingerprinting | Partial: Nginx version hidden but `Server: nginx` remains; headers-more/upstream/WAF action needed. |
| 15 | ETag | ETag absent in local CSS fixture; production/CDN deployment pending. |
| 16 | Framework Disclosure | Explicit Font Awesome version strings removed and major frontend assets patched; framework remains identifiable, auditor acceptance needed. |

## Production verification limitation

The test environment could not connect to `103.97.109.116` on ports 80/443, and the official hostname did not resolve in this test environment. Consequently, no live production Network-panel response capture is available. The local fixture cannot prove that the production Nginx server or separate Express session service has been updated.

**Do not mark all cases closed from this report.** Apply the snippets and backend examples to the actual server/service, run `nginx -t`, reload after a passing test, then capture production `curl -sSI` and browser DevTools Network evidence and rerun the auditor scanner.

## Reference links

- jQuery 4.0.0 release: https://blog.jquery.com/2026/01/17/jquery-4-0-0/
- jQuery 4.0 upgrade guide: https://jquery.com/upgrade-guide/4.0/
- NVD CVE-2020-11022: https://nvd.nist.gov/vuln/detail/CVE-2020-11022
- MDN X-XSS-Protection: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-XSS-Protection
- MDN CORS: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS
