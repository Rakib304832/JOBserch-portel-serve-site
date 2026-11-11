/**
 * src/config/env.js
 * ---------------------------------------------------------------------------
 * WHAT THIS FILE IS USED FOR:
 * Single source of truth for configuration. It reads the ".env" file once,
 * validates every value with zod, and exports a typed, ready-to-use object.
 *
 * WHY IT EXISTS:
 * - Without validation the app can crash much later (e.g. JWT_SECRET undefined
 *   explodes only when the first user logs in). Here a bad ".env" fails FAST,
 *   at startup, with a clear message naming the missing key.
 * - Every other module imports { env } instead of touching process.env
 *   directly, so the whole server agrees on one config shape.
 * - IS_PROD is exported separately because several places need it:
 *   cookie security flags (utils/token.js) and error leaking (errorHandler.js).
 * ---------------------------------------------------------------------------
 */
import "dotenv/config";          // Loads the .env file from disk into process.env. Without this line process.env would only contain OS variables
import { z } from "zod";

export const env = z
  .object({
    PORT: z.coerce.number().default(5000),   // .env থেকে PORT আসে string হিসেবে, তাই number-এ বদলায়। না থাকলে 5000
    MONGO_URI: z.string().min(1),            // MongoDB connection string। খালি হলে error
    DB_NAME: z.string().default("hireloopdb"), // Database-এর নাম। ভিডিওর নামটাই default
    JWT_SECRET: z.string().min(32),          // Token সই করার গোপন চাবি। ৩২ অক্ষরের কম হলে সহজে ভাঙা যায়
    GOOGLE_CLIENT_ID: z.string().min(1),     // Google login-এর client ID
    CLIENT_URL: z.string().url(),            // Frontend-এর URL। CORS-এ এটাই একমাত্র অনুমোদিত origin হবে
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"), // কোন environment চলছে
  })
  .parse(process.env);   // .parse() runs the schema NOW: if a required key is missing or wrong the process exits with a readable error listing exactly which key failed

export const IS_PROD = env.NODE_ENV === "production"; // Production environment কি না। CORS, cookie security ইত্যাদিতে দরকার

/*
 * HOW THE VALUES ARE USED ACROSS THE SERVER:
 *
 *   env.PORT            -> server.js   (app.listen)
 *   env.MONGO_URI       -> db/mongo.js (MongoClient connection)
 *   env.DB_NAME         -> db/mongo.js (which database to use)
 *   env.JWT_SECRET      -> utils/token.js (sign + verify login tokens)
 *   env.GOOGLE_CLIENT_ID-> controllers/auth.controller.js (Google login)
 *   env.CLIENT_URL      -> app.js (CORS allow-list for the Next.js client)
 *   env.NODE_ENV        -> token.js cookie flags + errorHandler.js message detail
 *
 * NOTE: Stripe keys will be added here later when the subscription/billing
 * features (Project requirements -> "Subscription & Billing") are built.
 */
