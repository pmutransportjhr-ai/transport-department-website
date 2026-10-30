/*
 * Example for the separate Express authentication/API service (not used by this
 * static-site repository). Add after routes and after the application's logger
 * and request-id middleware. Do not return err.message, err.stack, SQL, paths,
 * framework versions, or upstream response bodies to the browser.
 */
module.exports = function safeErrorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    // Replace with the application's structured logger; keep details server-side.
    if (req.log && typeof req.log.error === 'function') {
        req.log.error({ err, requestId: req.id || null }, 'Request failed');
    } else {
        console.error('Request failed', {
            requestId: req.id || null,
            errorName: err && err.name ? err.name : 'Error'
        });
    }

    const status = Number.isInteger(err && err.status) &&
        err.status >= 400 && err.status < 500 ? err.status : 500;

    if (req.accepts && req.accepts('html')) {
        return res.status(status).send(
            '<!doctype html><html lang="en"><meta charset="utf-8">' +
            '<meta name="viewport" content="width=device-width, initial-scale=1">' +
            '<title>Service unavailable</title><body><main>' +
            '<h1>Request could not be completed</h1>' +
            '<p>Please try again later. No technical details are available.</p>' +
            '<a href="/">Return to the Transport Department portal</a>' +
            '</main></body></html>'
        );
    }

    return res.status(status).json({
        error: status === 500 ? 'Internal server error' : 'Request could not be completed',
        requestId: req.id || undefined
    });
};

/*
 * Also disable Express' default framework disclosure on app creation:
 *   app.disable('x-powered-by');
 *
 * Keep Express and its dependencies patched. The error handler does not replace
 * authentication, authorization, input validation or server-side logging.
 */
