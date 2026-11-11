/**
 * src/routes/job.routes.js
 * ---------------------------------------------------------------------------
 * WHAT THIS FILE IS USED FOR:
 * URL table for PUBLIC job endpoints (mounted at /api/jobs):
 *
 *   GET /api/jobs        - job.controller.list
 *                          the Browse Jobs page + Seeker dashboard browse.
 *                          apiLimiter protects the DB from scrapers.
 *   GET /api/jobs/:jobId - job.controller.get
 *                          Job Details page (+ similar job suggestions).
 *
 * Both are public (no login needed) - anyone may browse jobs; APPLYING is
 * the authenticated action and will be added in phase 2 as
 * POST /api/jobs/:jobId/apply behind requireAuth + requireRole("seeker").
 * ---------------------------------------------------------------------------
 */
import { Router } from "express";
import * as job from "../controllers/job.controller.js";
import { apiLimiter } from "../middlewares/rateLimit.js";

const router = Router();

router.get("/", apiLimiter, job.list); // rate limit FIRST: heavy DB queries never run for rate-limited callers
router.get("/:jobId", job.get);

export default router;
