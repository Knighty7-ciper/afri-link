import { z } from "zod"

export const CreateUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().optional(),
})

export const UpdateUserSchema = z.object({
  full_name: z.string().min(2).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
})

export const LoginUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
})

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().nullable(),
  role: z.enum(["user", "admin"]),
  kyc_status: z.enum(["pending", "approved", "rejected"]),
  created_at: z.string(),
  updated_at: z.string(),
})

export const UserSettingsSchema = z.object({
  notifications_enabled: z.boolean().optional(),
  two_factor_enabled: z.boolean().optional(),
  preferred_currency: z.string().optional(),
  language: z.string().optional(),
})

export type CreateUserDto = z.infer<typeof CreateUserSchema>
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>
export type LoginUserDto = z.infer<typeof LoginUserSchema>
export type UserProfileDto = z.infer<typeof UserProfileSchema>
export type UserSettingsDto = z.infer<typeof UserSettingsSchema>
