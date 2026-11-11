/**
 * src/routes/auth.routes.js
 * ---------------------------------------------------------------------------
 * WHAT THIS FILE IS USED FOR:
 * URL table for authentication endpoints (mounted at /api/auth):
 *
 *   POST /api/auth/register - create account (seeker/recruiter) + auto-login
 *   POST /api/auth/login    - email + password login
 *   POST /api/auth/google   - Google sign-in via verified ID token
 *   POST /api/auth/logout   - delete the login cookie
 *
 * authLimiter runs BEFORE the controllers: a request that burns the rate
 * limit (20 failed attempts / 15 min / IP) is rejected with 429 and the
 * controller (with its DB queries and bcrypt work) never executes.
 * ---------------------------------------------------------------------------
 */
import { Router } from "express";
import { authLimiter } from "../middlewares/rateLimit.js";
import * as auth from "../controllers/auth.controller.js";

const router = Router();                        // আলাদা router, যাতে auth-এর route এক জায়গায় থাকে

router.post("/register", authLimiter, auth.register); // rate limit দিয়ে তারপর controller
router.post("/login", authLimiter, auth.login);
router.post("/google", authLimiter, auth.google);
router.post("/logout", auth.logout); // logout is harmless (no DB, no secrets) so no limiter needed

export default router;
