import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { ReservesRepository } from "@/lib/repositories/reserves.repository"
import { handleApiError } from "@/lib/middleware/error.middleware"

const reservesRepository = new ReservesRepository()

export async function GET(request: NextRequest) {
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

    const reserves = await reservesRepository.getAllReserves()
    const totalValue = await reservesRepository.getTotalReserveValue()

    return NextResponse.json({ reserves, totalValue })
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
    const { asset_type, amount, custody_provider, location, reason } = body

    if (!asset_type || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const reserve = await reservesRepository.addReserve(asset_type, amount, custody_provider, location)

    await reservesRepository.createReserveTransaction("deposit", asset_type, amount, reason || "Reserve deposit", user.id)

    return NextResponse.json({ reserve }, { status: 201 })
  } catch (error: any) {
    return handleApiError(error)
  }
}
