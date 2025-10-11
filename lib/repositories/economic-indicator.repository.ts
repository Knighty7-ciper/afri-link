import { createClient } from "@/lib/supabase/server"
import type { CreateEconomicIndicatorDto, UpdateEconomicIndicatorDto, EconomicIndicatorResponseDto } from "@/lib/dto/economic-indicator.dto"

export class EconomicIndicatorRepository {
  async findAll(limit = 100, offset = 0): Promise<EconomicIndicatorResponseDto[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("economic_indicators")
      .select("*")
      .order("period", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data as EconomicIndicatorResponseDto[]
  }

  async findById(id: string): Promise<EconomicIndicatorResponseDto | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("economic_indicators")
      .select("*")
      .eq("id", id)
      .maybeSingle()

    if (error) throw error
    return data as EconomicIndicatorResponseDto | null
  }

  async findByCountry(countryCode: string, limit = 50, offset = 0): Promise<EconomicIndicatorResponseDto[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("economic_indicators")
      .select("*")
      .eq("country_code", countryCode)
      .order("period", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data as EconomicIndicatorResponseDto[]
  }

  async findByType(type: string, limit = 50, offset = 0): Promise<EconomicIndicatorResponseDto[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("economic_indicators")
      .select("*")
      .eq("indicator_type", type)
      .order("period", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data as EconomicIndicatorResponseDto[]
  }

  async findByCountryAndType(
    countryCode: string,
    type: string,
    limit = 50,
    offset = 0
  ): Promise<EconomicIndicatorResponseDto[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("economic_indicators")
      .select("*")
      .eq("country_code", countryCode)
      .eq("indicator_type", type)
      .order("period", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data as EconomicIndicatorResponseDto[]
  }

  async create(indicatorData: CreateEconomicIndicatorDto): Promise<EconomicIndicatorResponseDto> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("economic_indicators")
      .insert(indicatorData)
      .select()
      .single()

    if (error) throw error
    return data as EconomicIndicatorResponseDto
  }

  async update(id: string, indicatorData: UpdateEconomicIndicatorDto): Promise<EconomicIndicatorResponseDto> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("economic_indicators")
      .update(indicatorData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data as EconomicIndicatorResponseDto
  }

  async delete(id: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase
      .from("economic_indicators")
      .delete()
      .eq("id", id)

    if (error) throw error
  }
}
