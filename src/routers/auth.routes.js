import { Router } from "express";
import { authLimiter } from "../middlewares/rateLimit.js";
import * as auth from "../controllers/auth.controller.js";

const router = Router();                        // আলাদা router, যাতে auth-এর route এক জায়গায় থাকে

router.post("/register", authLimiter, auth.register); // rate limit দিয়ে তারপর controller
router.post("/login", authLimiter, auth.login);
router.post("/google", authLimiter, auth.google);
router.post("/logout", auth.logout);

export default router;