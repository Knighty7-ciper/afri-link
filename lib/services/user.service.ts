import { UserRepository } from "@/lib/repositories/user.repository"
import type { CreateUserDto, UpdateUserDto, UserProfileDto } from "@/lib/dto/user.dto"

export class UserService {
  private repository: UserRepository

  constructor() {
    this.repository = new UserRepository()
  }

  async getAllUsers(limit = 100, offset = 0) {
    return await this.repository.findAll(limit, offset)
  }

  async getUserById(id: string) {
    const user = await this.repository.findById(id)
    if (!user) {
      throw new Error("User not found")
    }
    return user
  }

  async getUserByEmail(email: string) {
    const user = await this.repository.findByEmail(email)
    if (!user) {
      throw new Error("User not found")
    }
    return user
  }

  async createUser(userData: CreateUserDto) {
    const existingUser = await this.repository.findByEmail(userData.email)
    if (existingUser) {
      throw new Error("User with this email already exists")
    }
    return await this.repository.create(userData)
  }

  async updateUser(id: string, userData: UpdateUserDto) {
    const user = await this.repository.findById(id)
    if (!user) {
      throw new Error("User not found")
    }

    if (userData.email) {
      const existingUser = await this.repository.findByEmail(userData.email)
      if (existingUser && existingUser.id !== id) {
        throw new Error("Email already in use")
      }
    }

    return await this.repository.update(id, userData)
  }

  async deleteUser(id: string) {
    const user = await this.repository.findById(id)
    if (!user) {
      throw new Error("User not found")
    }
    await this.repository.delete(id)
  }

  async updateKycStatus(id: string, status: "pending" | "approved" | "rejected") {
    const user = await this.repository.findById(id)
    if (!user) {
      throw new Error("User not found")
    }
    return await this.repository.updateKycStatus(id, status)
  }

  async getUserProfile(id: string): Promise<UserProfileDto> {
    const user = await this.getUserById(id)
    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      kyc_status: user.kyc_status,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }
  }
}
