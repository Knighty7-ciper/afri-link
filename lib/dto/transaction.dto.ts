import { z } from "zod"

export const CreateTransactionSchema = z.object({
  from_wallet_id: z.string().uuid().optional(),
  to_wallet_id: z.string().uuid().optional(),
  from_user_id: z.string().uuid().optional(),
  to_user_id: z.string().uuid().optional(),
  amount: z.number().positive("Amount must be positive"),
  transaction_type: z.enum(["transfer", "deposit", "withdrawal", "exchange"]),
  description: z.string().optional(),
  fee: z.number().default(0),
})

export const UpdateTransactionSchema = z.object({
  status: z.enum(["pending", "completed", "failed"]).optional(),
  description: z.string().optional(),
})

export const TransactionResponseSchema = z.object({
  id: z.string().uuid(),
  transaction_hash: z.string(),
  from_wallet_id: z.string().uuid().nullable(),
  to_wallet_id: z.string().uuid().nullable(),
  from_user_id: z.string().uuid().nullable(),
  to_user_id: z.string().uuid().nullable(),
  amount: z.number(),
  transaction_type: z.enum(["transfer", "deposit", "withdrawal", "exchange"]),
  status: z.enum(["pending", "completed", "failed"]),
  description: z.string().nullable(),
  fee: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const TransactionHistorySchema = z.object({
  transactions: z.array(TransactionResponseSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
})

export const TransactionStatusSchema = z.object({
  transaction_id: z.string().uuid(),
  status: z.enum(["pending", "completed", "failed"]),
  message: z.string().optional(),
})

export type CreateTransactionDto = z.infer<typeof CreateTransactionSchema>
export type UpdateTransactionDto = z.infer<typeof UpdateTransactionSchema>
export type TransactionResponseDto = z.infer<typeof TransactionResponseSchema>
export type TransactionHistoryDto = z.infer<typeof TransactionHistorySchema>
export type TransactionStatusDto = z.infer<typeof TransactionStatusSchema>
