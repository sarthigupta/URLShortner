import type { Request, Response, NextFunction } from "express";
import { redis } from "../lib/redis.js";

export const rateLimiter = (
  limit: number,
  windowInSeconds: number
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const ip =
        req.ip ||
        req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
        "unknown";

      const key = `rate:${ip}:${req.path}`;

      const requests = await redis.incr(key);

      if (requests === 1) {
        await redis.expire(key, windowInSeconds);
      }

      if (requests > limit) {
        return res.status(429).json({
          success: false,
          error: "Too many requests"
        });
      }

      res.setHeader("X-RateLimit-Limit", limit);
      res.setHeader(
        "X-RateLimit-Remaining",
        Math.max(limit - requests, 0)
      );

      next();

    } catch (error) {
      console.error(error);

      // fail open
      next();
    }
  };
};