/**
 * src/middlewares/errorHandler.js
 * ---------------------------------------------------------------------------
 * WHAT THIS FILE IS USED FOR:
 * Central error handling in ONE place, so controllers never need
 * try/catch boilerplate:
 *
 *   - httpError(status, message): tiny factory controllers throw to abort a
 *     request with a specific status (404 not found, 409 duplicate email…).
 *   - notFound: catches requests that matched no route -> 404 JSON.
 *   - errorHandler: the Express error middleware (must be registered LAST in
 *     app.js). Translates known error types into clean JSON responses:
 *
 *       ZodError          -> 400 + first validation message (+ issues array)
 *       Mongo code 11000  -> 409 duplicate key (e.g. email already used)
 *       body > 10kb       -> 413 payload too large (express.json limit)
 *       bad JSON body     -> 400 malformed JSON
 *       anything else     -> 500 (logged; message hidden in production)
 *
 * EXPRESS 5 BONUS: async controllers that throw/reject are automatically
 * forwarded here by Express 5 - no async wrapper functions needed.
 *
 * SECURITY: in production the raw 500 error text is replaced with a generic
 * message so stack traces / driver details never leak to the client.
 * ---------------------------------------------------------------------------
 */
import { ZodError } from "zod";
import { IS_PROD } from "../config/env.js";

/**
 * httpError - throw it anywhere to end a request with a specific status:
 *   throw httpError(404, "Job not found");
 * 4xx messages are safe to show to clients; 500s get masked in production.
 */
export function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

/** notFound - runs when no route matched (app.js registers it after routes). */
export function notFound(req, res, next) {
  next(httpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

/** errorHandler - last middleware in app.js. Signature is (err, req, res, next). */
export function errorHandler(err, req, res, next) {
  // If headers were already sent, delegating to Express's default handler is
  // the only correct move - we can no longer change the status code.
  if (res.headersSent) return next(err);

  let status = err?.status ?? 500;
  let message = err?.message ?? "Something went wrong.";
  let issues;

  // zod .parse() failures -> 400 with the first human-readable problem.
  if (err instanceof ZodError) {
    status = 400;
    message = err.issues[0]?.message ?? "Invalid input.";
    issues = err.issues.map((i) => ({ path: i.path.join("."), message: i.message }));
  }

  // Mongo unique-index violation (email taken) -> 409 Conflict.
  if (err?.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyPattern ?? {})[0] ?? "field";
    message = `That ${field} is already in use.`;
  }

  // Body bigger than the express.json limit (10kb in app.js).
  if (err?.type === "entity.too.large") {
    status = 413;
    message = "Request body too large.";
  }

  // express.json failed to parse the body as JSON.
  if (err instanceof SyntaxError && err?.status === 400 && "body" in err) {
    status = 400;
    message = "Malformed JSON body.";
  }

  if (status >= 500) {
    // Full detail for the developer's terminal; never sent to the client in production.
    console.error("[error]", err);
    if (IS_PROD) message = "Internal server error.";
  }

  res.status(status).json({ ok: false, message, ...(issues ? { issues } : {}) });
}
