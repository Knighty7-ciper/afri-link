import { createClient } from "@/lib/supabase/server"

export interface BasketComposition {
  id: string
  gold_weight: number
  usd_weight: number
  eur_weight: number
  effective_date: string
  reason: string | null
  created_at: string
  created_by: string | null
}

export interface Reserve {
  id: string
  asset_type: "gold" | "usd" | "eur"
  amount: number
  custody_provider: string | null
  location: string | null
  created_at: string
  updated_at: string
}

export interface ReserveTransaction {
  id: string
  transaction_type: "deposit" | "withdrawal" | "rebalance" | "audit_adjustment"
  asset_type: "gold" | "usd" | "eur"
  amount: number
  reason: string | null
  status: "pending" | "approved" | "executed" | "rejected"
  created_by: string | null
  approved_by: string | null
  created_at: string
  updated_at: string
}

export class ReservesRepository {
  async getCurrentBasket(): Promise<BasketComposition | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("act_basket_composition")
      .select("*")
      .order("effective_date", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) throw error
    return data as BasketComposition | null
  }

  async getBasketHistory(limit = 10): Promise<BasketComposition[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("act_basket_composition")
      .select("*")
      .order("effective_date", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as BasketComposition[]
  }

  async createBasketComposition(
    goldWeight: number,
    usdWeight: number,
    eurWeight: number,
    reason: string,
    userId: string
  ): Promise<BasketComposition> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("act_basket_composition")
      .insert({
        gold_weight: goldWeight,
        usd_weight: usdWeight,
        eur_weight: eurWeight,
        reason,
        created_by: userId,
        effective_date: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data as BasketComposition
  }

  async getAllReserves(): Promise<Reserve[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("act_reserves")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return data as Reserve[]
  }

  async getReservesByAssetType(assetType: "gold" | "usd" | "eur"): Promise<Reserve[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("act_reserves")
      .select("*")
      .eq("asset_type", assetType)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data as Reserve[]
  }

  async addReserve(
    assetType: "gold" | "usd" | "eur",
    amount: number,
    custodyProvider?: string,
    location?: string
  ): Promise<Reserve> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("act_reserves")
      .insert({
        asset_type: assetType,
        amount,
        custody_provider: custodyProvider || null,
        location: location || null,
      })
      .select()
      .single()

    if (error) throw error
    return data as Reserve
  }

  async getReserveTransactions(limit = 50): Promise<ReserveTransaction[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("reserve_transactions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as ReserveTransaction[]
  }

  async createReserveTransaction(
    transactionType: "deposit" | "withdrawal" | "rebalance" | "audit_adjustment",
    assetType: "gold" | "usd" | "eur",
    amount: number,
    reason: string,
    userId: string
  ): Promise<ReserveTransaction> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("reserve_transactions")
      .insert({
        transaction_type: transactionType,
        asset_type: assetType,
        amount,
        reason,
        created_by: userId,
        status: "pending",
      })
      .select()
      .single()

    if (error) throw error
    return data as ReserveTransaction
  }

  async updateReserveTransactionStatus(
    id: string,
    status: "approved" | "executed" | "rejected",
    userId: string
  ): Promise<ReserveTransaction> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("reserve_transactions")
      .update({
        status,
        approved_by: userId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data as ReserveTransaction
  }

  async getTotalReserveValue(): Promise<{ gold: number; usd: number; eur: number }> {
    const supabase = await createClient()

    const { data: goldData } = await supabase
      .from("act_reserves")
      .select("amount")
      .eq("asset_type", "gold")

    const { data: usdData } = await supabase
      .from("act_reserves")
      .select("amount")
      .eq("asset_type", "usd")

    const { data: eurData } = await supabase
      .from("act_reserves")
      .select("amount")
      .eq("asset_type", "eur")

    const gold = goldData?.reduce((sum, r) => sum + r.amount, 0) || 0
    const usd = usdData?.reduce((sum, r) => sum + r.amount, 0) || 0
    const eur = eurData?.reduce((sum, r) => sum + r.amount, 0) || 0

    return { gold, usd, eur }
  }
}
