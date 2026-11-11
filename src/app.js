/**
 * src/app.js
 * ---------------------------------------------------------------------------
 * WHAT THIS FILE IS USED FOR:
 * Builds the Express application: creates the app, installs global
 * middleware in the right order, mounts the router tree, and attaches the
 * error handler LAST. It exports the app but does NOT listen on a port -
 * server.js does that (keeps app.js testable without a real server).
 *
 * MIDDLEWARE ORDER MATTERS:
 *   helmet -> cors -> json -> cookieParser -> routes -> notFound -> errorHandler
 * Security headers and CORS must run before ANY route; the error handler
 * must be last because Express calls it in the opposite direction (it sees
 * errors thrown by everything above it).
 * ---------------------------------------------------------------------------
 */
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { env } from "./config/env.js";
import routes from "./routes/index.js"; // FIX: folder renamed routers/ -> routes/ to match the README plan
import { notFound, errorHandler } from "./middlewares/errorHandler.js";

const app = express();                          // Express app তৈরি
app.disable("x-powered-by");                    // Removes the "X-Powered-By: Express" header so attackers cannot fingerprint the stack easily
app.set("trust proxy", 1);                      // Trust the first proxy in front of us (Vercel/Render/Heroku). Without this, every request looks like it comes from the proxy IP and express-rate-limit would block ALL users together
app.use(helmet());                              // Sets ~11 security headers (CSP, no-sniff, frameguard...) on every response
app.use(cors({ origin: env.CLIENT_URL, credentials: true })); // Only the Next.js client may call this API; credentials:true is what lets the browser send/receive the login cookie cross-origin
app.use(express.json({ limit: "10kb" }));       // Parses JSON bodies. limit 10kb: larger bodies are rejected with 413 - protects memory from abuse (no file uploads go through this route; resumes come later via a dedicated upload endpoint)
app.use(cookieParser());                        // Parses the Cookie header into req.cookies - this is how req.cookies.token (the JWT) reaches middlewares/auth.js

app.use(routes);                                // সব route এক জায়গা থেকে (routes/index.js combines auth + user + job routers)
app.use(notFound);                              // no route matched -> 404 JSON (instead of Express's default HTML error page)
app.use(errorHandler);                          // error handler সবার শেষে (must be registered after routes to catch their errors)

export default app;
