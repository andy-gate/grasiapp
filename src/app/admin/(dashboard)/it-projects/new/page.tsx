import { requirePermission } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ItProjectForm } from "@/components/admin/forms/it-project-form";

export default async function NewItProjectPage() {
  await requirePermission("it_project.manage");
  const categories = await prisma.itCategory.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <AdminPageHeader title="Tambah Proyek IT" />
      <div className="mt-6">
        <ItProjectForm categories={categories} />
      </div>
    </div>
  );
}
