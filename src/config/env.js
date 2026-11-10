import "dotenv/config";
import{ z } from "zod"
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
  .parse(process.env);

export const IS_PROD = env.NODE_ENV === "production"; // Production environment কি না। CORS, cookie security ইত্যাদিতে দরকার