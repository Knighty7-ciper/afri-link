import { NextRequest } from "next/server"
import { CurrencyService } from "@/lib/services/currency.service"
import { CreateCurrencySchema } from "@/lib/dto/currency.dto"
import { requireAdmin } from "@/lib/guards/admin.guard"
import { successResponse, validationErrorResponse } from "@/lib/utils/response.util"
import { validateRequest } from "@/lib/utils/validation.util"
import { getPaginationParams } from "@/lib/utils/pagination.util"
import { handleException } from "@/lib/filters/http-exception.filter"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get("active") === "true"

    const currencyService = new CurrencyService()

    if (activeOnly) {
      const currencies = await currencyService.getActiveCurrencies()
      return successResponse(currencies)
    }

    const { page, limit, offset } = getPaginationParams(
      searchParams.get("page") || undefined,
      searchParams.get("limit") || undefined
    )

    const currencies = await currencyService.getAllCurrencies(limit, offset)
    return successResponse(currencies)
  } catch (error: any) {
    return handleException(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const validation = await validateRequest(CreateCurrencySchema, body)

    if (!validation.success) {
      return validationErrorResponse("Validation failed", validation.errors)
    }

    const currencyService = new CurrencyService()
    const currency = await currencyService.createCurrency(validation.data)

    return successResponse(currency, "Currency created successfully", 201)
  } catch (error: any) {
    return handleException(error)
  }
}
