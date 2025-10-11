import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function requireAuth(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    }
  }

  return {
    authorized: true,
    user,
  }
}

export async function requireAdmin(request: NextRequest) {
  const authResult = await requireAuth(request)

  if (!authResult.authorized) {
    return authResult
  }

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authResult.user!.id)
    .maybeSingle()

  if (profile?.role !== "admin") {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 }),
    }
  }

  return {
    authorized: true,
    user: authResult.user,
    profile,
  }
}

export async function requireRole(request: NextRequest, allowedRoles: string[]) {
  const authResult = await requireAuth(request)

  if (!authResult.authorized) {
    return authResult
  }

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authResult.user!.id)
    .maybeSingle()

  if (!profile || !allowedRoles.includes(profile.role)) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: `Forbidden - Required role: ${allowedRoles.join(" or ")}` },
        { status: 403 }
      ),
    }
  }

  return {
    authorized: true,
    user: authResult.user,
    profile,
  }
}

export async function optionalAuth(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return {
    user: user || null,
  }
}
