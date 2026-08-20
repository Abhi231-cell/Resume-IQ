/**
 * Serverless-compatible sliding window rate limiter.
 * Tracks request timestamps per key (userId or client IP) across endpoints.
 */

interface RateLimitConfig {
  key: string
  limit: number
  windowSeconds: number
}

interface RateLimitResult {
  allowed: boolean
  limit: number
  remaining: number
  resetInSeconds: number
}

// Global cache object across warm serverless executions
const globalRateLimitStore = new Map<string, number[]>()

export function checkRateLimit({
  key,
  limit,
  windowSeconds,
}: RateLimitConfig): RateLimitResult {
  const now = Date.now()
  const windowMs = windowSeconds * 1000
  const threshold = now - windowMs

  // Retrieve previous timestamps for this key
  const timestamps = (globalRateLimitStore.get(key) || []).filter(
    (timestamp) => timestamp > threshold
  )

  if (timestamps.length >= limit) {
    const oldestTimestamp = timestamps[0]
    const resetInSeconds = Math.max(
      1,
      Math.ceil((oldestTimestamp + windowMs - now) / 1000)
    )

    return {
      allowed: false,
      limit,
      remaining: 0,
      resetInSeconds,
    }
  }

  // Record this request timestamp
  timestamps.push(now)
  globalRateLimitStore.set(key, timestamps)

  // Clean up store size if it gets large
  if (globalRateLimitStore.size > 10000) {
    for (const [k, v] of globalRateLimitStore.entries()) {
      const valid = v.filter((t) => t > threshold)
      if (valid.length === 0) {
        globalRateLimitStore.delete(k)
      } else {
        globalRateLimitStore.set(k, valid)
      }
    }
  }

  return {
    allowed: true,
    limit,
    remaining: Math.max(0, limit - timestamps.length),
    resetInSeconds: windowSeconds,
  }
}

export function getClientIdentifier(request: Request, userId?: string): string {
  if (userId) return `user:${userId}`

  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    return `ip:${forwardedFor.split(",")[0].trim()}`
  }

  const realIp = request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip")
  if (realIp) {
    return `ip:${realIp.trim()}`
  }

  return "ip:anonymous"
}
