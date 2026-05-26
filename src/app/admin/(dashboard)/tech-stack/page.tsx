import { requirePermission } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { deleteTechStackItem } from "@/actions/admin/tech-stack";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminDataTable } from "@/components/admin/data-table";
import { RowActions } from "@/components/admin/row-actions";

export default async function AdminTechStackPage() {
  await requirePermission("tech_stack.manage");

  const items = await prisma.techStackItem.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <AdminPageHeader
        title="Tech Stack"
        description="Kelola teknologi yang ditampilkan di landing page"
        createHref="/admin/tech-stack/new"
      />
      <div className="mt-6">
        <AdminDataTable
          columns={["Slug", "Nama (ID)", "Nama (EN)", "Urutan", "Aktif", "Aksi"]}
          rows={items.map((item) => ({
            id: item.id,
            cells: [
              item.slug,
              item.nameId,
              item.nameEn,
              String(item.sortOrder),
              item.isActive ? "Ya" : "Tidak",
              <RowActions
                key="actions"
                editHref={`/admin/tech-stack/${item.id}/edit`}
                deleteTitle="Hapus teknologi?"
                deleteDescription={`"${item.nameId}" akan dihapus permanen.`}
                onDelete={deleteTechStackItem.bind(null, item.id)}
              />,
            ],
          }))}
        />
      </div>
    </div>
  );
}
