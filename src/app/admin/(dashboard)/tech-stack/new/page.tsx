import { requirePermission } from "@/lib/admin-auth";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TechStackForm } from "@/components/admin/forms/tech-stack-form";

export default async function NewTechStackPage() {
  await requirePermission("tech_stack.manage");
  return (
    <div>
      <AdminPageHeader title="Tambah Teknologi" />
      <div className="mt-6">
        <TechStackForm />
      </div>
    </div>
  );
}
