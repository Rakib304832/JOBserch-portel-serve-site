
import jwt from "jsonwebtoken";
import { env, Is_PROD } from "../config/env"

export const COOKIE_OPTS = {
  httpOnly: true,   // JavaScript দিয়ে cookie পড়া যাবে না। XSS হামলা হলেও token চুরি কঠিন
  secure: IS_PROD,  // Production-এ শুধু HTTPS-এর উপর cookie যাবে। Local-এ HTTP চললেও সমস্যা নেই
  sameSite: IS_PROD ? "none" : "lax", // Production-এ frontend আলাদা domain-এ হলে "none" লাগে। Local-এ "lax" নিরাপদ
  path: "/",        // Cookie সব route-এ পাঠানো হবে
  maxAge: 7 * 24 * 60 * 60 * 1000, // ৭ দিন পরে cookie নিজে মুছে যাবে (মিলিসেকেন্ডে)
};

export function sendToken(res, user) {
  const token = jwt.sign(
    { sub: String(user._id), email: user.email, role: user.role ?? "user" }, // Token-এর ভেতরের তথ্য। sub = user-এর ID (standard নাম)। role থাকায় প্রতি request-এ DB খুঁজতে হয় না
    env.JWT_SECRET,                                 // গোপন চাবি দিয়ে token সই হয়। কেউ বদলালে ধরা পড়ে
    { expiresIn: "7d", algorithm: "HS256" }         // ৭ দিনে মেয়াদ শেষ। algorithm স্পষ্ট করা থাকলে "none" নামের দুর্বল পদ্ধতি দিয়ে কেউ fake token বানাতে পারে না
  );
  res.cookie("token", token, COOKIE_OPTS); // Token-কে cookie-তে বসায়। Browser পরের request-এ নিজে পাঠাবে
}