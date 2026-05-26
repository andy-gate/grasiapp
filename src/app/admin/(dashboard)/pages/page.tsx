import { requirePermission } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { deletePage } from "@/actions/admin/pages";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  AdminDataTable,
  StatusBadge,
} from "@/components/admin/data-table";
import { RowActions } from "@/components/admin/row-actions";

export default async function AdminPagesPage() {
  await requirePermission("page.manage");

  const pages = await prisma.page.findMany({ orderBy: { slug: "asc" } });

  return (
    <div>
      <AdminPageHeader
        title="Halaman CMS"
        createHref="/admin/pages/new"
      />
      <div className="mt-6">
        <AdminDataTable
          columns={["Slug", "Judul", "Status", "Aksi"]}
          rows={pages.map((p) => ({
            id: p.id,
            cells: [
              p.slug,
              p.titleId,
              <StatusBadge key="s" status={p.status} />,
              <RowActions
                key="a"
                editHref={`/admin/pages/${p.id}/edit`}
                deleteTitle="Hapus halaman?"
                deleteDescription={`Halaman "${p.slug}" akan dihapus.`}
                onDelete={deletePage.bind(null, p.id)}
              />,
            ],
          }))}
        />
      </div>
    </div>
  );
}
