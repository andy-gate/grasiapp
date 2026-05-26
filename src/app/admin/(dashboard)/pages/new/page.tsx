import { requirePermission } from "@/lib/admin-auth";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PageForm } from "@/components/admin/forms/page-form";

export default async function NewPagePage() {
  await requirePermission("page.manage");
  return (
    <div>
      <AdminPageHeader title="Tambah Halaman CMS" />
      <div className="mt-6">
        <PageForm />
      </div>
    </div>
  );
}
