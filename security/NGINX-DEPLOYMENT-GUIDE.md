# Security remediation deployment guide

This repository contains the static Transport Department portal. Several audit findings target the separate HTTP server and the `/login` authentication service. **A Git commit does not activate Nginx settings or modify an upstream Express/session application.** The server owner must apply and verify the relevant snippets.

## 1. Back up and identify active configuration

```sh
sudo nginx -T > "$HOME/nginx-config-before-security.txt" 2>&1
sudo nginx -T 2>&1 | grep -E 'configuration file|server_name|root |proxy_pass'
nginx -V 2>&1
```

The `.htaccess` file is ignored by Nginx. Do not create duplicate `server {}` blocks for an existing hostname; merge these directives into the active configuration.

## 2. Install snippets and generic error page

Copy from the checked-out branch after reviewing each file:

```sh
sudo install -d -m 0755 /etc/nginx/snippets
sudo install -m 0644 security/nginx-server-hardening.conf /etc/nginx/snippets/transport-server-hardening.conf
sudo install -m 0644 security/nginx-response-headers.conf /etc/nginx/snippets/transport-response-headers.conf
sudo install -m 0644 security/nginx-production-hsts.conf /etc/nginx/snippets/transport-production-hsts.conf
sudo install -m 0644 security/nginx-production-http-redirect.conf /etc/nginx/snippets/transport-production-http-redirect.conf
sudo install -m 0644 security/nginx-auth-cookie-flags.conf /etc/nginx/snippets/transport-auth-cookie-flags.conf
sudo install -m 0644 50x.html /PATH/TO/ACTIVE/DOCUMENT-ROOT/50x.html
```

Replace the document-root placeholder with the actual path from `nginx -T`.

## 3. Staging configuration (HTTP stays HTTP)

Inside the existing HTTP staging `server {}` block:

```nginx
include /etc/nginx/snippets/transport-server-hardening.conf;
include /etc/nginx/snippets/transport-response-headers.conf;

error_page 500 502 503 504 /50x.html;
location = /50x.html { internal; }

location ~* \.html$ {
    include /etc/nginx/snippets/transport-response-headers.conf;
    add_header Cache-Control "no-store, no-cache, must-revalidate" always;
    add_header Pragma "no-cache" always;
    add_header Expires "0" always;
}
```

No HTTP redirect and no HSTS are used on staging. Do not set `Secure` cookies on a staging environment that must remain HTTP if the staging authentication flow depends on those cookies.

Nginx `add_header` inheritance changes when a nested `location {}` contains any `add_header`. Repeat the security-header include inside such locations or use a tested Nginx version with header-inheritance merging. Verify every response path, not just `/`.

## 4. Production HTTPS and HSTS (separate from staging)

First provision a valid production certificate and confirm that every first-party asset and login flow works over HTTPS. The certificate/key paths below are examples; replace them with the paths provisioned on the server.

HTTP port 80 production server:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name transport.jharkhand.gov.in;
    include /etc/nginx/snippets/transport-production-http-redirect.conf;
}
```

HTTPS production server (merge into the actual existing server block):

```nginx
listen 443 ssl;
listen [::]:443 ssl;
ssl_certificate /PATH/TO/PRODUCTION/FULLCHAIN.pem;
ssl_certificate_key /PATH/TO/PRODUCTION/PRIVATE-KEY.pem;
ssl_protocols TLSv1.2 TLSv1.3;

