import { createClient } from "@/lib/supabase/server"
import type { Transaction } from "@/lib/types/database"
import type { CreateTransactionDto, UpdateTransactionDto } from "@/lib/dto/transaction.dto"

export class TransactionRepository {
  async findAll(limit = 100, offset = 0): Promise<Transaction[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data as Transaction[]
  }

  async findById(id: string): Promise<Transaction | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", id)
      .maybeSingle()

    if (error) throw error
    return data as Transaction | null
  }

  async findByUserId(userId: string, limit = 50, offset = 0): Promise<Transaction[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data as Transaction[]
  }

  async findByWalletId(walletId: string, limit = 50, offset = 0): Promise<Transaction[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .or(`from_wallet_id.eq.${walletId},to_wallet_id.eq.${walletId}`)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data as Transaction[]
  }

  async findByStatus(status: "pending" | "completed" | "failed", limit = 100, offset = 0): Promise<Transaction[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data as Transaction[]
  }

  async create(transactionData: CreateTransactionDto & { transaction_hash: string }): Promise<Transaction> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("transactions")
      .insert({
        ...transactionData,
        status: "pending",
      })
      .select()
      .single()

    if (error) throw error
    return data as Transaction
  }

  async update(id: string, transactionData: UpdateTransactionDto): Promise<Transaction> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("transactions")
      .update(transactionData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data as Transaction
  }

  async delete(id: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id)

    if (error) throw error
  }

  async countByUserId(userId: string): Promise<number> {
    const supabase = await createClient()
    const { count, error } = await supabase
      .from("transactions")
      .select("*", { count: "exact", head: true })
      .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)

    if (error) throw error
    return count || 0
  }
}
