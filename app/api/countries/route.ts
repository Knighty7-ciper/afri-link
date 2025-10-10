import { NextRequest } from "next/server"
import { CountryService } from "@/lib/services/country.service"
import { CreateCountrySchema } from "@/lib/dto/country.dto"
import { requireAdmin } from "@/lib/guards/admin.guard"
import { successResponse, validationErrorResponse } from "@/lib/utils/response.util"
import { validateRequest } from "@/lib/utils/validation.util"
import { getPaginationParams } from "@/lib/utils/pagination.util"
import { handleException } from "@/lib/filters/http-exception.filter"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get("active") === "true"

    const countryService = new CountryService()

    if (activeOnly) {
      const countries = await countryService.getActiveCountries()
      return successResponse(countries)
    }

    const { page, limit, offset } = getPaginationParams(
      searchParams.get("page") || undefined,
      searchParams.get("limit") || undefined,
      50,
      200
    )

    const countries = await countryService.getAllCountries(limit, offset)
    return successResponse(countries)
  } catch (error: any) {
    return handleException(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const validation = await validateRequest(CreateCountrySchema, body)

    if (!validation.success) {
      return validationErrorResponse("Validation failed", validation.errors)
    }

    const countryService = new CountryService()
    const country = await countryService.createCountry(validation.data)

    return successResponse(country, "Country created successfully", 201)
  } catch (error: any) {
    return handleException(error)
  }
}
