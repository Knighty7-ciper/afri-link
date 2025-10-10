import { z } from "zod"

export const CreateNewsCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  description: z.string().optional(),
  slug: z.string().min(2, "Slug is required"),
})

export const UpdateNewsCategorySchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  slug: z.string().min(2).optional(),
})

export const NewsCategoryResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  slug: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type CreateNewsCategoryDto = z.infer<typeof CreateNewsCategorySchema>
export type UpdateNewsCategoryDto = z.infer<typeof UpdateNewsCategorySchema>
export type NewsCategoryResponseDto = z.infer<typeof NewsCategoryResponseSchema>
