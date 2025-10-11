import { NextRequest } from "next/server"
import { EconomicIndicatorService } from "@/lib/services/economic-indicator.service"
import { CreateEconomicIndicatorSchema } from "@/lib/dto/economic-indicator.dto"
import { requireAdmin } from "@/lib/guards/admin.guard"
import { successResponse, validationErrorResponse } from "@/lib/utils/response.util"
import { validateRequest } from "@/lib/utils/validation.util"
import { getPaginationParams } from "@/lib/utils/pagination.util"
import { handleException } from "@/lib/filters/http-exception.filter"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const countryCode = searchParams.get("country_code")
    const type = searchParams.get("type")

    const { page, limit, offset } = getPaginationParams(
      searchParams.get("page") || undefined,
      searchParams.get("limit") || undefined
    )

    const indicatorService = new EconomicIndicatorService()

    if (countryCode && type) {
      const indicators = await indicatorService.getIndicatorsByCountryAndType(
        countryCode,
        type,
        limit,
        offset
      )
      return successResponse(indicators)
    }

    if (countryCode) {
      const indicators = await indicatorService.getIndicatorsByCountry(countryCode, limit, offset)
      return successResponse(indicators)
    }

    if (type) {
      const indicators = await indicatorService.getIndicatorsByType(type, limit, offset)
      return successResponse(indicators)
    }

    const indicators = await indicatorService.getAllIndicators(limit, offset)
    return successResponse(indicators)
  } catch (error: any) {
    return handleException(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const validation = await validateRequest(CreateEconomicIndicatorSchema, body)

    if (!validation.success) {
      return validationErrorResponse("Validation failed", validation.errors)
    }

    const indicatorService = new EconomicIndicatorService()
    const indicator = await indicatorService.createIndicator(validation.data)

    return successResponse(indicator, "Economic indicator created successfully", 201)
  } catch (error: any) {
    return handleException(error)
  }
}
