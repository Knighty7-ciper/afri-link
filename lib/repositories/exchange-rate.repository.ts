import { createClient } from "@/lib/supabase/server"
import type { ExchangeRate } from "@/lib/types/database"
import type { CreateExchangeRateDto, UpdateExchangeRateDto } from "@/lib/dto/exchange-rate.dto"

export class ExchangeRateRepository {
  async findAll(limit = 100, offset = 0): Promise<ExchangeRate[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("exchange_rates")
      .select("*")
      .order("updated_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data as ExchangeRate[]
  }

  async findById(id: string): Promise<ExchangeRate | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("exchange_rates")
      .select("*")
      .eq("id", id)
      .maybeSingle()

    if (error) throw error
    return data as ExchangeRate | null
  }

  async findByPair(fromCurrency: string, toCurrency: string): Promise<ExchangeRate | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("exchange_rates")
      .select("*")
      .eq("from_currency", fromCurrency)
      .eq("to_currency", toCurrency)
      .maybeSingle()

    if (error) throw error
    return data as ExchangeRate | null
  }

  async findByCurrency(currency: string): Promise<ExchangeRate[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("exchange_rates")
      .select("*")
      .or(`from_currency.eq.${currency},to_currency.eq.${currency}`)

    if (error) throw error
    return data as ExchangeRate[]
  }

  async create(rateData: CreateExchangeRateDto): Promise<ExchangeRate> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("exchange_rates")
      .insert(rateData)
      .select()
      .single()

    if (error) throw error
    return data as ExchangeRate
  }

  async update(id: string, rateData: UpdateExchangeRateDto): Promise<ExchangeRate> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("exchange_rates")
      .update(rateData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data as ExchangeRate
  }

  async upsert(rateData: CreateExchangeRateDto): Promise<ExchangeRate> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("exchange_rates")
      .upsert(
        {
          ...rateData,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "from_currency,to_currency",
        }
      )
      .select()
      .single()

    if (error) throw error
    return data as ExchangeRate
  }

  async delete(id: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase
      .from("exchange_rates")
      .delete()
      .eq("id", id)

    if (error) throw error
  }
}
