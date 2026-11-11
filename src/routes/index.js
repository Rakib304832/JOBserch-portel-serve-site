/**
 * src/routes/index.js
 * ---------------------------------------------------------------------------
 * WHAT THIS FILE IS USED FOR:
 * The single mount point for the whole API - app.js does `app.use(routes)`
 * and this file forwards each URL prefix to its own router:
 *
 *   GET  /            -> health/info probe (also useful for uptime monitors)
 *   /api/auth/*       -> routes/auth.routes.js    (register/login/google/logout)
 *   /api/me, /api/users -> routes/user.routes.js  (session + admin directory)
 *   /api/jobs*        -> routes/job.routes.js     (public job feed + detail)
 *
 * Adding a new domain later (companies, applications, payments) means
 * creating its router file and adding ONE line here - nothing else changes.
 * ---------------------------------------------------------------------------
 */
import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import jobRoutes from "./job.routes.js";

const router = Router();

// Simple GET / - lets anyone (and the Next.js client on boot) verify the API
// is alive without touching the database.
router.get("/", (req, res) => {
  res.json({
    ok: true,
    name: "HireLoop API",
    version: "1.0.0",
    endpoints: ["/api/auth", "/api/me", "/api/users", "/api/jobs"],
  });
});

router.use("/api/auth", authRoutes); // each router handles its own middleware chain (rate limiters, role guards)
router.use("/api", userRoutes);      // exposes GET /api/me and GET /api/users
router.use("/api/jobs", jobRoutes);  // exposes GET /api/jobs and GET /api/jobs/:jobId

export default router;
