import { createClient } from "@/lib/supabase/server"
import type { User } from "@/lib/types/database"
import type { CreateUserDto, UpdateUserDto } from "@/lib/dto/user.dto"

export class UserRepository {
  async findAll(limit = 100, offset = 0): Promise<User[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data as User[]
  }

  async findById(id: string): Promise<User | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .maybeSingle()

    if (error) throw error
    return data as User | null
  }

  async findByEmail(email: string): Promise<User | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .maybeSingle()

    if (error) throw error
    return data as User | null
  }

  async create(userData: CreateUserDto): Promise<User> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        email: userData.email,
        full_name: userData.full_name,
      })
      .select()
      .single()

    if (error) throw error
    return data as User
  }

  async update(id: string, userData: UpdateUserDto): Promise<User> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("profiles")
      .update(userData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data as User
  }

  async delete(id: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id)

    if (error) throw error
  }

  async updateKycStatus(
    id: string,
    status: "pending" | "approved" | "rejected"
  ): Promise<User> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("profiles")
      .update({ kyc_status: status })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data as User
  }
}
