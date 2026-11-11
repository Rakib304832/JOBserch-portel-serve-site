/**
 * src/middlewares/auth.js
 * ---------------------------------------------------------------------------
 * WHAT THIS FILE IS USED FOR:
 * Access control for protected endpoints. Two middlewares are exported and
 * chained in the route files:
 *
 *   requireAuth          - proves the caller is logged in (valid JWT cookie)
 *                          and loads the fresh user document into req.user.
 *   requireRole(...roles) - proves the caller's role is one of the allowed
 *                          ones (e.g. requireRole("admin") for /api/users).
 *
 * WHY THE USER IS RELOADED FROM THE DB ON EVERY REQUEST:
 * The JWT only carries id/email/role as a snapshot from login time. If we
 * trusted the token's role, a demoted or suspended user would keep access
 * until the token expires (up to 7 days). Reading the fresh document makes
 * role changes and suspensions take effect on the very next request.
 *
 * RESULT SHAPE: on success req.user = full user document (INCLUDING the
 * password hash) -> controllers must only ever return publicUser(req.user).
 * ---------------------------------------------------------------------------
 */
import { ObjectId } from "mongodb";
import { user } from "../db/mongo.js";
import { verifyToken } from "../utils/token.js";
import { httpError } from "./errorHandler.js";

export async function requireAuth(req, res, next) {
  // cookieParser (app.js) put all cookies on req.cookies; the login cookie
  // was set by utils/token.js under the name "token".
  const token = req.cookies?.token;
  if (!token) return next(httpError(401, "Please log in first."));

  let payload;
  try {
    // Throws if the signature is forged or the token is older than 7 days.
    payload = verifyToken(token);
  } catch {
    return next(httpError(401, "Session expired or invalid. Please log in again."));
  }

  // payload.sub = the user's _id string, stored at login time in utils/token.js
  const found = await user.findOne({ _id: new ObjectId(payload.sub) });
  if (!found) return next(httpError(401, "Account no longer exists.")); // deleted while a valid token was still in the browser
  if (found.status === "suspended") {
    return next(httpError(403, "This account is suspended. Contact support.")); // suspended users keep their cookie but lose access instantly
  }

  req.user = found; // controllers read req.user instead of querying the DB again
  next();
}

/**
 * requireRole - factory: call it with allowed roles and it RETURNS the
 * middleware, e.g.  router.get("/users", requireAuth, requireRole("admin"), ...)
 * Must be used AFTER requireAuth so req.user exists.
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return next(httpError(401, "Please log in first."));
    if (!roles.includes(req.user.role)) {
      // 403 = "authenticated but not allowed" (vs 401 = "not authenticated")
      return next(httpError(403, `Only ${roles.join(" / ")} accounts can do this.`));
    }
    next();
  };
}
