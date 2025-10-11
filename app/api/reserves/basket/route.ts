import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { ReservesRepository } from "@/lib/repositories/reserves.repository"
import { handleApiError } from "@/lib/middleware/error.middleware"

const reservesRepository = new ReservesRepository()

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const history = url.searchParams.get("history") === "true"

    if (history) {
      const supabase = await createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const basketHistory = await reservesRepository.getBasketHistory(20)
      return NextResponse.json({ history: basketHistory })
    }

    const currentBasket = await reservesRepository.getCurrentBasket()
    return NextResponse.json({ basket: currentBasket })
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
    const { gold_weight, usd_weight, eur_weight, reason } = body

    if (!gold_weight || !usd_weight || !eur_weight) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const totalWeight = gold_weight + usd_weight + eur_weight
    if (Math.abs(totalWeight - 100) > 0.01) {
      return NextResponse.json({ error: "Weights must sum to 100" }, { status: 400 })
    }

    const newBasket = await reservesRepository.createBasketComposition(
      gold_weight,
      usd_weight,
      eur_weight,
      reason || "Basket rebalancing",
      user.id
    )

    return NextResponse.json({ basket: newBasket }, { status: 201 })
  } catch (error: any) {
    return handleApiError(error)
  }
}
