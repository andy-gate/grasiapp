import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ItCategoryForm } from "@/components/admin/forms/it-category-form";

export default async function EditItCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("it_category.manage");
  const { id } = await params;
  const category = await prisma.itCategory.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Kategori IT" />
      <div className="mt-6">
        <ItCategoryForm category={category} />
      </div>
    </div>
  );
}
