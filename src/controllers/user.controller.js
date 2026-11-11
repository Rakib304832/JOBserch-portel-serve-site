/**
 * src/controllers/user.controller.js
 * ---------------------------------------------------------------------------
 * WHAT THIS FILE IS USED FOR:
 * Handlers for the user endpoints wired in routes/user.routes.js:
 *
 *   me   GET /api/me     - the logged-in user's own profile. Used right
 *                          after page load by the Next.js client to restore
 *                          the session state (name/role for the sidebar).
 *   list GET /api/users  - admin-only user directory powering the
 *                          "Manage Users" dashboard table (search by email,
 *                          filter by role, paginate).
 *
 * Both return data through publicUser() / a list of it, so password hashes
 * and other internal fields can never leak into responses.
 * ---------------------------------------------------------------------------
 */
import { user } from "../db/mongo.js";
import { publicUser } from "../utils/publicUser.js";
import { httpError } from "../middlewares/errorHandler.js";

/**
 * me - GET /api/me  (protected: requireAuth)
 * req.user was already loaded from the DB by middlewares/auth.js, so this
 * handler only reshapes the document. 200 with the profile, or 401 handled
 * by the middleware before we get here.
 */
export async function me(req, res) {
  res.json({ ok: true, user: publicUser(req.user) });
}

/**
 * list - GET /api/users  (protected: requireAuth + requireRole("admin"))
 * Query parameters (all optional):
 *   email - substring, case-insensitive search (admin search bar)
 *   role  - exact match: "seeker" | "recruiter" | "admin" (filter dropdown)
 *   page  - 1-based page number (default 1)
 *   limit - rows per page (default 50, max 100 - keeps responses bounded)
 * Response: { ok, users: [...safe profiles...], total, page, pages }
 * Sorted newest-first so recently joined accounts appear on top.
 */
export async function list(req, res) {
  const filter = {};
  if (req.query.email) {
    const pattern = req.query.email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape regex metacharacters so "a.b" can't break/inject the query
    filter.email = { $regex: pattern, $options: "i" };
  }
  if (req.query.role) filter.role = req.query.role;

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));

  // Two queries total instead of fetching the whole collection into memory:
  // one counts for pagination, one returns only the current page slice.
  const [total, docs] = await Promise.all([
    user.countDocuments(filter),
    user
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
  ]);

  res.json({
    ok: true,
    users: docs.map(publicUser), // strip passwordHash etc. from every row
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
  });
}

// (Phase 2 note: admin actions on this data - make Recruiter/Seeker,
// suspend/activate - will live here too, e.g. PATCH /api/users/:id/status.
// requireAuth + requireRole("admin") guard them exactly like `list`.)
