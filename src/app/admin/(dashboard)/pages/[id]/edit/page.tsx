import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PageForm } from "@/components/admin/forms/page-form";

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("page.manage");
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Halaman CMS" />
      <div className="mt-6">
        <PageForm page={page} />
      </div>
    </div>
  );
}
