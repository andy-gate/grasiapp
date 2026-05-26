import { requirePermission } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { deleteUser } from "@/actions/admin/users";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminDataTable } from "@/components/admin/data-table";
import { RowActions } from "@/components/admin/row-actions";

export default async function AdminUsersPage() {
  await requirePermission("user.manage");

  const users = await prisma.user.findMany({
    include: {
      roles: { include: { role: true } },
      bioPage: { select: { slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <AdminPageHeader
        title="Users"
        description="Assign role bio_user untuk akses halaman bio."
        createHref="/admin/users/new"
      />
      <div className="mt-6">
        <AdminDataTable
          columns={["Email", "Nama", "Role", "Bio", "Aksi"]}
          rows={users.map((u) => ({
            id: u.id,
            cells: [
              u.email,
              u.name,
              u.roles.map((r) => r.role.slug).join(", ") || "-",
              u.bioPage?.slug ?? "-",
              <RowActions
                key="a"
                editHref={`/admin/users/${u.id}/edit`}
                deleteTitle="Hapus user?"
                deleteDescription={`Akun ${u.email} akan dihapus.`}
                onDelete={deleteUser.bind(null, u.id)}
              />,
            ],
          }))}
        />
      </div>
    </div>
  );
}
