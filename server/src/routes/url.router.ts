import express from "express";
import { shortenURL, redirectURL } from "../controller/url.controller.js";
import { rateLimiter} from "../middleware/rateLimit.js";
const router = express.Router();

router.post("/shorten", rateLimiter(10, 60), shortenURL);
router.get("/:shortURL", rateLimiter(100, 60), redirectURL);

export default router;