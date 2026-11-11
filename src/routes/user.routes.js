/**
 * src/routes/user.routes.js
 * ---------------------------------------------------------------------------
 * WHAT THIS FILE IS USED FOR:
 * URL table for user endpoints (mounted at /api by routes/index.js):
 *
 *   GET /api/me    - requireAuth, then user.me
 *                    -> the client's "who am I?" call used to hydrate the
 *                       dashboard sidebar (name, avatar, email, role).
 *   GET /api/users - requireAuth + requireRole("admin"), then user.list
 *                    -> the admin "Manage Users" table with search/filter/
 *                       pagination. A Seeker calling this gets 403, a
 *                       logged-out caller gets 401.
 *
 * MIDDLEWARE ORDER: requireAuth MUST run before requireRole because the role
 * check reads req.user that requireAuth puts there.
 * ---------------------------------------------------------------------------
 */
import { Router } from "express";
import * as user from "../controllers/user.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";

const router = Router();

router.get("/me", requireAuth, user.me);                       // any logged-in role (seeker/recruiter/admin)
router.get("/users", requireAuth, requireRole("admin"), user.list); // admin directory only

export default router;
