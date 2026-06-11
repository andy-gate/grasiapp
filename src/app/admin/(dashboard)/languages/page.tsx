import { requirePermission } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { deleteLanguage } from "@/actions/admin/languages";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminDataTable } from "@/components/admin/data-table";
import { RowActions } from "@/components/admin/row-actions";

export default async function AdminLanguagesPage() {
  await requirePermission("translator.manage");

  const languages = await prisma.language.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <AdminPageHeader
        title="Bahasa"
        description="Kelola pilihan bahasa untuk tarif & kalkulator harga translator"
        createHref="/admin/languages/new"
      />
      <div className="mt-6">
        <AdminDataTable
          columns={["Kode", "Nama (ID)", "Nama (EN)", "Urutan", "Aktif", "Aksi"]}
          rows={languages.map((language) => ({
            id: language.id,
            cells: [
              language.code,
              language.nameId,
              language.nameEn,
              String(language.sortOrder),
              language.isActive ? "Ya" : "Tidak",
              <RowActions
                key="actions"
                editHref={`/admin/languages/${language.id}/edit`}
                deleteTitle="Hapus bahasa?"
                deleteDescription={`"${language.nameId}" akan dihapus beserta tarif yang memakainya.`}
                onDelete={deleteLanguage.bind(null, language.id)}
              />,
            ],
          }))}
        />
      </div>
    </div>
  );
}
