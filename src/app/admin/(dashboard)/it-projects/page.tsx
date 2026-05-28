import { requirePermission } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { deleteItProject } from "@/actions/admin/it-projects";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  AdminDataTable,
  StatusBadge,
} from "@/components/admin/data-table";
import { RowActions } from "@/components/admin/row-actions";

export default async function AdminItProjectsPage() {
  await requirePermission("it_project.manage");

  const projects = await prisma.itProject.findMany({
    include: { categories: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <AdminPageHeader
        title="Proyek IT"
        createHref="/admin/it-projects/new"
      />
      <div className="mt-6">
        <AdminDataTable
          columns={["Slug", "Judul", "Kategori", "Status", "Aksi"]}
          rows={projects.map((p) => ({
            id: p.id,
            cells: [
              p.slug,
              p.titleId,
              p.categories.map((c) => c.nameId).join(", ") || "—",
              <StatusBadge key="s" status={p.status} />,
              <RowActions
                key="a"
                editHref={`/admin/it-projects/${p.id}/edit`}
                deleteTitle="Hapus proyek?"
                deleteDescription={`"${p.titleId}" akan dihapus.`}
                onDelete={deleteItProject.bind(null, p.id)}
              />,
            ],
          }))}
        />
      </div>
    </div>
  );
}
