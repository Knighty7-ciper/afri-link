import { NextRequest, NextResponse } from "next/server"
import { ZodSchema } from "zod"

export async function validateRequest<T>(request: NextRequest, schema: ZodSchema<T>) {
  try {
    const body = await request.json()
    const validatedData = schema.parse(body)
    return {
      valid: true,
      data: validatedData,
    }
  } catch (error: any) {
    return {
      valid: false,
      response: NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors || error.message,
        },
        { status: 400 }
      ),
    }
  }
}

export function validateQueryParams<T>(request: NextRequest, schema: ZodSchema<T>) {
  try {
    const url = new URL(request.url)
    const params = Object.fromEntries(url.searchParams)
    const validatedData = schema.parse(params)
    return {
      valid: true,
      data: validatedData,
    }
  } catch (error: any) {
    return {
      valid: false,
      response: NextResponse.json(
        {
          error: "Query parameter validation failed",
          details: error.errors || error.message,
        },
        { status: 400 }
      ),
    }
  }
}
