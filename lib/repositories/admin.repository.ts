import { createClient } from "@/lib/supabase/server"
import type { User } from "@/lib/types/database"

export class AdminRepository {
  async findAllAdmins(limit = 100, offset = 0): Promise<User[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "admin")
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data as User[]
  }

  async findAdminById(id: string): Promise<User | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .eq("role", "admin")
      .maybeSingle()

    if (error) throw error
    return data as User | null
  }

  async countAdmins(): Promise<number> {
    const supabase = await createClient()
    const { count, error } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin")

    if (error) throw error
    return count || 0
  }

  async updateAdminPermissions(id: string, permissions: string[]): Promise<User> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("profiles")
      .update({
        permissions,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("role", "admin")
      .select()
      .single()

    if (error) throw error
    return data as User
  }

  async toggleAdminStatus(id: string, isActive: boolean): Promise<User> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("profiles")
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("role", "admin")
      .select()
      .single()

    if (error) throw error
    return data as User
  }
}
