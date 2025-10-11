import { RoleRepository } from "@/lib/repositories/role.repository"
import type { CreateRoleDto, UpdateRoleDto } from "@/lib/dto/role.dto"

export class RoleService {
  private repository: RoleRepository

  constructor() {
    this.repository = new RoleRepository()
  }

  async getAllRoles(limit = 50, offset = 0) {
    return await this.repository.findAll(limit, offset)
  }

  async getRoleById(id: string) {
    const role = await this.repository.findById(id)
    if (!role) {
      throw new Error("Role not found")
    }
    return role
  }

  async getRoleByName(name: string) {
    const role = await this.repository.findByName(name)
    if (!role) {
      throw new Error("Role not found")
    }
    return role
  }

  async createRole(roleData: CreateRoleDto) {
    const existing = await this.repository.findByName(roleData.name)
    if (existing) {
      throw new Error("Role with this name already exists")
    }
    return await this.repository.create(roleData)
  }

  async updateRole(id: string, roleData: UpdateRoleDto) {
    const role = await this.repository.findById(id)
    if (!role) {
      throw new Error("Role not found")
    }

    if (roleData.name) {
      const existing = await this.repository.findByName(roleData.name)
      if (existing && existing.id !== id) {
        throw new Error("Role name already in use")
      }
    }

    return await this.repository.update(id, roleData)
  }

  async deleteRole(id: string) {
    const role = await this.repository.findById(id)
    if (!role) {
      throw new Error("Role not found")
    }
    await this.repository.delete(id)
  }

  async hasPermission(roleId: string, permission: string): Promise<boolean> {
    const role = await this.getRoleById(roleId)
    return role.permissions.includes(permission)
  }

  async addPermission(roleId: string, permission: string) {
    const role = await this.getRoleById(roleId)
    if (!role.permissions.includes(permission)) {
      const updatedPermissions = [...role.permissions, permission]
      return await this.updateRole(roleId, { permissions: updatedPermissions })
    }
    return role
  }

  async removePermission(roleId: string, permission: string) {
    const role = await this.getRoleById(roleId)
    const updatedPermissions = role.permissions.filter(p => p !== permission)
    return await this.updateRole(roleId, { permissions: updatedPermissions })
  }
}
