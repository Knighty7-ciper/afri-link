import { createClient } from "@/lib/supabase/server"
import type { CreateRoleDto, UpdateRoleDto, RoleResponseDto } from "@/lib/dto/role.dto"

export class RoleRepository {
  async findAll(limit = 50, offset = 0): Promise<RoleResponseDto[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("roles")
      .select("*")
      .order("name", { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data as RoleResponseDto[]
  }

  async findById(id: string): Promise<RoleResponseDto | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("roles")
      .select("*")
      .eq("id", id)
      .maybeSingle()

    if (error) throw error
    return data as RoleResponseDto | null
  }

  async findByName(name: string): Promise<RoleResponseDto | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("roles")
      .select("*")
      .eq("name", name)
      .maybeSingle()

    if (error) throw error
    return data as RoleResponseDto | null
  }

  async create(roleData: CreateRoleDto): Promise<RoleResponseDto> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("roles")
      .insert(roleData)
      .select()
      .single()

    if (error) throw error
    return data as RoleResponseDto
  }

  async update(id: string, roleData: UpdateRoleDto): Promise<RoleResponseDto> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("roles")
      .update(roleData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data as RoleResponseDto
  }

  async delete(id: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase
      .from("roles")
      .delete()
      .eq("id", id)

    if (error) throw error
  }
}
