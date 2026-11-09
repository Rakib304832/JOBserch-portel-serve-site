import "dotenv/config";            // .env ফাইল পড়ে process.env-এ বসায়। সবার আগে থাকতে হবে, নাহলে পরের কোড env-এর মান খুঁজে পাবে না
import express from "express";     // Web server framework: route, middleware, request/response সব দেয়
import cors from "cors";           // Frontend (অন্য port/domain) থেকে request আসার অনুমতি দেয়
import cookieParser from "cookie-parser"; // Request-এর cookie পড়ে req.cookies-তে রাখে
import helmet from "helmet";       // HTTP security header যোগ করে (XSS, clickjacking-এর বিরুদ্ধে)
import rateLimit from "express-rate-limit"; // একই IP থেকে বারবার login চেষ্টা আটকায়
import bcrypt from "bcryptjs";     // Password-কে one-way hash-এ বদলায়। আসল password কখনও save হয় না
import jwt from "jsonwebtoken";    // Login-এর পর একটা signed token বানায় ও যাচাই করে
import { MongoClient, ObjectId } from "mongodb"; // MongoDB-র সাথে যোগাযোগ, আর _id বানানোর ObjectId
import { OAuth2Client } from "google-auth-library"; // Google থেকে আসা ID token যাচাই করে
import { z } from "zod";           // Input-এর আকার ও ধরন (type) যাচাই করে                                                                            

const env = z
  .object({
    PORT: z.coerce.number().default(5000),   // .env থেকে PORT আসে string হিসেবে, তাই number-এ বদলায়। না থাকলে 5000
    MONGO_URI: z.string().min(1),            // MongoDB connection string। খালি হলে error
    DB_NAME: z.string().default("hireloopdb"), // Database-এর নাম। ভিডিওর নামটাই default
    JWT_SECRET: z.string().min(32),          // Token সই করার গোপন চাবি। ৩২ অক্ষরের কম হলে সহজে ভাঙা যায়
    GOOGLE_CLIENT_ID: z.string().min(1),     // Google login-এর client ID
    CLIENT_URL: z.string().url(),            // Frontend-এর URL। CORS-এ এটাই একমাত্র অনুমোদিত origin হবে
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"), // কোন environment চলছে
  })
  .parse(process.env); // উপরের নিয়ম মেনে process.env যাচাই। ভুল হলে এখানেই crash, যাতে ভুল config নিয়ে server না চলে

  const IS_PROD = env.NODE_ENV === "production"; // একবার হিসাব করে রাখি। Cookie ও error বার্তায় বারবার ব্যবহার হয়
  const mongo = new MongoClient(env.MONGO_URI, { maxPoolSize: 10 }); // একটাই client তৈরি। maxPoolSize: একসাথে সর্বোচ্চ ১০টা DB connection খোলা থাকবে
const users = mongo.db(env.DB_NAME).collection("user"); // "user" collection-এর reference। সব user-এর কাজ এখান থেকে হবে
const google = new OAuth2Client(env.GOOGLE_CLIENT_ID);  // Google token যাচাইয়ের helper। কোন app-এর জন্য তা এই ID দিয়ে বোঝায়

const DUMMY_HASH = bcrypt.hashSync("dummy-password", 10); // একটা নকল hash আগেই বানিয়ে রাখি। Login-এ user না থাকলেও এটা দিয়ে compare করব

