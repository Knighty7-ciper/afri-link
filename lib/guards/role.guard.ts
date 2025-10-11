import { createClient } from "@/lib/supabase/server"

export async function requireRole(requiredRole: string | string[]) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error("Unauthorized: Authentication required")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  if (!profile) {
    throw new Error("User profile not found")
  }

  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]

  if (!roles.includes(profile.role)) {
    throw new Error(`Forbidden: Required role(s): ${roles.join(", ")}`)
  }

  return user
}

export async function hasRole(userId: string, role: string | string[]): Promise<boolean> {
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle()

  if (!profile) return false

  const roles = Array.isArray(role) ? role : [role]
  return roles.includes(profile.role)
}
