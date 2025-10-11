import { z } from "zod"

export const CreateCountrySchema = z.object({
  code: z.string().length(2, "Country code must be 2 characters"),
  name: z.string().min(1, "Country name is required"),
  currency_code: z.string().length(3, "Currency code must be 3 characters"),
  flag_url: z.string().url().optional(),
  is_active: z.boolean().default(true),
})

export const UpdateCountrySchema = z.object({
  name: z.string().optional(),
  currency_code: z.string().length(3).optional(),
  flag_url: z.string().url().optional(),
  is_active: z.boolean().optional(),
})

export const CountryResponseSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  currency_code: z.string(),
  flag_url: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type CreateCountryDto = z.infer<typeof CreateCountrySchema>
export type UpdateCountryDto = z.infer<typeof UpdateCountrySchema>
export type CountryResponseDto = z.infer<typeof CountryResponseSchema>
