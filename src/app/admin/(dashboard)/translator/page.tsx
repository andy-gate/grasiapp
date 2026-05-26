import { requirePermission } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { deleteTranslatorService } from "@/actions/admin/translator";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  AdminDataTable,
  StatusBadge,
} from "@/components/admin/data-table";
import { RowActions } from "@/components/admin/row-actions";

export default async function AdminTranslatorPage() {
  await requirePermission("translator.manage");

  const services = await prisma.translatorService.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <AdminPageHeader
        title="Layanan Translator"
        createHref="/admin/translator/new"
      />
      <div className="mt-6">
        <AdminDataTable
          columns={["Slug", "Nama", "Tipe", "Status", "Aksi"]}
          rows={services.map((s) => ({
            id: s.id,
            cells: [
              s.slug,
              s.nameId,
              s.serviceType,
              <StatusBadge key="st" status={s.status} />,
              <RowActions
                key="a"
                editHref={`/admin/translator/${s.id}/edit`}
                deleteTitle="Hapus layanan?"
                deleteDescription={`"${s.nameId}" akan dihapus.`}
                onDelete={deleteTranslatorService.bind(null, s.id)}
              />,
            ],
          }))}
        />
      </div>
    </div>
  );
}
