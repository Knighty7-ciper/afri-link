import { logger } from "@/lib/utils/logger.util"

export function logRequest(method: string, path: string, userId?: string) {
  logger.info("Incoming request", {
    method,
    path,
    userId,
    timestamp: new Date().toISOString(),
  })
}

export function logResponse(method: string, path: string, status: number, duration: number) {
  logger.info("Response sent", {
    method,
    path,
    status,
    duration: `${duration}ms`,
    timestamp: new Date().toISOString(),
  })
}

export function logError(method: string, path: string, error: any) {
  logger.error("Request error", {
    method,
    path,
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  })
}
