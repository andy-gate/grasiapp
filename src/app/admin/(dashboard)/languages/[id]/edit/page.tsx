import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { LanguageForm } from "@/components/admin/forms/language-form";

export default async function EditLanguagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("translator.manage");
  const { id } = await params;
  const language = await prisma.language.findUnique({ where: { id } });
  if (!language) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Bahasa" />
      <div className="mt-6">
        <LanguageForm language={language} />
      </div>
    </div>
  );
}
