import { requirePermission } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { deleteCharityProject } from "@/actions/admin/charity";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  AdminDataTable,
  StatusBadge,
} from "@/components/admin/data-table";
import { RowActions } from "@/components/admin/row-actions";

export default async function AdminCharityPage() {
  await requirePermission("charity.manage");

  const projects = await prisma.charityProject.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <AdminPageHeader title="Charity" createHref="/admin/charity/new" />
      <div className="mt-6">
        <AdminDataTable
          columns={["Slug", "Judul", "Status", "Aksi"]}
          rows={projects.map((p) => ({
            id: p.id,
            cells: [
              p.slug,
              p.titleId,
              <StatusBadge key="s" status={p.status} />,
              <RowActions
                key="a"
                editHref={`/admin/charity/${p.id}/edit`}
                deleteTitle="Hapus program?"
                deleteDescription={`"${p.titleId}" akan dihapus.`}
                onDelete={deleteCharityProject.bind(null, p.id)}
              />,
            ],
          }))}
        />
      </div>
    </div>
  );
}