include /etc/nginx/snippets/transport-server-hardening.conf;
include /etc/nginx/snippets/transport-response-headers.conf;
include /etc/nginx/snippets/transport-production-hsts.conf;
```

HSTS is intentionally emitted only in the production HTTPS server. The snippet starts with `max-age=31536000` and no `includeSubDomains`/preload. Do not expand to all subdomains until each one is verified HTTPS-ready.

## 5. Login/session cookies (upstream app)

The static portal does not issue an authentication session cookie. For the upstream authentication service, include `transport-auth-cookie-flags.conf` **inside the actual HTTPS proxy location that returns the session cookie**. It requires Nginx 1.19.3+ and sets `Secure`, `HttpOnly`, and `SameSite=Lax`. It intentionally does not force a `Domain` attribute (host-only cookies are more restrictive). Set the intended `Path` and expiry/max-age in the backend session configuration.

Do not apply cookie flags globally to unrelated third-party cookies. If a tested SSO callback genuinely requires cross-site cookies, use `SameSite=None; Secure` only for that cookie. Inspect the actual `Set-Cookie` response from login and authenticated routes.

## 6. Express authentication service: errors and CSRF

The audit evidence shows an Express fingerprint on the `/login` route. If that route is served by the Express application, the backend owner should:

- call `app.disable('x-powered-by')`;
- use `security/express-error-handler.example.js` after routes to log details server-side and return generic responses;
- use the server-issued synchronizer token pattern in `security/express-csrf-integration.example.js` after the production session middleware and before every state-changing route;
- ensure the session cookie is `HttpOnly`, `Secure` on HTTPS, `SameSite=Lax` (or narrowly reviewed `None; Secure` for required SSO), and has an intentional Path/expiry;
- use a persistent production session store, never Express' default MemoryStore.

The examples are integration patterns, not a drop-in patch for a backend that is absent from this repository. Preserve existing login/SSO behavior and test it before deployment. Referer/Origin checks are defense-in-depth and do not replace CSRF tokens or authorization checks.

For Nginx-proxied upstream errors, set `proxy_intercept_errors on;` in the relevant proxy location and map 500/502/503/504 to the generic `50x.html` page. Confirm the upstream does not itself return stack traces or framework/database details in its 4xx/5xx bodies.

## 7. CORS and browser security headers

The response-header snippet permits only `https://transport.jharkhand.gov.in` for read-only `GET, HEAD, OPTIONS` requests; it does not use wildcard origin or credential sharing. This is a deliberately narrow policy for the public static portal. If an API needs a different origin/method/header or credentials, scope the CORS configuration to that API location and obtain the API owner/security approval. Do not expand to wildcard.

The snippet sets:
- `X-Frame-Options: SAMEORIGIN` plus CSP `frame-ancestors 'self'`;
- `X-Content-Type-Options: nosniff`;
- a CSP baseline;
- `X-XSS-Protection: 0`, intentionally disabling the deprecated legacy filter rather than enabling the unsafe `1; mode=block` behavior;
- `Referrer-Policy` and `Permissions-Policy`.

The current CSP retains `'unsafe-inline'` to avoid breaking existing inline scripts/styles and HTML event handlers. It is a compatibility baseline, not the final strongest CSP. Move inline code into reviewed external files or use nonce/hash policies, then remove `unsafe-inline`. Check browser console and all page interactions after CSP deployment.

## 8. Server fingerprinting and ETag

`server_tokens off` suppresses the Nginx version; by itself it may leave `Server: nginx`. `etag off` disables ETags in the Nginx server scope. If the server banner must be removed, install/load the headers-more module and only then include `security/nginx-headers-more-optional.conf`. Do not include that file unless `nginx -V`/module configuration confirms the module is loaded; otherwise `nginx -t` will fail.

For the proxied Express app, `app.disable('x-powered-by')` and removal of unused framework/version headers are separate tasks. Removing a version string is not a substitute for patching the framework.

## 9. Validate and capture production evidence

After the edits:

```sh
sudo nginx -t
# Reload only if the test passes:
sudo systemctl reload nginx

curl -sSI http://STAGING-HOST/
curl -sSI https://transport.jharkhand.gov.in/
curl -sSI https://transport.jharkhand.gov.in/login
```

Replace `STAGING-HOST` with the real staging hostname. Save the full outputs. Confirm on production HTTPS: redirect from HTTP, TLS protocol/certificate, HSTS, X-Frame-Options, nosniff, CSP, CORS, no-store on HTML/login, no ETag where disabled, and cookie flags on real authenticated responses. Check that the `Server` header is removed only if the optional module is installed. Test real browser pages with DevTools Network and Console, then rerun the security scanner.

## 10. Case disposition notes

- `X-XSS-Protection: 0` is the modern safe disabling value for the deprecated header. Ask the auditor to accept this rather than `1; mode=block`.
- CORS is restricted to the official portal origin and read-only methods. If the finding was for a different API or origin, obtain that API's exact CORS requirement before changing this rule.
- The public site's Font Awesome version literal has been removed from its CSS, but the CSS remains recognizable as Font Awesome. This informational item should be judged on patched component status, not obscurity alone.
- A local Nginx fixture can verify the syntax and expected behavior of these snippets, but it cannot prove production has deployed them.
