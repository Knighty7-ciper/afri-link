import { z } from "zod"

export const CreateNewsSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  category_id: z.string().uuid().optional(),
  author_id: z.string().uuid(),
  published: z.boolean().default(false),
  image_url: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
})

export const UpdateNewsSchema = z.object({
  title: z.string().min(5).optional(),
  content: z.string().min(20).optional(),
  category_id: z.string().uuid().optional(),
  published: z.boolean().optional(),
  image_url: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
})

export const NewsResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  category_id: z.string().uuid().nullable(),
  author_id: z.string().uuid(),
  published: z.boolean(),
  image_url: z.string().nullable(),
  tags: z.array(z.string()).nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type CreateNewsDto = z.infer<typeof CreateNewsSchema>
export type UpdateNewsDto = z.infer<typeof UpdateNewsSchema>
export type NewsResponseDto = z.infer<typeof NewsResponseSchema>
