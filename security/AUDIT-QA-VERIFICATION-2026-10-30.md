# Security audit QA verification — 30 October 2026

Branch: `security/audit-remediation-2026-10`  
Code head tested: `d7f8cc07368d5bb4fab0aebf6d15760d24eba5b2`  
Main remains unchanged.

## Test boundary

Chromium/Playwright local render tests passed for the desktop/mobile navigation and responsive breakpoints. The mobile menu begins collapsed, opens on click, and its dropdown opens; desktop hides the mobile toggler. No browser JavaScript/console errors or broken embedded image resources were recorded. Widths tested: 360, 390, 430, 768, 991, 992, 1024, 1199, 1280 and 1440px.

A separate isolated local Nginx fixture returned X-Frame-Options, X-Content-Type-Options, Referrer-Policy and CSP; HTML returned no-store cache headers; CSS had no ETag; a synthetic HTTP 500 returned the generic 50x page. The local fixture's Server header still identifies nginx, though the version is suppressed. HSTS, CORS and Set-Cookie were absent in the local HTTP/static test by design.

**This is not a live production DevTools/Network capture.** The external IP `103.97.109.116` was unreachable from the test environment on ports 80 and 443, and the hostname did not resolve here. The real server configuration has not been confirmed as deployed. All live response-header/cookie/TLS findings remain open pending production retest.

## Finding status

| # | Finding | Status |
|---:|---|---|
| 1 | Unencrypted Communication (High) | **Open:** production TLS and HTTP→HTTPS redirect not verified. Staging remains HTTP as required. |
| 2 | Improper Error Handling (High) | **Partial:** generic 50x page and local synthetic 500 tested; live/upstream error paths remain unverified. |
| 3 | Components with Known Vulnerabilities (High) | **CVE-specific source fix:** jQuery 3.7.1 is above the 3.5.0 patch threshold for CVE-2020-11022; Bootstrap updated to 5.3.8. Full SCA scan not run; jQuery 4.x upgrade is a separate compatibility task. |
| 4 | Clickjacking Attack (Medium) | **Config ready / local pass:** X-Frame-Options SAMEORIGIN and CSP frame-ancestors are in the Nginx snippet; production deployment pending. |
| 5 | Insecure Cookie Attributes (Medium) | **Open:** the static fixture issues no Set-Cookie; real authentication/upstream cookie responses need review. |
| 6 | Browser Cache Issue (Medium) | **Config ready / local pass:** HTML no-store headers verified locally; production/CDN behavior pending. |
| 7 | Improper Referer Check (Low) | **Partial:** client URL parsing/exact-host allowlist added and fake client-generated CSRF removed; backend CSRF/authorization validation must be checked where state-changing APIs exist. |
| 8 | HSTS Header Not Implemented (Low) | **Production pending:** HSTS snippet is separate and intentionally not enabled on HTTP staging. |
| 9 | X-XSS-Protection Header Not Implemented (Low) | **Not emitted by design:** deprecated/non-standard and may create security issues; use CSP and obtain auditor sign-off on the exception. |
| 10 | X-Frame Header Not Implemented (Low) | **Config ready / local pass:** same X-Frame-Options control as finding 4; production deployment pending. |
| 11 | Access-Control-Allow-Origin Header Not Implemented (Low) | **Scope review:** not added globally; only configure exact origins on API/resources that require cross-origin access. Auditor sign-off needed. |
| 12 | X-Content-Type-Options Header Not Implemented (Low) | **Config ready / local pass:** nosniff added; production deployment pending. |
| 13 | Content-Security-Policy Header Not Implemented (Low) | **Config ready / local pass:** starter CSP added; retains unsafe-inline pending refactor and browser-console testing. |
| 14 | Server Fingerprinting (Low) | **Partial:** Nginx version suppressed; Server: nginx remains. Full product-header removal may require headers-more, proxy/WAF or equivalent. |
| 15 | ETag Disclosure (Low) | **Config ready / local pass:** etag off; local CSS response had no ETag; production deployment pending. |
| 16 | Framework Disclosure (Informational) | **Partial:** explicit Font Awesome 4.4.0 literal removed; CSS remains identifiable and should remain patched. |

## Required production retest

After installing the Nginx snippets on the active production server: run `nginx -t`, reload only if it passes, inspect `curl -sSI https://transport.jharkhand.gov.in/` and the audited login path, then use browser DevTools Network to review document/assets/login/API responses, Set-Cookie, cache headers, CSP violations, mixed content and failed requests. Re-run the external audit scanner. Do not mark all 16 findings closed until that retest and auditor review are complete.

## References

- NVD CVE-2020-11022: https://nvd.nist.gov/vuln/detail/CVE-2020-11022
- jQuery downloads/support: https://jquery.com/download/ and https://jquery.com/support/
- MDN X-XSS-Protection: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-XSS-Protection
- MDN CORS: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS
