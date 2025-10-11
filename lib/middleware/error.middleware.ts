import { NextResponse } from "next/server"

export interface ApiError extends Error {
  statusCode?: number
  code?: string
}

export function handleApiError(error: any) {
  console.error("[API Error]", error)

  if (error.statusCode) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code || "API_ERROR",
      },
      { status: error.statusCode }
    )
  }

  if (error.name === "ZodError") {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: error.errors,
      },
      { status: 400 }
    )
  }

  if (error.message?.includes("not found")) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 404 }
    )
  }

  return NextResponse.json(
    {
      error: "Internal server error",
      message: process.env.NODE_ENV === "development" ? error.message : undefined,
    },
    { status: 500 }
  )
}

export class UnauthorizedError extends Error implements ApiError {
  statusCode = 401
  code = "UNAUTHORIZED"

  constructor(message = "Unauthorized") {
    super(message)
    this.name = "UnauthorizedError"
  }
}

export class ForbiddenError extends Error implements ApiError {
  statusCode = 403
  code = "FORBIDDEN"

  constructor(message = "Forbidden") {
    super(message)
    this.name = "ForbiddenError"
  }
}

export class NotFoundError extends Error implements ApiError {
  statusCode = 404
  code = "NOT_FOUND"

  constructor(message = "Resource not found") {
    super(message)
    this.name = "NotFoundError"
  }
}

export class ValidationError extends Error implements ApiError {
  statusCode = 400
  code = "VALIDATION_ERROR"

  constructor(message = "Validation failed") {
    super(message)
    this.name = "ValidationError"
  }
}

export class ConflictError extends Error implements ApiError {
  statusCode = 409
  code = "CONFLICT"

  constructor(message = "Resource conflict") {
    super(message)
    this.name = "ConflictError"
  }
}
