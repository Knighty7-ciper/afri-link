import { NextRequest, NextResponse } from "next/server"

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(config: RateLimitConfig = { maxRequests: 100, windowMs: 60000 }) {
  return async (request: NextRequest) => {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    const key = `${ip}:${new URL(request.url).pathname}`
    const now = Date.now()

    const record = rateLimitStore.get(key)

    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      })
      return { allowed: true }
    }

    if (record.count >= config.maxRequests) {
      return {
        allowed: false,
        response: NextResponse.json(
          {
            error: "Too many requests",
            retryAfter: Math.ceil((record.resetTime - now) / 1000),
          },
          {
            status: 429,
            headers: {
              "Retry-After": Math.ceil((record.resetTime - now) / 1000).toString(),
            },
          }
        ),
      }
    }

    record.count++
    return { allowed: true }
  }
}

setInterval(() => {
  const now = Date.now()
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 60000)
