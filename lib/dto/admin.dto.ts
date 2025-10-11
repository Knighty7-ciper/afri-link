import { z } from "zod"

export const CreateAdminSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  full_name: z.string().min(2, "Full name is required"),
  permissions: z.array(z.string()).default([]),
})

export const LoginAdminSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
})

export const UpdateAdminSchema = z.object({
  full_name: z.string().min(2).optional(),
  permissions: z.array(z.string()).optional(),
  is_active: z.boolean().optional(),
})

export const AdminResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string(),
  role: z.literal("admin"),
  permissions: z.array(z.string()),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type CreateAdminDto = z.infer<typeof CreateAdminSchema>
export type LoginAdminDto = z.infer<typeof LoginAdminSchema>
export type UpdateAdminDto = z.infer<typeof UpdateAdminSchema>
export type AdminResponseDto = z.infer<typeof AdminResponseSchema>
