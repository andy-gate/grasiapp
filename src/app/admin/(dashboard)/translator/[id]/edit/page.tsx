import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TranslatorForm } from "@/components/admin/forms/translator-form";

export default async function EditTranslatorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("translator.manage");
  const { id } = await params;
  const service = await prisma.translatorService.findUnique({ where: { id } });
  if (!service) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Layanan Translator" />
      <div className="mt-6">
        <TranslatorForm service={service} />
      </div>
    </div>
  );
}
