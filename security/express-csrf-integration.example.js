/*
 * Example only for the separate Express application that owns login/session
 * endpoints. Requires express-session to be configured with a production session
 * store BEFORE these middleware functions. Never use MemoryStore in production.
 *
 * Render the token into a same-origin HTML form or send it to trusted same-origin
 * frontend code; submit it as a hidden _csrf field or X-CSRF-Token header.
 */
const crypto = require('node:crypto');

function issueCsrfToken(req, res, next) {
    if (!req.session) {
        return res.status(500).send('Session security is not configured.');
    }
    if (!req.session.csrfToken) {
        req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    }
    res.locals.csrfToken = req.session.csrfToken;
    next();
}

function verifyCsrfToken(req, res, next) {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }

    const expected = req.session && req.session.csrfToken;
    const supplied = (req.get && req.get('X-CSRF-Token')) ||
        (req.body && req.body._csrf);

    if (typeof expected !== 'string' || typeof supplied !== 'string') {
        return res.status(403).send('Request could not be verified.');
    }

    const expectedBuffer = Buffer.from(expected, 'utf8');
    const suppliedBuffer = Buffer.from(supplied, 'utf8');
    if (expectedBuffer.length !== suppliedBuffer.length ||
        !crypto.timingSafeEqual(expectedBuffer, suppliedBuffer)) {
        return res.status(403).send('Request could not be verified.');
    }

    next();
}

/*
 * Integration order:
 *   app.use(express.urlencoded({ extended: false }));
 *   app.use(express.json());
 *   app.use(existingSessionMiddleware); // secure cookie: HttpOnly, Secure, Lax
 *   app.use(issueCsrfToken);             // on pages/forms that need a token
 *   app.use(verifyCsrfToken);            // before all state-changing routes
 *
 * Protect every state-changing endpoint. Keep authorization/ownership checks
 * independent; CSRF protection does not replace authentication or authorization.
 * Validate Origin/Referer as defense-in-depth, not as the sole CSRF mechanism.
 */
module.exports = { issueCsrfToken, verifyCsrfToken };
