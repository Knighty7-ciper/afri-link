import { createClient } from "@/lib/supabase/server"
import type { Wallet } from "@/lib/types/database"
import type { CreateWalletDto, UpdateWalletDto } from "@/lib/dto/wallet.dto"

export class WalletRepository {
  async findAll(limit = 100, offset = 0): Promise<Wallet[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("wallets")
      .select("*")
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data as Wallet[]
  }

  async findById(id: string): Promise<Wallet | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("wallets")
      .select("*")
      .eq("id", id)
      .maybeSingle()

    if (error) throw error
    return data as Wallet | null
  }

  async findByUserId(userId: string): Promise<Wallet[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)

    if (error) throw error
    return data as Wallet[]
  }

  async findByPublicKey(publicKey: string): Promise<Wallet | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("wallets")
      .select("*")
      .eq("stellar_public_key", publicKey)
      .maybeSingle()

    if (error) throw error
    return data as Wallet | null
  }

  async create(walletData: CreateWalletDto & { stellar_public_key: string; stellar_secret_key_encrypted: string }): Promise<Wallet> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("wallets")
      .insert(walletData)
      .select()
      .single()

    if (error) throw error
    return data as Wallet
  }

  async update(id: string, walletData: UpdateWalletDto): Promise<Wallet> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("wallets")
      .update(walletData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data as Wallet
  }

  async updateBalance(id: string, balance: number): Promise<Wallet> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("wallets")
      .update({ balance })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data as Wallet
  }

  async delete(id: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase
      .from("wallets")
      .delete()
      .eq("id", id)

    if (error) throw error
  }
}