const app = express();                 // Express application তৈরি। এখানে সব route ও middleware যোগ হবে
app.disable("x-powered-by");           // Response-এ "Express" লেখা header বন্ধ। Attacker-কে framework চেনার তথ্য দেয় না
app.set("trust proxy", 1);             // Render/Vercel-এর মতো proxy-র পিছনে থাকলে সঠিক client IP ও secure cookie কাজ করে
app.use(helmet());                     // Security header একসাথে সেট করে (X-Frame-Options, Content-Security-Policy ইত্যাদি)
app.use(cors({ origin: env.CLIENT_URL, credentials: true })); // শুধু আমাদের frontend থেকে request নেবে। credentials: true মানে cookie পাঠানো ও নেওয়া যাবে
app.use(express.json({ limit: "10kb" })); // Request body JSON হিসেবে পড়ে। 10kb-র বেশি হলে reject, যাতে কেউ বড় data দিয়ে memory ভরাতে না পারে
app.use(cookieParser());               // Cookie পড়ে req.cookies-তে রাখে। verifyToken এখান থেকে token নেয়

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // সময়সীমা: ১৫ মিনিট (মিলিসেকেন্ডে)
  limit: 20,                // এই ১৫ মিনিটে একই IP থেকে সর্বোচ্চ ২০টা login/register চেষ্টা
  standardHeaders: "draft-7", // আধুনিক RateLimit header পাঠায়, যাতে frontend জানে কতক্ষণ পরে আবার চেষ্টা করা যাবে
  legacyHeaders: false,     // পুরনো X-RateLimit header বন্ধ, কারণ এখন এটা লাগে না
});

const COOKIE_OPTS = {
  httpOnly: true,   // JavaScript দিয়ে cookie পড়া যাবে না। XSS হামলা হলেও token চুরি কঠিন
  secure: IS_PROD,  // Production-এ শুধু HTTPS-এর উপর cookie যাবে। Local-এ HTTP চললেও সমস্যা নেই
  sameSite: IS_PROD ? "none" : "lax", // Production-এ frontend আলাদা domain-এ হলে "none" লাগে। Local-এ "lax" নিরাপদ
  path: "/",        // Cookie সব route-এ পাঠানো হবে
  maxAge: 7 * 24 * 60 * 60 * 1000, // ৭ দিন পরে cookie নিজে মুছে যাবে (মিলিসেকেন্ডে)
};

function sendToken(res, user) {
  const token = jwt.sign(
    { sub: String(user._id), email: user.email, role: user.role ?? "user" }, // Token-এর ভেতরের তথ্য। sub = user-এর ID (standard নাম)। role থাকায় প্রতি request-এ DB খুঁজতে হয় না
    env.JWT_SECRET,                                 // গোপন চাবি দিয়ে token সই হয়। কেউ বদলালে ধরা পড়ে
    { expiresIn: "7d", algorithm: "HS256" }         // ৭ দিনে মেয়াদ শেষ। algorithm স্পষ্ট করা থাকলে "none" নামের দুর্বল পদ্ধতি দিয়ে কেউ fake token বানাতে পারে না
  );
  res.cookie("token", token, COOKIE_OPTS); // Token-কে cookie-তে বসায়। Browser পরের request-এ নিজে পাঠাবে
}

const publicUser = (u) => ({
  id: String(u._id),     // ObjectId-কে string বানায়, কারণ JSON-এ ObjectId সরাসরি যায় না
  name: u.name,
  email: u.email,
  role: u.role ?? "user", // role না থাকলে default "user"
  provider: u.provider,   // Login-এর ধরন: "local" বা "google"
  photo: u.photo ?? null, // Google ছবি। না থাকলে null
  // password এখানে নেই, তাই কখনও client-এ যাবে না
});

function verifyToken(req, res, next) {
  const token = req.cookies.token;                     // Cookie থেকে token নেয়
  if (!token) return res.status(401).json({ message: "Unauthorized" }); // Cookie নেই = login করা নেই। 401 মানে "পরিচয় প্রমাণ করো"
  try {
    req.user = jwt.verify(token, env.JWT_SECRET);      // সই মেলায় ও মেয়াদ দেখে। সব ঠিক হলে token-এর তথ্য req.user-এ রাখে
    next();                                            // পরের handler-এ যেতে দেয়
  } catch {
    res.status(401).json({ message: "Invalid or expired token" }); // ভুল সই বা মেয়াদোত্তীর্ণ token
  }
}

function requireRole(role) {                          // role দিলে একটা নতুন middleware ফেরত দেয়
  return (req, res, next) => {
    // req.user verifyToken থেকে আসে। role না মিললে 403
    // 401 = "তুমি কে জানি না", 403 = "তোমাকে চিনি, কিন্তু এটা করার অনুমতি নেই"
    if (req.user?.role !== role) return res.status(403).json({ message: "Forbidden" });
    next();                                           // Role মিললে এগিয়ে যায়
  };
}