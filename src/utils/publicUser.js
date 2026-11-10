export const publicUser = (u) => ({
  id: String(u._id),     // ObjectId-কে string বানায়, কারণ JSON-এ ObjectId সরাসরি যায় না
  name: u.name,
  email: u.email,
  role: u.role ?? "user", // role না থাকলে default "user"
  provider: u.provider,   // Login-এর ধরন: "local" বা "google"
  photo: u.photo ?? null, // Google ছবি। না থাকলে null
  // password এখানে নেই, তাই কখনও client-এ যাবে না
});