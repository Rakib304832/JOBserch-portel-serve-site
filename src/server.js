/**
 * src/server.js
 * ---------------------------------------------------------------------------
 * WHAT THIS FILE IS USED FOR:
 * Owns the HTTP server lifecycle. index.js (the entry point) calls:
 *   - startServer(): connects to MongoDB, ensures DB indexes, then starts
 *                    listening. Traffic is only accepted after the DB is up.
 *   - stopServer():  graceful shutdown (FIX: this export was missing while
 *                    index.js already imported it -> crash on Ctrl+C).
 *
 * WHY NOT PUT THIS IN app.js:
 * app.js is pure Express wiring with no side effects - that separation lets
 * tests import app.js without really opening a port. server.js is the thin
 * layer that actually binds the port and owns process lifecycle.
 * ---------------------------------------------------------------------------
 */
import { env } from "./config/env.js";
import { connectDB, closeDB, user } from "./db/mongo.js"; // export renamed to "user" in mongo.js (matches collection name)
import app from "./app.js";

let server; // holds the http.Server instance created by app.listen, so stopServer can close the same one

export async function startServer() {
  await connectDB(); // fail fast: if Mongo is unreachable the server never opens its port
  // Unique index on email - enforced by the DATABASE, not just app code, so
  // no race between two simultaneous sign-ups can create duplicates.
  // A duplicate insert rejects with code 11000, which errorHandler.js turns
  // into HTTP 409 for the client.
  await user.createIndex({ email: 1 }, { unique: true }); // email-এ unique index। একই email দিয়ে একাধিক account বানানো যাবে না
  server = app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });
}

/**
 * stopServer - graceful shutdown handler (SIGINT = Ctrl+C, SIGTERM =
 * `docker stop` / heroku / pm2 stop).
 * Order matters: stop ACCEPTING new requests first (server.close waits for
 * in-flight requests to finish), then close the DB pool so nothing is
 * written to a closed socket. A 5s failsafe force-exits if a hung connection
 * would otherwise keep the process alive forever.
 */
export async function stopServer(signal = "SIGINT") {
  console.log(`\n${signal} received, shutting down gracefully...`);
  try {
    if (server) {
      await new Promise((resolve) => server.close(resolve)); // wait for in-flight requests to finish
    }
    await closeDB(); // flush + close the MongoDB connection pool
    console.log("Clean shutdown complete");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  } finally {
    setTimeout(() => process.exit(1), 5000).unref(); // failsafe: never hang forever if a socket refuses to close
  }
}
