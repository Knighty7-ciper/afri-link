import { NextRequest } from "next/server"
import { NewsService } from "@/lib/services/news.service"
import { CreateNewsSchema } from "@/lib/dto/news.dto"
import { requireAuth } from "@/lib/guards/auth.guard"
import { requireAdmin } from "@/lib/guards/admin.guard"
import { successResponse, validationErrorResponse } from "@/lib/utils/response.util"
import { validateRequest } from "@/lib/utils/validation.util"
import { getPaginationParams } from "@/lib/utils/pagination.util"
import { handleException } from "@/lib/filters/http-exception.filter"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publishedOnly = searchParams.get("published") === "true"
    const categoryId = searchParams.get("category_id")

    const { page, limit, offset } = getPaginationParams(
      searchParams.get("page") || undefined,
      searchParams.get("limit") || undefined,
      20,
      50
    )

    const newsService = new NewsService()

    if (categoryId) {
      const news = await newsService.getNewsByCategory(categoryId, limit, offset)
      return successResponse(news)
    }

    if (publishedOnly) {
      const news = await newsService.getPublishedNews(limit, offset)
      return successResponse(news)
    }

    await requireAdmin()
    const news = await newsService.getAllNews(limit, offset)
    return successResponse(news)
  } catch (error: any) {
    return handleException(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin()

    const body = await request.json()
    body.author_id = user.id

    const validation = await validateRequest(CreateNewsSchema, body)

    if (!validation.success) {
      return validationErrorResponse("Validation failed", validation.errors)
    }

    const newsService = new NewsService()
    const news = await newsService.createNews(validation.data)

    return successResponse(news, "News created successfully", 201)
  } catch (error: any) {
    return handleException(error)
  }
}
