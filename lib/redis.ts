import { Redis } from "@upstash/redis"

let redis: Redis | null = null

// Initialize Redis only if credentials are available
if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
  redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  })
}

export { redis }

export async function checkRateLimit(
  identifier: string,
  limit = 10,
): Promise<{ allowed: boolean; remaining: number; resetTime?: Date }> {
  // If Redis is not configured, use in-memory fallback with localStorage simulation
  if (!redis) {
    console.warn("Redis not configured, using fallback rate limiting")

    // For anonymous users, we'll track by IP monthly
    const today = new Date()
    const monthKey = `${today.getFullYear()}-${today.getMonth()}`
    const key = `rate_limit_${identifier}_${monthKey}`

    // In a real scenario without Redis, you'd use a database
    // For now, we'll allow the request and let the frontend handle localStorage
    return { allowed: true, remaining: limit - 1 }
  }

  try {
    // Use monthly rate limiting for anonymous users
    const today = new Date()
    const monthKey = `${today.getFullYear()}-${today.getMonth()}`
    const key = `rate_limit:${identifier}:${monthKey}`

    const current = ((await redis.get(key)) as number) || 0

    if (current >= limit) {
      // Calculate reset time (next month)
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
      return { allowed: false, remaining: 0, resetTime: nextMonth }
    }

    await redis.incr(key)
    // Set expiry to end of next month
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
    const ttl = Math.floor((nextMonth.getTime() - Date.now()) / 1000)
    await redis.expire(key, ttl)

    return { allowed: true, remaining: limit - current - 1 }
  } catch (error) {
    console.error("Redis error:", error)
    // Fallback to allowing the request if Redis fails
    return { allowed: true, remaining: limit - 1 }
  }
}

export async function setCache(key: string, value: any, ttlSeconds = 3600) {
  if (!redis) return false

  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(value))
    return true
  } catch (error) {
    console.error("Redis cache set error:", error)
    return false
  }
}

export async function getCache(key: string) {
  if (!redis) return null

  try {
    const value = await redis.get(key)
    return value ? JSON.parse(value as string) : null
  } catch (error) {
    console.error("Redis cache get error:", error)
    return null
  }
}

export async function deleteCache(key: string) {
  if (!redis) return false

  try {
    await redis.del(key)
    return true
  } catch (error) {
    console.error("Redis cache delete error:", error)
    return false
  }
}
