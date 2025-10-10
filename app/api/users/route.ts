import { NextRequest } from "next/server"
import { UserService } from "@/lib/services/user.service"
import { CreateUserSchema } from "@/lib/dto/user.dto"
import { requireAuth } from "@/lib/guards/auth.guard"
import { requireAdmin } from "@/lib/guards/admin.guard"
import { successResponse, errorResponse, validationErrorResponse } from "@/lib/utils/response.util"
import { validateRequest } from "@/lib/utils/validation.util"
import { getPaginationParams } from "@/lib/utils/pagination.util"
import { handleException } from "@/lib/filters/http-exception.filter"

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const { page, limit, offset } = getPaginationParams(
      searchParams.get("page") || undefined,
      searchParams.get("limit") || undefined
    )

    const userService = new UserService()
    const users = await userService.getAllUsers(limit, offset)

    return successResponse(users)
  } catch (error: any) {
    return handleException(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const validation = await validateRequest(CreateUserSchema, body)

    if (!validation.success) {
      return validationErrorResponse("Validation failed", validation.errors)
    }

    const userService = new UserService()
    const user = await userService.createUser(validation.data)

    return successResponse(user, "User created successfully", 201)
  } catch (error: any) {
    return handleException(error)
  }
}
