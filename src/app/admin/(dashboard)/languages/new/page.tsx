import { requirePermission } from "@/lib/admin-auth";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { LanguageForm } from "@/components/admin/forms/language-form";

export default async function NewLanguagePage() {
  await requirePermission("translator.manage");
  return (
    <div>
      <AdminPageHeader title="Tambah Bahasa" />
      <div className="mt-6">
        <LanguageForm />
      </div>
    </div>
  );
}
