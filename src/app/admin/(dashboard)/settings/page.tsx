import { requirePermission } from "@/lib/admin-auth";
import { getCompanySettings } from "@/lib/company";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CompanySettingsForm } from "@/components/admin/forms/company-settings-form";

export default async function AdminSettingsPage() {
  await requirePermission("setting.manage");
  const settings = await getCompanySettings();

  return (
    <div>
      <AdminPageHeader
        title="Info Perusahaan"
        description="Kelola email, telepon, WhatsApp, alamat, jam operasional, dan media sosial"
      />
      <div className="mt-6">
        <CompanySettingsForm settings={settings} />
      </div>
    </div>
  );
}
