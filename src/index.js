/**
 * src/index.js
 * ---------------------------------------------------------------------------
 * WHAT THIS FILE IS USED FOR:
 * The process entry point - the file "npm run dev" / "npm start" executes.
 * It does exactly two jobs and nothing else:
 *   1. Registers OS signal handlers so Ctrl+C (SIGINT) and `docker stop`
 *      (SIGTERM) trigger the graceful shutdown in server.js -> stopServer
 *      (finish in-flight requests, close MongoDB, then exit).
 *   2. Boots the server and exits with code 1 if startup fails (bad .env,
 *      Mongo unreachable) so process managers and CI detect the crash.
 *
 * All real logic lives further down the chain:
 *   index.js -> server.js -> app.js -> routes -> controllers -> db
 * ---------------------------------------------------------------------------
 */
import { startServer, stopServer } from "./server.js"; // FIX: ".js" extension added - required by Node ESM, the extension-less version could not resolve

// Ctrl+C in a terminal sends SIGINT; docker stop / pm2 / heroku send SIGTERM.
// Without these handlers Node would kill the process instantly and drop any
// request that was still being processed.
process.on("SIGINT", () => stopServer("SIGINT"));
process.on("SIGTERM", () => stopServer("SIGTERM"));

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
