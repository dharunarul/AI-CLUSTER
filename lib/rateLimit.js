import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./upstash";

const generalLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "60 s"),
  analytics: true,
});

const imageGenLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  analytics: true,
});

export async function rateLimit(request, { isImageGen = false } = {}) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

  const limiter = isImageGen ? imageGenLimiter : generalLimiter;
  const result = await limiter.limit(ip);

  return {
    allowed: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}
