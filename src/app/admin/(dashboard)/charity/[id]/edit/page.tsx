import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CharityForm } from "@/components/admin/forms/charity-form";

export default async function EditCharityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("charity.manage");
  const { id } = await params;
  const project = await prisma.charityProject.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Charity" />
      <div className="mt-6">
        <CharityForm project={project} />
      </div>
    </div>
  );
}
