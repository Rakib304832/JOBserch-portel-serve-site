/**
 * src/db/mongo.js
 * ---------------------------------------------------------------------------
 * WHAT THIS FILE IS USED FOR:
 * The ONLY place that knows how to reach MongoDB. It creates ONE MongoClient
 * (one connection pool shared by the whole server), exposes the database
 * handle plus every collection the app uses, and provides connect/close
 * functions that server.js calls at startup/shutdown.
 *
 * WHY A SINGLE POOL:
 * Creating a new MongoClient per request would open and tear down TCP
 * connections constantly. One pool of maxPoolSize sockets is reused for all
 * requests, which is dramatically faster and what the driver is designed for.
 *
 * COLLECTION MAP (what each one stores, per the HireLoop requirements):
 *   user         - accounts of Seekers, Recruiters and Admins (login data)
 *   jobs         - job posts created by Recruiters (title, salary, deadline…)
 *   companies    - company profiles registered by Recruiters, with the
 *                  status field: pending / approved / rejected (admin review)
 *   applications - one document per job application a Seeker submits, with
 *                  status: applied / underReview / shortlisted / rejected /
 *                  offered (the "Application Status Flow")
 *   savedJobs    - bookmarks a Seeker makes ("Saved Jobs" dashboard page)
 *   payments     - Stripe subscription payment records for the billing pages
 *   notifications- recent-activity feed items shown on both dashboards
 * ---------------------------------------------------------------------------
 */
import { MongoClient } from "mongodb";
import { env } from "../config/env.js"; // FIX: import needs the explicit ".js" extension - Node ESM does not resolve extension-less paths

// FIX: option is "maxPoolSize" (was misspelled "maxPoolSixe", which the driver
// silently ignored). 10 sockets is plenty for this app size.
const client = new MongoClient(env.MONGO_URI, { maxPoolSize: 10 }); // একটাই client সারা সার্ভারে ব্যবহার হয় - connection pool বারবার খোলা/বন্ধ হয় না

// FIX: previously the name "JOBserch" was hard-coded, which silently ignored
// env.DB_NAME. Now the database name comes from .env (default: "hireloopdb")
// so local dev, tests and production can point at different databases
// without touching code.
const db = client.db(env.DB_NAME);

export const user = db.collection("user");          // All accounts: Seekers, Recruiters, Admins (login + role + status)
export const jobs = db.collection("jobs");          // Job posts (used by job.controller.js list/get + seed script)
export const companies = db.collection("companies"); // Company profiles pending admin approval (Recruiter "My Company" page)
export const applications = db.collection("applications"); // Seeker -> job applications with status flow (My Applications / View Applicants)
export const savedJobs = db.collection("savedJobs"); // Seeker bookmarks (Saved Jobs page)
export const payments = db.collection("payments");   // Stripe payment records (Subscription & Billing pages, admin revenue)
export const notifications = db.collection("notifications"); // Recent-activity lists on Seeker/Recruiter dashboards

/**
 * connectDB - called once by server.js before the HTTP server starts.
 * The server must NOT accept traffic before the DB is reachable, otherwise
 * the first login request would crash.
 */
export async function connectDB() {
  await client.connect();
  // A cheap no-op command that proves the connection actually works
  // (client.connect() can resolve before the server is truly ready).
  await client.db(env.DB_NAME).command({ ping: 1 });
}

/**
 * closeDB - called once by server.js on SIGINT/SIGTERM (Ctrl+C, container stop).
 * Flushes pending writes and closes all pooled sockets cleanly instead of
 * dropping them mid-flight.
 */
export async function closeDB() {
  await client.close();
}
