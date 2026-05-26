import { prisma } from "@/lib/db";

export async function getUserPermissions(userId: string): Promise<Set<string>> {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: {
      role: {
        include: {
          permissions: {
            include: { permission: true },
          },
        },
      },
    },
  });

  const permissions = new Set<string>();
  for (const ur of userRoles) {
    for (const rp of ur.role.permissions) {
      permissions.add(rp.permission.slug);
    }
  }
  return permissions;
}

export function hasPermission(
  permissions: Set<string>,
  required: string,
): boolean {
  if (permissions.has(required)) return true;
  const [resource] = required.split(".");
  return permissions.has(`${resource}.manage`);
}

export function hasAnyPermission(
  permissions: Set<string>,
  required: string[],
): boolean {
  return required.some((p) => hasPermission(permissions, p));
}
