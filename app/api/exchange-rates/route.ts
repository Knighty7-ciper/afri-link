import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { ExchangeRateService } from "@/lib/services/exchange-rate-service"
import { handleApiError } from "@/lib/middleware/error.middleware"

const exchangeRateService = new ExchangeRateService()

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const fromCurrency = url.searchParams.get("from")
    const toCurrency = url.searchParams.get("to")

    if (fromCurrency && toCurrency) {
      const rate = await exchangeRateService.getRate(fromCurrency, toCurrency)
      return NextResponse.json({ rate })
    }

    const supabase = await createClient()
    const { data: rates, error } = await supabase
      .from("exchange_rates")
      .select("*")
      .order("updated_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ rates })
  } catch (error: any) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { from_currency, to_currency, rate } = body

    if (!from_currency || !to_currency || !rate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: newRate, error } = await supabase
      .from("exchange_rates")
      .upsert(
        {
          from_currency,
          to_currency,
          rate: parseFloat(rate),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "from_currency,to_currency",
        }
      )
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ rate: newRate }, { status: 201 })
  } catch (error: any) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const result = await exchangeRateService.updateAllRates()
    return NextResponse.json(result)
  } catch (error: any) {
    return handleApiError(error)
  }
}
