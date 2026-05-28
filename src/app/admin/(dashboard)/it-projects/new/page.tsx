import { requirePermission } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ItProjectForm } from "@/components/admin/forms/it-project-form";

async function loadFormOptions() {
  return Promise.all([
    prisma.itCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.client.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.techStackItem.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);
}

export default async function NewItProjectPage() {
  await requirePermission("it_project.manage");
  const [categories, clients, techStackItems] = await loadFormOptions();

  return (
    <div>
      <AdminPageHeader title="Tambah Proyek IT" />
      <div className="mt-6">
        <ItProjectForm
          categories={categories}
          clients={clients}
          techStackItems={techStackItems}
        />
      </div>
    </div>
  );
}
