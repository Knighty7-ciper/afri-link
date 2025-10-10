export const ROLES_KEY = "roles"

export function Roles(...roles: string[]) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(ROLES_KEY, roles, descriptor.value)
    return descriptor
  }
}

export function getRolesMetadata(target: any): string[] {
  return Reflect.getMetadata(ROLES_KEY, target) || []
}
