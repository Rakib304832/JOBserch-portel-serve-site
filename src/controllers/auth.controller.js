/**
 * src/controllers/auth.controller.js
 * ---------------------------------------------------------------------------
 * WHAT THIS FILE IS USED FOR:
 * Business logic for authentication - the four handlers wired in
 * routes/auth.routes.js:
 *
 *   register  POST /api/auth/register  (email+password, role seeker/recruiter)
 *   login     POST /api/auth/login     (email+password check)
 *   google    POST /api/auth/google    (verify Google ID token, upsert user)
 *   logout    POST /api/auth/logout    (delete the login cookie)
 *
 * EVERY handler follows the same contract:
 *   validate body (validators/auth.schema.js)
 *     -> do DB work (db/mongo.js)
 *       -> issue/clear the JWT cookie (utils/token.js)
 *         -> respond with publicUser() so password hashes never leave.
 *
 * Passwords are NEVER stored as plain text: bcrypt hashes them with a random
 * salt (bcryptjs). bcrypt.compare() is deliberately slow (~100ms) which also
 * throttles brute-force attempts in depth beyond the rate limiter.
 * ---------------------------------------------------------------------------
 */
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import { user } from "../db/mongo.js";
import { sendToken, clearToken } from "../utils/token.js";
import { publicUser } from "../utils/publicUser.js";
import { registerSchema, loginSchema, googleSchema } from "../validators/auth.schema.js";
import { httpError } from "../middlewares/errorHandler.js";
import { env } from "../config/env.js";

// One OAuth2Client instance for the whole server; audience = OUR client id,
// which is what makes a token issued for someone else's app be rejected.
const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

/** SALT_ROUNDS: cost factor of the bcrypt hash. 10 = ~2^10 iterations, the widely accepted minimum. */
const SALT_ROUNDS = 10;

/**
 * register - POST /api/auth/register
 * 1. zod validates + normalizes (trim name, lowercase email, default role).
 * 2. Reject if the email already exists (409) with a clear message.
 * 3. Hash the password, insert { ..., provider: "local", status: "active",
 *    createdAt: now }.
 * 4. Log the user in immediately (JWT cookie) and return the safe profile.
 */
export async function register(req, res) {
  const body = registerSchema.parse(req.body); // throws ZodError -> 400 via errorHandler

  const existing = await user.findOne({ email: body.email });
  if (existing) throw httpError(409, "An account with this email already exists. Please log in.");

  const passwordHash = await bcrypt.hash(body.password, SALT_ROUNDS); // one-way hash; the plain password is discarded after this line

  const result = await user.insertOne({
    name: body.name,
    email: body.email,
    passwordHash,
    role: body.role, // "seeker" (default) or "recruiter" - decides which dashboard the client shows
    provider: "local", // marks this account as email+password (vs "google")
    photo: body.photo ?? null,
    status: "active", // admins can suspend later; requireAuth enforces it
    createdAt: new Date(), // join date shown in the admin "Manage Users" table
  });

  const created = await user.findOne({ _id: result.insertedId }); // fetch the inserted doc so the shape matches other handlers
  sendToken(res, created); // sets the httpOnly JWT cookie - user is logged in right away
  res.status(201).json({ ok: true, user: publicUser(created) });
}

/**
 * login - POST /api/auth/login
 * Ambiguity is a feature: unknown email AND wrong password both return the
 * same 401 message, so the endpoint cannot be used to discover which
 * emails are registered. Google-only accounts get a targeted hint instead.
 */
export async function login(req, res) {
  const body = loginSchema.parse(req.body);

  const found = await user.findOne({ email: body.email });
  if (!found) throw httpError(401, "Invalid email or password.");
  if (!found.passwordHash) {
    // Account exists but was created via Google -> no password is stored.
    throw httpError(400, "This account uses Google sign-in. Please continue with Google.");
  }

  const ok = await bcrypt.compare(body.password, found.passwordHash);
  if (!ok) throw httpError(401, "Invalid email or password.");

  sendToken(res, found);
  res.json({ ok: true, user: publicUser(found) });
}

/**
 * google - POST /api/auth/google
 * Flow: the client runs the Google button, receives a one-time ID token,
 * posts it here. We ask GOOGLE to verify it (signature + audience) - this is
 * the security-critical step, trusting the payload without verification
 * would let anyone forge a login. Then upsert:
 *   - known email            -> log in (works even if they first registered
 *                               with password: same person, same account)
 *   - new email              -> create account with provider "google"
 * Always ends with a fresh JWT cookie.
 */
export async function google(req, res) {
  const body = googleSchema.parse(req.body);

  const ticket = await googleClient.verifyIdToken({
    idToken: body.idToken,
    audience: env.GOOGLE_CLIENT_ID, // rejects tokens issued for a different app
  });
  const profile = ticket.getPayload(); // { sub, email, name, picture, email_verified }

  if (!profile.email || profile.email_verified === false) {
    throw httpError(400, "Google account email is not verified.");
  }
  const email = profile.email.toLowerCase();

  let found = await user.findOne({ email });
  if (!found) {
    const result = await user.insertOne({
      name: profile.name ?? email.split("@")[0],
      email,
      provider: "google", // no passwordHash on purpose: login happens through Google only
      role: "seeker", // Google sign-in defaults to Seeker; recruiters register with email+password
      photo: profile.picture ?? null, // Google-hosted avatar URL, shown in the dashboard sidebar
      status: "active",
      createdAt: new Date(),
    });
    found = await user.findOne({ _id: result.insertedId });
  }

  sendToken(res, found);
  res.json({ ok: true, user: publicUser(found) });
}

/**
 * logout - POST /api/auth/logout
 * Deletes the "token" cookie in the browser. The cookie options must match
 * how it was set (clearToken does that), otherwise the browser keeps it.
 * No DB write needed: a JWT cannot be "un-signed" - real revocation would
 * need a token blacklist; with 7-day expiry + DB status checks we accept
 * cookie deletion as logout for this phase.
 */
export async function logout(req, res) {
  clearToken(res);
  res.json({ ok: true, message: "Logged out." });
}
