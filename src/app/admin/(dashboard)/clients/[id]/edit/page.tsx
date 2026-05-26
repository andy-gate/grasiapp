import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ClientForm } from "@/components/admin/forms/client-form";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("client.manage");
  const { id } = await params;
  const client = await prisma.client.findUnique({ where: { id } });
  if (!client) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Klien" />
      <div className="mt-6">
        <ClientForm client={client} />
      </div>
    </div>
  );
}
