/**
 * src/middlewares/rateLimit.js
 * ---------------------------------------------------------------------------
 * WHAT THIS FILE IS USED FOR:
 * Creates express-rate-limit instances that cap how many requests each IP
 * may send in a time window. Mounted per-route in routes/*.js.
 *
 * WHY:
 * - authLimiter: the login/register/google endpoints are the #1 brute-force
 *   target. Without a limiter a script can try millions of passwords. With
 *   it, 15 min window / 20 attempts per IP and "skipSuccessfulRequests" so
 *   normal users who log in fine are never counted - only failed guesses.
 * - apiLimiter: general insurance for public read endpoints (/api/jobs) so
 *   scrapers/DDoS cannot hammer the DB.
 *
 * trust proxy is already set in app.js - required so the limiter counts the
 * real client IP behind a host proxy instead of blocking everyone at once.
 * ---------------------------------------------------------------------------
 */
import rateLimit from "express-rate-limit";

/**
 * authLimiter - guards POST /api/auth/register, /login, /google.
 * Returns 429 with a friendly JSON body when the window is exhausted.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes sliding window
  limit: 20,                // max 20 requests per window per IP ("limit" is the v7+ name; "max" is deprecated)
  standardHeaders: "draft-7", // sends RateLimit-* headers so well-behaved clients can back off voluntarily
  legacyHeaders: false,       // suppresses the old X-RateLimit-* headers
  skipSuccessfulRequests: true, // successful logins don't count toward the cap - only failures burn the budget
  message: {
    ok: false,
    message: "Too many attempts. Please wait 15 minutes and try again.",
  },
});

/**
 * apiLimiter - lighter guard for public GET endpoints (e.g. /api/jobs list):
 * 120 requests/minute is far above human browsing speed but stops scripts.
 */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    ok: false,
    message: "Too many requests. Slow down and try again in a minute.",
  },
});
