import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();                          // Express app তৈরি
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.use(routes);                                // সব route এক জায়গা থেকে
app.use(errorHandler);                          // error handler সবার শেষে

export default app;