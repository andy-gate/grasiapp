import { requirePermission } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { UserForm } from "@/components/admin/forms/user-form";

export default async function NewUserPage() {
  await requirePermission("user.manage");
  const roles = await prisma.role.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <AdminPageHeader title="Tambah User" />
      <div className="mt-6">
        <UserForm roles={roles} />
      </div>
    </div>
  );
}
