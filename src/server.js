import { env } from "./config/env.js";
import { connectDB, closeDB, users} from "./db/mongo.js";
import app from "./app.js";

let server;

export async function startServer() {
  await connectDB();
  await users.createIndex({ email: 1 }, { unique: true }); // email-এ unique index। একই email দিয়ে একাধিক account বানানো যাবে না
  server = app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });
}