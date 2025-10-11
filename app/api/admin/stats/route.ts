import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { AdminService } from "@/lib/services/admin.service"
import { handleApiError } from "@/lib/middleware/error.middleware"

const adminService = new AdminService()

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

    const stats = await adminService.getPlatformStatistics()
    return NextResponse.json({ stats })
  } catch (error: any) {
    return handleApiError(error)
  }
}
