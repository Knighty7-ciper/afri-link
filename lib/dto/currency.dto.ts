import { z } from "zod"

export const CreateCurrencySchema = z.object({
  code: z.string().length(3, "Currency code must be 3 characters"),
  name: z.string().min(1, "Currency name is required"),
  symbol: z.string().min(1, "Currency symbol is required"),
  country_code: z.string().length(2, "Country code must be 2 characters"),
  is_active: z.boolean().default(true),
})

export const UpdateCurrencySchema = z.object({
  name: z.string().optional(),
  symbol: z.string().optional(),
  is_active: z.boolean().optional(),
})

export const CurrencyResponseSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  symbol: z.string(),
  country_code: z.string(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type CreateCurrencyDto = z.infer<typeof CreateCurrencySchema>
export type UpdateCurrencyDto = z.infer<typeof UpdateCurrencySchema>
export type CurrencyResponseDto = z.infer<typeof CurrencyResponseSchema>
