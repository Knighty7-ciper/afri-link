import { z } from "zod"

export const CreateWalletSchema = z.object({
  user_id: z.string().uuid(),
  stellar_public_key: z.string().optional(),
})

export const UpdateWalletSchema = z.object({
  is_active: z.boolean().optional(),
})

export const WalletBalanceSchema = z.object({
  balance: z.number(),
  currency: z.string(),
  locked_balance: z.number().optional(),
})

export const WalletResponseSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  stellar_public_key: z.string(),
  balance: z.number(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type CreateWalletDto = z.infer<typeof CreateWalletSchema>
export type UpdateWalletDto = z.infer<typeof UpdateWalletSchema>
export type WalletBalanceDto = z.infer<typeof WalletBalanceSchema>
export type WalletResponseDto = z.infer<typeof WalletResponseSchema>
