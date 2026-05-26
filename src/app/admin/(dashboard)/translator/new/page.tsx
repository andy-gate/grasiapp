import { requirePermission } from "@/lib/admin-auth";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TranslatorForm } from "@/components/admin/forms/translator-form";

export default async function NewTranslatorPage() {
  await requirePermission("translator.manage");
  return (
    <div>
      <AdminPageHeader title="Tambah Layanan Translator" />
      <div className="mt-6">
        <TranslatorForm />
      </div>
    </div>
  );
}
