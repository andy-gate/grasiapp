import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ItProjectForm } from "@/components/admin/forms/it-project-form";

export default async function EditItProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("it_project.manage");
  const { id } = await params;
  const [project, categories] = await Promise.all([
    prisma.itProject.findUnique({ where: { id } }),
    prisma.itCategory.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  if (!project) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Proyek IT" />
      <div className="mt-6">
        <ItProjectForm project={project} categories={categories} />
      </div>
    </div>
  );
}
