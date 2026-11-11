/**
 * src/scripts/seedJobs.js
 * ---------------------------------------------------------------------------
 * WHAT THIS FILE IS USED FOR:
 * One-time command: `npm run seed`  (package.json points it at this file).
 * It reads src/data/jobs.json and loads every job into the MongoDB "jobs"
 * collection so the Browse Jobs page has real content on first run.
 *
 * BEHAVIOUR:
 *   - Wipes the existing "jobs" collection first (deleteMany) so re-running
 *     never creates duplicates - the seed is always a clean snapshot.
 *   - Inserts all documents in ONE round-trip (insertMany), far faster than
 *     a loop of insertOne calls.
 *   - Creates the indexes the job list queries rely on:
 *       * status + postedAt   -> feed sorting ("newest first")
 *       * category, type      -> the filter sidebar tabs
 *       * deadline            -> { deadline: { $gte: now } } public filter
 *   - Closes the DB connection explicitly because this script owns its own
 *     process (unlike server.js, nothing else will close it).
 *
 * WHEN TO RUN: once after setting up .env + a reachable MongoDB. Safe to
 * re-run any time you edit jobs.json.
 * ---------------------------------------------------------------------------
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { jobs, connectDB, closeDB } from "../db/mongo.js";

// __dirname does not exist in ESM, so build the path from this file's URL.
// This makes the script runnable from any working directory.
const here = dirname(fileURLToPath(import.meta.url));
const seedPath = join(here, "../data/jobs.json");

async function seed() {
  const raw = readFileSync(seedPath, "utf8");
  const docs = JSON.parse(raw);

  await connectDB(); // same client/pool as the server uses (db/mongo.js)

  await jobs.deleteMany({}); // clean slate - keeps the seed idempotent
  const result = await jobs.insertMany(docs); // single batched insert

  // Query-support indexes (match the filters used in job.controller.js).
  // createIndex is idempotent: re-running with the same definition is a no-op.
  await jobs.createIndex({ status: 1, postedAt: -1 }); // feed listing, newest first
  await jobs.createIndex({ category: 1 }); // category filter tab
  await jobs.createIndex({ type: 1 }); // job type filter
  await jobs.createIndex({ deadline: 1 }); // "not expired yet" public filter
  await jobs.createIndex({ "company.name": 1 }); // admin search by company name (phase 2)

  console.log(`Seeded ${result.insertedCount} jobs into "${jobs.dbName}" collection "${jobs.collectionName}".`);
}

seed()
  .then(async () => {
    await closeDB(); // release the connection so the process can exit
    process.exit(0);
  })
  .catch(async (err) => {
    console.error("Seed failed:", err);
    await closeDB().catch(() => {});
    process.exit(1);
  });
