import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { KycService } from "@/lib/services/kyc.service"
import { handleApiError } from "@/lib/middleware/error.middleware"

const kycService = new KycService()

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const status = url.searchParams.get("status")

    if (status === "pending") {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()

      if (profile?.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }

      const documents = await kycService.getPendingDocuments()
      return NextResponse.json({ documents })
    }

    const documents = await kycService.getUserDocuments(user.id)
    return NextResponse.json({ documents })
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

    const body = await request.json()
    const { document_type, document_url } = body

    if (!document_type || !document_url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const document = await kycService.submitDocument(user.id, document_type, document_url)
    return NextResponse.json({ document }, { status: 201 })
  } catch (error: any) {
    return handleApiError(error)
  }
}
