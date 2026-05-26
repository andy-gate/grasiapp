import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";

export async function requireAdminSession() {
  const session = await auth();
  if (!session?.user) {
    redirect("/id/login");
  }
  return session;
}

export async function requirePermission(permission: string) {
  const session = await requireAdminSession();
  const permissions = new Set(session.user.permissions);
  if (!hasPermission(permissions, permission)) {
    redirect("/admin");
  }
  return session;
}
