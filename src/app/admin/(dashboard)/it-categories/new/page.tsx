import { requirePermission } from "@/lib/admin-auth";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ItCategoryForm } from "@/components/admin/forms/it-category-form";

export default async function NewItCategoryPage() {
  await requirePermission("it_category.manage");
  return (
    <div>
      <AdminPageHeader title="Tambah Kategori IT" />
      <div className="mt-6">
        <ItCategoryForm />
      </div>
    </div>
  );
}
