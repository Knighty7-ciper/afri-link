import { NextResponse } from "next/server"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export function successResponse<T>(data: T, message?: string, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    } as ApiResponse<T>,
    { status }
  )
}

export function errorResponse(error: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      error,
    } as ApiResponse,
    { status }
  )
}

export function notFoundResponse(message = "Resource not found") {
  return errorResponse(message, 404)
}

export function unauthorizedResponse(message = "Unauthorized") {
  return errorResponse(message, 401)
}

export function forbiddenResponse(message = "Forbidden") {
  return errorResponse(message, 403)
}

export function validationErrorResponse(message = "Validation failed", errors?: any) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      errors,
    },
    { status: 422 }
  )
}

export function serverErrorResponse(message = "Internal server error") {
  return errorResponse(message, 500)
}

export function createdResponse<T>(data: T, message?: string) {
  return successResponse(data, message, 201)
}

export function noContentResponse() {
  return new NextResponse(null, { status: 204 })
}
