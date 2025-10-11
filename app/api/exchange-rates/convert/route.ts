import { NextRequest, NextResponse } from "next/server"
import { ExchangeRateService } from "@/lib/services/exchange-rate-service"
import { handleApiError } from "@/lib/middleware/error.middleware"

const exchangeRateService = new ExchangeRateService()

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const from = url.searchParams.get("from")
    const to = url.searchParams.get("to")
    const amountStr = url.searchParams.get("amount")

    if (!from || !to || !amountStr) {
      return NextResponse.json({ error: "Missing required parameters: from, to, amount" }, { status: 400 })
    }

    const amount = parseFloat(amountStr)

    if (isNaN(amount)) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const result = await exchangeRateService.convertAmount(from, to, amount)
    return NextResponse.json(result)
  } catch (error: any) {
    return handleApiError(error)
  }
}
