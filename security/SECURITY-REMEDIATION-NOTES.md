# Security audit remediation status

Target branch: `security/audit-remediation-2026-10`

## Repository changes completed

- Upgraded the active jQuery file to official jQuery 4.0.0 (current release) and Bootstrap CSS/JS to official Bootstrap 5.3.8.
- Removed unused duplicate/legacy Bootstrap bundles.
- Removed explicit Font Awesome 4.4.0 text/version query strings from the served CSS. The framework is still identifiable; this is informational version-string reduction, not a security boundary.
- Replaced unsafe hostname substring checks with URL parsing, HTTP(S)-only protocols, same-origin checks, and exact trusted-host matches.
- Removed misleading browser-generated CSRF tokens. The backend must issue and verify tokens.
- Removed global JS error suppression.
- Fixed page script tags, missing images, navigation breakpoints, mobile menu event handling, ticker implementation, invalid header meta tags and backup entry page.
- Added a generic 50x page and Nginx snippets for response headers, read-only CORS to the exact official portal origin, no-store HTML caching, server token/ETag controls, production-only HSTS, production HTTP-to-HTTPS redirect and login proxy cookie flags.
- Added Express examples for generic errors and server-issued CSRF validation.

## Audit-item disposition

| # | Finding | Repository change / local test | Production/backend closure requirement |
|---:|---|---|---|
| 1 | Unencrypted Communication (High) | Production HTTP-to-HTTPS redirect snippet and TLS 1.2/1.3 example supplied. Local self-signed HTTPS/redirect fixture tested. | **Open.** Install real production certificate/key, redirect, and verify the actual host/certificate/ciphers. Do not change HTTP staging. |
| 2 | Improper Error Handling (High) | Generic `50x.html`, Nginx upstream interception pattern and Express safe error-handler example supplied. Local synthetic upstream 500 returned generic page without stack/SQL path. | **Partial.** Backend owner must integrate error middleware into actual login service and verify all its 4xx/5xx paths. |
| 3 | Components with Known Vulnerabilities (High) | jQuery 4.0.0 and Bootstrap 5.3.8 present in branch; unused old Bootstrap bundles removed. jQuery source syntax parsed successfully; repo scan found no common removed jQuery APIs. | **Code fix applied.** Run full SCA/dependency scan and full page regression using the deployed assets; confirm browser-support requirements (jQuery 4 drops IE 10 and older). |
| 4 | Clickjacking Attack (Medium) | X-Frame-Options SAMEORIGIN and CSP frame-ancestors in Nginx snippet; local response test passed. | **Open until deployed** to active server and re-tested. |
| 5 | Insecure Cookie Attributes (Medium) | Nginx login-proxy cookie flags example sets Secure, HttpOnly, SameSite=Lax; host-only Domain behavior explained. Local upstream cookie test produced these flags. | **Open until backend/proxy deployed.** Inspect actual login/session cookies; set Path and expiry in the application; verify SSO compatibility. |
| 6 | Browser Cache Issue (Medium) | HTML no-store/no-cache policy in Nginx guide and snippet. Local HTML response test passed; no-store is not imposed on all public assets. | **Open until deployed** and verified through origin/CDN for actual HTML and sensitive responses. |
| 7 | Improper Referer Check (Low) | Client URL validation hardened; fake client CSRF removed; server-issued synchronizer-token Express example added. Local token middleware unit tests passed. | **Partial.** The separate authentication/backend owner must integrate the sample before every state-changing route and verify authorization independently. |
| 8 | HSTS Header Not Implemented (Low) | Separate production-only HSTS snippet; local HTTPS fixture emitted HSTS. | **Open until deployed** on real HTTPS production. Never include on HTTP staging. |
| 9 | X-XSS Protection Header Is Not Implemented (Low) | Nginx snippet sends X-XSS-Protection: 0 to disable the deprecated legacy browser filter; CSP is supplied. | **Auditor sign-off required.** Do not use the old 1; mode=block value solely for scanner compliance; it is deprecated and can be unsafe. |
| 10 | X-Frame Header Not Implemented (Low) | Same X-Frame-Options SAMEORIGIN control as #4; local response test passed. | **Open until deployed** and verified. |
| 11 | Access Control Allowed Origin Header Not Implemented (Low) | Exact origin `https://transport.jharkhand.gov.in`, read-only GET/HEAD/OPTIONS and no credential sharing added; local preflight test passed. | **Open until deployed**. Confirm this exact origin matches the intended integration; do not broaden to wildcard or credentials without API/security-owner approval. |
| 12 | X-Content Type Header Not Implemented (Low) | X-Content-Type-Options nosniff added; local response test passed. | **Open until deployed** and verified on document and asset responses. |
| 13 | Content Security Policy Header Not Implemented (Low) | CSP starter policy added; local response test passed. | **Partial.** Policy retains unsafe-inline for legacy inline script/style and needs browser testing on production; move inline code to reviewed scripts or hashes/nonces before removing it. |
| 14 | Server Fingerprinting (Low) | server_tokens off and proxy X-Powered-By hiding documented; optional headers-more snippet supplied. Local test suppresses Nginx version but still returns Server: nginx. | **Partial/open.** Load the optional headers-more module or use a supported upstream/WAF control; suppress Express x-powered-by in the separate app; re-test live headers. |
| 15 | E Tag Disclosure (Low) | etag off configured; local CSS response had no ETag. | **Open until deployed** to all relevant Nginx/CDN locations and verified. |
| 16 | Framework Disclosure (Informational) | Explicit Font Awesome 4.4.0 markers and URL version query strings removed; current Bootstrap and jQuery versions updated. | **Partial.** Font Awesome remains recognizable from CSS/class/font names. Keep it patched and ask the auditor to accept version-string removal / patched component status. |

## Test boundary

Local Chromium and isolated local Nginx tests are evidence of the code/configuration behavior in this repository's test fixture only. They do not prove the production Nginx configuration has been installed, the real production certificate is valid, or the external Express/session service has been changed.

## External references

- jQuery 4.0.0 official release: https://blog.jquery.com/2026/01/17/jquery-4-0-0/
- jQuery supported versions: https://jquery.com/support/
- jQuery 4.0 upgrade guide: https://jquery.com/upgrade-guide/4.0/
- NVD CVE-2020-11022: https://nvd.nist.gov/vuln/detail/CVE-2020-11022
- MDN X-XSS-Protection: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-XSS-Protection
- MDN CORS: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS
