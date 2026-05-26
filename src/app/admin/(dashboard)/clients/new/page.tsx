import { requirePermission } from "@/lib/admin-auth";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ClientForm } from "@/components/admin/forms/client-form";

export default async function NewClientPage() {
  await requirePermission("client.manage");
  return (
    <div>
      <AdminPageHeader title="Tambah Klien" />
      <div className="mt-6">
        <ClientForm />
      </div>
    </div>
  );
}
