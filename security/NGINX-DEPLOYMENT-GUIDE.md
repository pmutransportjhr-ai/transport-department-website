# Nginx security deployment guide

This repository is a static website. Committing these files does not activate response headers on the server: an administrator must install the snippets into the active Nginx configuration and reload Nginx after a successful syntax test.

## 1. Back up and identify the active configuration

Run on the server:

```sh
sudo nginx -T > "$HOME/nginx-config-before-security.txt" 2>&1
sudo nginx -T 2>&1 | grep -E 'configuration file|server_name|root '
```

Find the active `server {}` block serving the staging host and the production host. The repository's `.htaccess` is ignored by Nginx and cannot implement response headers on an Nginx server.

## 2. Install the snippets and error page

Review the files first, then copy the snippets into a system-owned configuration directory and copy `50x.html` into the site's document root:

```sh
sudo install -d -m 0755 /etc/nginx/snippets
sudo install -m 0644 security/nginx-server-hardening.conf /etc/nginx/snippets/transport-server-hardening.conf
sudo install -m 0644 security/nginx-response-headers.conf /etc/nginx/snippets/transport-response-headers.conf
sudo install -m 0644 security/nginx-production-hsts.conf /etc/nginx/snippets/transport-production-hsts.conf
sudo install -m 0644 50x.html /PATH/TO/ACTIVE/DOCUMENT-ROOT/50x.html
```

Replace `/PATH/TO/ACTIVE/DOCUMENT-ROOT` with the actual `root` directory from the active server block. Do not run the commands with the placeholder unchanged.

## 3. Configure the staging server without forcing HTTPS

Inside the staging site's existing `server {}` block, add:

```nginx
include /etc/nginx/snippets/transport-server-hardening.conf;
include /etc/nginx/snippets/transport-response-headers.conf;

error_page 500 502 503 504 /50x.html;

location = /50x.html {
    internal;
}

location ~* \.html$ {
    # Repeat the response headers because local add_header directives can replace
    # inherited add_header values on commonly deployed Nginx versions.
    include /etc/nginx/snippets/transport-response-headers.conf;
    add_header Cache-Control "no-store, no-cache, must-revalidate" always;
    add_header Pragma "no-cache" always;
    add_header Expires "0" always;
}
```

Merge these directives into the existing server configuration rather than creating a duplicate server block for the same hostname. This configuration intentionally has no HTTP-to-HTTPS redirect and no HSTS on staging.

The HTML pages receive no-store cache directives. Public versioned CSS, JavaScript, images, and PDFs can use an appropriate cache policy if required; do not blindly apply no-store to every static asset.

## 4. Configure production HTTPS and HSTS separately

First confirm production has a valid TLS certificate, all first-party assets work over HTTPS, and the HTTP-to-HTTPS redirect is correct for the production hostname. Do not change staging as part of this step.

Only within the production HTTPS `server {}` block, include:

```nginx
include /etc/nginx/snippets/transport-production-hsts.conf;
```

If a nested `location {}` block sets any `add_header` directives, include the relevant response-header and HSTS snippets there too, or use a tested Nginx version/configuration that supports header inheritance merging. Do not enable `includeSubDomains` or `preload` until all affected hostnames are ready for HTTPS.

## 5. Cookies, CORS, and CSRF require endpoint-specific decisions

- This repository does not implement a server-side session or state-changing POST API. Do not treat a browser-generated hidden token or a Referer check as CSRF protection. Any backend/API that changes state must issue and validate its CSRF token server-side and validate authorization independently.
- The static site's visible search forms are GET navigation forms. If another upstream service sets cookies, configure `Secure`, `HttpOnly`, and an appropriate `SameSite` attribute in that service or on the relevant proxy location. Add `Secure` only when served over HTTPS, and do not blindly overwrite cookie attributes used by SSO.
- CORS is not a generic hardening header. No global `Access-Control-Allow-Origin` is added. If an API genuinely needs cross-origin access, set exact trusted origins and required methods/headers only on that API, and handle preflight requests there.

## 6. Validate before reload

After editing the active configuration:

```sh
sudo nginx -t
sudo systemctl reload nginx
```

Do not reload if `nginx -t` reports errors. Then inspect response headers from the actual hosts:

```sh
curl -sSI http://STAGING-HOST/
curl -sSI http://STAGING-HOST/privacy.html
curl -sSI https://PRODUCTION-HOST/
curl -sSI https://PRODUCTION-HOST/privacy.html
```

Replace the host placeholders with actual hostnames. Confirm the response includes `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Content-Security-Policy`, and the expected cache policy. Verify HSTS only on production HTTPS. Test the pages in a browser for CSP console violations before treating the CSP rollout as complete.

## 7. Operational notes and limitations

- `server_tokens off` suppresses the Nginx version but does not necessarily remove the `Server: nginx` header. Complete removal may require a supported module or an upstream WAF/reverse proxy.
- `etag off` disables ETags for the server scope where this snippet is included. Confirm that this is acceptable for the site's cache/CDN configuration.
- The current CSP retains `'unsafe-inline'` for compatibility with inline scripts/handlers in the existing pages. This is an initial baseline, not the final strongest policy. Move inline code to reviewed external files or nonce/hash-based execution and then remove `'unsafe-inline'`.
- `X-XSS-Protection` is intentionally not emitted because it is a deprecated legacy control; CSP and correct output handling are preferred.
- Re-run the external security audit after server activation. A Git commit alone cannot prove that live response headers, cookies, TLS, or error responses have changed.
