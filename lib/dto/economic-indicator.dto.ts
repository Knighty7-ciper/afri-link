import { z } from "zod"

export const CreateEconomicIndicatorSchema = z.object({
  country_code: z.string().length(2, "Country code must be 2 characters"),
  indicator_type: z.enum(["gdp", "inflation", "unemployment", "interest_rate", "trade_balance"]),
  value: z.number(),
  period: z.string(),
  source: z.string().optional(),
})

export const UpdateEconomicIndicatorSchema = z.object({
  value: z.number().optional(),
  period: z.string().optional(),
  source: z.string().optional(),
})

export const EconomicIndicatorResponseSchema = z.object({
  id: z.string().uuid(),
  country_code: z.string(),
  indicator_type: z.enum(["gdp", "inflation", "unemployment", "interest_rate", "trade_balance"]),
  value: z.number(),
  period: z.string(),
  source: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type CreateEconomicIndicatorDto = z.infer<typeof CreateEconomicIndicatorSchema>
export type UpdateEconomicIndicatorDto = z.infer<typeof UpdateEconomicIndicatorSchema>
export type EconomicIndicatorResponseDto = z.infer<typeof EconomicIndicatorResponseSchema>
