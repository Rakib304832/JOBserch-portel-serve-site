/**
 * src/validators/auth.schema.js
 * ---------------------------------------------------------------------------
 * WHAT THIS FILE IS USED FOR:
 * zod schemas that validate the request BODY of every auth endpoint BEFORE
 * any business logic runs (register / login / google login).
 *
 * WHY VALIDATE HERE AND NOT IN THE CONTROLLER:
 * - Controllers stay clean: one line `.parse(req.body)` instead of dozens of
 *   if-checks.
 * - Rejection is automatic: `.parse()` throws a ZodError, which
 *   middlewares/errorHandler.js converts into HTTP 400 with a readable
 *   message ("String must contain at least 8 character(s)" etc.).
 * - Trimming + lowercasing happen at the border, so the rest of the server
 *   can assume clean, normalized data (emails are always lowercase, no
 *   "  Rakib  " names).
 * ---------------------------------------------------------------------------
 */
import { z } from "zod";

/**
 * registerSchema - POST /api/auth/register
 * Validates: name, email, password, optional role + photo.
 * password min 8: short passwords are brute-forced trivially;
 * max 72: bcrypt only hashes the first 72 bytes, longer input is silently cut.
 */
export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(60),
  email: z.email().toLowerCase(), // z.email() is the zod v4 top-level string format; .toLowerCase() normalizes before the DB uniqueness check
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
  role: z.enum(["seeker", "recruiter"]).default("seeker"), // only Seeker/Recruiter can self-register; "admin" accounts are created directly in the DB
  photo: z.url().optional(), // profile picture URL (frontend uploads to a storage bucket and sends the link)
});

/**
 * loginSchema - POST /api/auth/login
 * Deliberately lenient (no min length on password): an unknown email and a
 * wrong password must return the SAME 401 message, otherwise the error would
 * tell an attacker which accounts exist ("user enumeration" leak).
 */
export const loginSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

/**
 * googleSchema - POST /api/auth/google
 * The Next.js client signs in with Google (Google Identity Services), gets a
 * one-time ID token, and posts it here. The controller verifies that token
 * against Google's servers using GOOGLE_CLIENT_ID - the server never sees
 * the Google password.
 */
export const googleSchema = z.object({
  idToken: z.string().min(10), // the JWT-looking credential string produced by the Google button on the client
});
