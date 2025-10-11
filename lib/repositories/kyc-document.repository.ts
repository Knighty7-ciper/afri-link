import { createClient } from "@/lib/supabase/server"
import type { KycDocument } from "@/lib/types/database"

export class KycDocumentRepository {
  async findAll(limit = 100, offset = 0): Promise<KycDocument[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("kyc_documents")
      .select("*")
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data as KycDocument[]
  }

  async findById(id: string): Promise<KycDocument | null> {
    const supabase = await createClient()
    const { data, error } = await supabase.from("kyc_documents").select("*").eq("id", id).maybeSingle()

    if (error) throw error
    return data as KycDocument | null
  }

  async findByUserId(userId: string): Promise<KycDocument[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("kyc_documents")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data as KycDocument[]
  }

  async findByStatus(status: "pending" | "approved" | "rejected"): Promise<KycDocument[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("kyc_documents")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data as KycDocument[]
  }

  async create(documentData: {
    user_id: string
    document_type: "passport" | "national_id" | "drivers_license" | "proof_of_address"
    document_url: string
  }): Promise<KycDocument> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("kyc_documents")
      .insert({
        ...documentData,
        status: "pending",
      })
      .select()
      .single()

    if (error) throw error
    return data as KycDocument
  }

  async updateStatus(
    id: string,
    status: "pending" | "approved" | "rejected",
    rejectionReason?: string
  ): Promise<KycDocument> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("kyc_documents")
      .update({
        status,
        rejection_reason: rejectionReason || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data as KycDocument
  }

  async delete(id: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase.from("kyc_documents").delete().eq("id", id)

    if (error) throw error
  }

  async countByStatus(status: "pending" | "approved" | "rejected"): Promise<number> {
    const supabase = await createClient()
    const { count, error } = await supabase
      .from("kyc_documents")
      .select("*", { count: "exact", head: true })
      .eq("status", status)

    if (error) throw error
    return count || 0
  }
}
