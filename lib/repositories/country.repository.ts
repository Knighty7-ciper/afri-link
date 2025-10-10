import { createClient } from "@/lib/supabase/server"
import type { CreateCountryDto, UpdateCountryDto, CountryResponseDto } from "@/lib/dto/country.dto"

export class CountryRepository {
  async findAll(limit = 200, offset = 0): Promise<CountryResponseDto[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("countries")
      .select("*")
      .order("name", { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data as CountryResponseDto[]
  }

  async findById(id: string): Promise<CountryResponseDto | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("countries")
      .select("*")
      .eq("id", id)
      .maybeSingle()

    if (error) throw error
    return data as CountryResponseDto | null
  }

  async findByCode(code: string): Promise<CountryResponseDto | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("countries")
      .select("*")
      .eq("code", code)
      .maybeSingle()

    if (error) throw error
    return data as CountryResponseDto | null
  }

  async findActive(): Promise<CountryResponseDto[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("countries")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true })

    if (error) throw error
    return data as CountryResponseDto[]
  }

  async create(countryData: CreateCountryDto): Promise<CountryResponseDto> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("countries")
      .insert(countryData)
      .select()
      .single()

    if (error) throw error
    return data as CountryResponseDto
  }

  async update(id: string, countryData: UpdateCountryDto): Promise<CountryResponseDto> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("countries")
      .update(countryData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data as CountryResponseDto
  }

  async delete(id: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase
      .from("countries")
      .delete()
      .eq("id", id)

    if (error) throw error
  }
}
