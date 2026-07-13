const rateLimitMap = new Map();

function getRateLimitKey(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
  return ip;
}

function cleanExpiredEntries(now) {
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

export function rateLimit(request, { windowMs = 60000, max = 30 } = {}) {
  const now = Date.now();
  cleanExpiredEntries(now);

  const key = getRateLimitKey(request);
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: max - 1, resetTime: now + windowMs };
  }

  entry.count++;

  if (entry.count > max) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: false, remaining: 0, resetTime: entry.resetTime, retryAfter };
  }

  return { allowed: true, remaining: max - entry.count, resetTime: entry.resetTime };
}
