import { requirePermission } from "@/lib/admin-auth";
import { getSpeedPackages } from "@/lib/translator-pricing";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TranslatorSpeedsForm } from "@/components/admin/forms/translator-speeds-form";

export default async function TurnaroundPage() {
  await requirePermission("translator.manage");
  const packages = await getSpeedPackages();

  return (
    <div>
      <AdminPageHeader
        title="Waktu Pengerjaan"
        description="Kelola opsi waktu pengerjaan translator untuk kalkulator harga"
      />
      <div className="mt-6">
        <TranslatorSpeedsForm packages={packages} />
      </div>
    </div>
  );
}
