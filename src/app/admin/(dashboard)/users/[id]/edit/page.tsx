import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { UserForm } from "@/components/admin/forms/user-form";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("user.manage");
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: { roles: true },
  });
  if (!user) notFound();
  const roles = await prisma.role.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <AdminPageHeader title="Edit User" />
      <div className="mt-6">
        <UserForm
          user={user}
          roles={roles}
          selectedRoleIds={user.roles.map((r) => r.roleId)}
        />
      </div>
    </div>
  );
}
