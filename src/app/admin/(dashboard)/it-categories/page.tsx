import { requirePermission } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { deleteItCategory } from "@/actions/admin/it-categories";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  AdminDataTable,
  StatusBadge,
} from "@/components/admin/data-table";
import { RowActions } from "@/components/admin/row-actions";

export default async function AdminItCategoriesPage() {
  await requirePermission("it_category.manage");

  const categories = await prisma.itCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { projects: true } } },
  });

  return (
    <div>
      <AdminPageHeader
        title="Kategori IT"
        description="Kelola kategori untuk proyek IT (Web, Mobile, AI, …)"
        createHref="/admin/it-categories/new"
      />
      <div className="mt-6">
        <AdminDataTable
          columns={["Slug", "Nama (ID)", "Proyek", "Aktif", "Aksi"]}
          rows={categories.map((c) => ({
            id: c.id,
            cells: [
              c.slug,
              c.nameId,
              String(c._count.projects),
              c.isActive ? "Ya" : "Tidak",
              <RowActions
                key="actions"
                editHref={`/admin/it-categories/${c.id}/edit`}
                deleteTitle="Hapus kategori?"
                deleteDescription={`Kategori "${c.nameId}" akan dihapus permanen.`}
                onDelete={deleteItCategory.bind(null, c.id)}
              />,
            ],
          }))}
        />
      </div>
    </div>
  );
}
