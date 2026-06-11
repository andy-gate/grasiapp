import { requirePermission } from "@/lib/admin-auth";
import { getAboutSettings } from "@/lib/about";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AboutSettingsForm } from "@/components/admin/forms/about-settings-form";

export default async function AdminAboutPage() {
  await requirePermission("about.manage");
  const settings = await getAboutSettings();

  return (
    <div>
      <AdminPageHeader
        title="Tentang Kami"
        description="Kelola visi, misi, statistik, dan nilai perusahaan di halaman Tentang Kami"
      />
      <div className="mt-6">
        <AboutSettingsForm settings={settings} />
      </div>
    </div>
  );
}
