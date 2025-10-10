import { z } from "zod"

export const CreateExchangeRateSchema = z.object({
  from_currency: z.string().length(3, "Currency code must be 3 characters"),
  to_currency: z.string().length(3, "Currency code must be 3 characters"),
  rate: z.number().positive("Rate must be positive"),
  source: z.string().optional(),
})

export const UpdateExchangeRateSchema = z.object({
  rate: z.number().positive().optional(),
  source: z.string().optional(),
})

export const ExchangeRateResponseSchema = z.object({
  id: z.string().uuid(),
  from_currency: z.string(),
  to_currency: z.string(),
  rate: z.number(),
  source: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type CreateExchangeRateDto = z.infer<typeof CreateExchangeRateSchema>
export type UpdateExchangeRateDto = z.infer<typeof UpdateExchangeRateSchema>
export type ExchangeRateResponseDto = z.infer<typeof ExchangeRateResponseSchema>
