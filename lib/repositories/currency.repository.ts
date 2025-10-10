import { createClient } from "@/lib/supabase/server"
import type { CreateCurrencyDto, UpdateCurrencyDto, CurrencyResponseDto } from "@/lib/dto/currency.dto"

export class CurrencyRepository {
  async findAll(limit = 100, offset = 0): Promise<CurrencyResponseDto[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("currencies")
      .select("*")
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data as CurrencyResponseDto[]
  }

  async findById(id: string): Promise<CurrencyResponseDto | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("currencies")
      .select("*")
      .eq("id", id)
      .maybeSingle()

    if (error) throw error
    return data as CurrencyResponseDto | null
  }

  async findByCode(code: string): Promise<CurrencyResponseDto | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("currencies")
      .select("*")
      .eq("code", code)
      .maybeSingle()

    if (error) throw error
    return data as CurrencyResponseDto | null
  }

  async findActive(): Promise<CurrencyResponseDto[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("currencies")
      .select("*")
      .eq("is_active", true)

    if (error) throw error
    return data as CurrencyResponseDto[]
  }

  async create(currencyData: CreateCurrencyDto): Promise<CurrencyResponseDto> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("currencies")
      .insert(currencyData)
      .select()
      .single()

    if (error) throw error
    return data as CurrencyResponseDto
  }

  async update(id: string, currencyData: UpdateCurrencyDto): Promise<CurrencyResponseDto> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("currencies")
      .update(currencyData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data as CurrencyResponseDto
  }

  async delete(id: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase
      .from("currencies")
      .delete()
      .eq("id", id)

    if (error) throw error
  }
}
