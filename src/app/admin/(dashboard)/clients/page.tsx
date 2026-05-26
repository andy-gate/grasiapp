import { requirePermission } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { deleteClient } from "@/actions/admin/clients";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminDataTable } from "@/components/admin/data-table";
import { RowActions } from "@/components/admin/row-actions";

export default async function AdminClientsPage() {
  await requirePermission("client.manage");

  const clients = await prisma.client.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <AdminPageHeader
        title="Klien"
        description="Kelola daftar klien / partner yang ditampilkan di landing page"
        createHref="/admin/clients/new"
      />
      <div className="mt-6">
        <AdminDataTable
          columns={["Slug", "Nama (ID)", "Logo", "Website", "Urutan", "Aktif", "Aksi"]}
          rows={clients.map((client) => ({
            id: client.id,
            cells: [
              client.slug,
              client.nameId,
              client.logoUrl ? "Ya" : "—",
              client.websiteUrl ?? "—",
              String(client.sortOrder),
              client.isActive ? "Ya" : "Tidak",
              <RowActions
                key="actions"
                editHref={`/admin/clients/${client.id}/edit`}
                deleteTitle="Hapus klien?"
                deleteDescription={`"${client.nameId}" akan dihapus permanen.`}
                onDelete={deleteClient.bind(null, client.id)}
              />,
            ],
          }))}
        />
      </div>
    </div>
  );
}
