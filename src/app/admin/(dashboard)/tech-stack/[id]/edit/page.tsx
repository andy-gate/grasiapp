import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TechStackForm } from "@/components/admin/forms/tech-stack-form";

export default async function EditTechStackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("tech_stack.manage");
  const { id } = await params;
  const item = await prisma.techStackItem.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Teknologi" />
      <div className="mt-6">
        <TechStackForm item={item} />
      </div>
    </div>
  );
}
