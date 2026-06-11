import { requirePermission } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TranslatorForm } from "@/components/admin/forms/translator-form";

export default async function NewTranslatorPage() {
  await requirePermission("translator.manage");
  const languages = await prisma.language.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <AdminPageHeader title="Tambah Layanan Translator" />
      <div className="mt-6">
        <TranslatorForm
          languages={languages.map((lang) => ({
            id: lang.id,
            name: lang.nameId,
          }))}
        />
      </div>
    </div>
  );
}
