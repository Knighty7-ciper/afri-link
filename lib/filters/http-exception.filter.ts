import { NextResponse } from "next/server"
import { logger } from "@/lib/utils/logger.util"

export class HttpException extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = "HttpException"
  }
}

export class NotFoundException extends HttpException {
  constructor(message = "Resource not found") {
    super(message, 404)
    this.name = "NotFoundException"
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message = "Unauthorized") {
    super(message, 401)
    this.name = "UnauthorizedException"
  }
}

export class ForbiddenException extends HttpException {
  constructor(message = "Forbidden") {
    super(message, 403)
    this.name = "ForbiddenException"
  }
}

export class BadRequestException extends HttpException {
  constructor(message = "Bad request") {
    super(message, 400)
    this.name = "BadRequestException"
  }
}

export class ConflictException extends HttpException {
  constructor(message = "Conflict") {
    super(message, 409)
    this.name = "ConflictException"
  }
}

export function handleException(error: any): NextResponse {
  logger.error("Exception occurred", {
    name: error.name,
    message: error.message,
    stack: error.stack,
  })

  if (error instanceof HttpException) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: error.statusCode }
    )
  }

  return NextResponse.json(
    {
      success: false,
      error: "Internal server error",
    },
    { status: 500 }
  )
}
