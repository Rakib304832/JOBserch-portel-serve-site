/**
 * src/utils/token.js
 * ---------------------------------------------------------------------------
 * WHAT THIS FILE IS USED FOR:
 * Everything about the login JWT (JSON Web Token) in one place:
 *   - sendToken()  : signs a JWT for a logged-in user and stores it in an
 *                    httpOnly cookie on the browser.
 *   - verifyToken(): used by middlewares/auth.js on every protected request
 *                    to prove the cookie is genuine and not expired.
 *   - clearToken() : used by the logout controller to delete the cookie.
 *
 * WHY A COOKIE AND NOT localStorage:
 * An httpOnly cookie can never be read by JavaScript in the browser, so even
 * if a malicious script runs on the client (XSS) it cannot steal the token.
 * The browser automatically sends the cookie with every request, and
 * cookie-parser in app.js makes it available as req.cookies.token.
 *
 * WHY NOT STORE PASSWORDS IN THE TOKEN:
 * The payload is only base64-encoded (readable by anyone), never encrypted.
 * So it contains the minimum needed for authorization: user id (sub), email
 * and role - nothing sensitive. Signature = tamper protection, not secrecy.
 * ---------------------------------------------------------------------------
 */
import jwt from "jsonwebtoken";
import { env, IS_PROD } from "../config/env.js"; // FIX: export is "IS_PROD" (was imported as "Is_PROD" - would crash at startup)

export const COOKIE_OPTS = {
  httpOnly: true,   // JavaScript দিয়ে cookie পড়া যাবে না। XSS হামলা হলেও token চুরি কঠিন
  secure: IS_PROD,  // Production-এ শুধু HTTPS-এর উপর cookie যাবে। Local-এ HTTP চললেও সমস্যা নেই
  sameSite: IS_PROD ? "none" : "lax", // Production-এ frontend আলাদা domain-এ হলে "none" লাগে। Local-এ "lax" নিরাপদ
  path: "/",        // Cookie সব route-এ পাঠানো হবে
  maxAge: 7 * 24 * 60 * 60 * 1000, // ৭ দিন পরে cookie নিজে মুছে যাবে (মিলিসেকেন্ডে)
};

/**
 * sendToken - called after register / login / google-login succeeds.
 * Signs a 7-day HS256 JWT and sets it as the "token" cookie.
 * The client never sees the raw token; it just gets the Set-Cookie header.
 */
export function sendToken(res, user) {
  const token = jwt.sign(
    { sub: String(user._id), email: user.email, role: user.role ?? "user" }, // Token-এর ভেতরের তথ্য। sub = user-এর ID (standard নাম)। role থাকায় প্রতি request-এ DB খুঁজতে হয় না
    env.JWT_SECRET,                                 // গোপন চাবি দিয়ে token সই হয়। কেউ বদলালে ধরা পড়ে
    { expiresIn: "7d", algorithm: "HS256" }         // ৭ দিনে মেয়াদ শেষ। algorithm স্পষ্ট করা থাকলে "none" নামের দুর্বল পদ্ধতি দিয়ে কেউ fake token বানাতে পারে না
  );
  res.cookie("token", token, COOKIE_OPTS); // Token-কে cookie-তে বসায়। Browser পরের request-এ নিজে পাঠাবে
}

/**
 * verifyToken - used by middlewares/auth.js (requireAuth) on every protected
 * route. Returns the decoded payload ({ sub, email, role }) or THROWS.
 * algorithms is pinned to HS256 so an attacker cannot trick the library
 * with a different/none algorithm ("algorithm confusion" attack).
 */
export function verifyToken(token) {
  return jwt.verify(token, env.JWT_SECRET, { algorithms: ["HS256"] });
}

/**
 * clearToken - used by auth.controller.js -> logout.
 * Deletes the cookie in the browser. The options MUST match COOKIE_OPTS
 * (same path/sameSite/secure), otherwise the browser keeps the old cookie.
 * maxAge is removed because clearCookie manages expiry itself.
 */
export function clearToken(res) {
  const { maxAge, ...opts } = COOKIE_OPTS; // strip maxAge - clearCookie sets an immediate-expiry cookie itself
  res.clearCookie("token", opts);
}
