import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { KycService } from "@/lib/services/kyc.service"
import { handleApiError } from "@/lib/middleware/error.middleware"

const kycService = new KycService()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const document = await kycService.getDocumentById(params.id)

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()

    if (document.user_id !== user.id && profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json({ document })
  } catch (error: any) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
    const { status, rejection_reason } = body

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    let document
    if (status === "approved") {
      document = await kycService.approveDocument(params.id, user.id)
    } else if (status === "rejected") {
      if (!rejection_reason) {
        return NextResponse.json({ error: "Rejection reason is required" }, { status: 400 })
      }
      document = await kycService.rejectDocument(params.id, rejection_reason, user.id)
    } else {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    return NextResponse.json({ document })
  } catch (error: any) {
    return handleApiError(error)
  }
}
