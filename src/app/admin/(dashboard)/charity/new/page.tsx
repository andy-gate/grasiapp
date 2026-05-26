import { requirePermission } from "@/lib/admin-auth";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CharityForm } from "@/components/admin/forms/charity-form";

export default async function NewCharityPage() {
  await requirePermission("charity.manage");
  return (
    <div>
      <AdminPageHeader title="Tambah Charity" />
      <div className="mt-6">
        <CharityForm />
      </div>
    </div>
  );
}
