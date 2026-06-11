import { requirePermission } from "@/lib/admin-auth";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TeamForm } from "@/components/admin/forms/team-form";

export default async function NewTeamMemberPage() {
  await requirePermission("about.manage");
  return (
    <div>
      <AdminPageHeader title="Tambah Anggota Tim" />
      <div className="mt-6">
        <TeamForm />
      </div>
    </div>
  );
}
