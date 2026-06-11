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
  const [service, languages] = await Promise.all([
    prisma.translatorService.findUnique({
      where: { id },
      include: { rates: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.language.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);
  if (!service) notFound();

  const { rates, ...serviceData } = service;

  return (
    <div>
      <AdminPageHeader title="Edit Layanan Translator" />
      <div className="mt-6">
        <TranslatorForm
          service={serviceData}
          rates={rates.map((rate) => ({
            sourceLanguageId: rate.sourceLanguageId,
            targetLanguageId: rate.targetLanguageId,
            pricePerPage: Number(rate.pricePerPage),
          }))}
          languages={languages.map((lang) => ({
            id: lang.id,
            name: lang.nameId,
          }))}
        />
      </div>
    </div>
  );
}
