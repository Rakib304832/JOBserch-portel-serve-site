/**
 * src/utils/publicUser.js
 * ---------------------------------------------------------------------------
 * WHAT THIS FILE IS USED FOR:
 * Shapes the user document that is safe to send to the client. It is an
 * ALLOW-LIST (whitelist): only the fields listed here leave the server.
 * Any sensitive field added to the DB later (password hash, Stripe customer
 * id, internal notes...) is automatically NOT leaked, because it must be
 * explicitly added here first.
 *
 * USED BY: controllers/auth.controller.js (register/login/google/logout
 * responses) and controllers/user.controller.js (/api/me and /api/users).
 * ---------------------------------------------------------------------------
 */

export const publicUser = (u) => ({
  id: String(u._id),     // ObjectId-কে string বানায়, কারণ JSON-এ ObjectId সরাসরি যায় না
  name: u.name,
  email: u.email,
  role: u.role ?? "user", // role না থাকলে default "user"
  provider: u.provider,   // Login-এর ধরন: "local" বা "google"
  photo: u.photo ?? null, // Google ছবি। না থাকলে null
  // password এখানে নেই, তাই কখনও client-এ যাবে না

  // NEW FIELDS below - needed by the dashboards described in the project
  // requirements (Seeker/Recruiter sidebar shows user info; the admin
  // "Manage Users" table shows Join Date and account Status per row):
  status: u.status ?? "active", // "active" | "suspended" (admin can suspend accounts in a later phase)
  createdAt: u.createdAt ?? null, // Join Date - rendered as relative time ("5 days ago") on the admin users table
});
