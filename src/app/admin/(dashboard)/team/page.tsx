import { requirePermission } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { deleteTeamMember } from "@/actions/admin/team";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminDataTable } from "@/components/admin/data-table";
import { RowActions } from "@/components/admin/row-actions";

export default async function AdminTeamPage() {
  await requirePermission("about.manage");

  const members = await prisma.teamMember.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <AdminPageHeader
        title="Tim"
        description="Kelola anggota tim yang ditampilkan di halaman Tentang Kami"
        createHref="/admin/team/new"
      />
      <div className="mt-6">
        <AdminDataTable
          columns={["Nama", "Jabatan (ID)", "Foto", "Urutan", "Aktif", "Aksi"]}
          rows={members.map((member) => ({
            id: member.id,
            cells: [
              member.name,
              member.roleId,
              member.photoUrl ? "Ya" : "—",
              String(member.sortOrder),
              member.isActive ? "Ya" : "Tidak",
              <RowActions
                key="actions"
                editHref={`/admin/team/${member.id}/edit`}
                deleteTitle="Hapus anggota tim?"
                deleteDescription={`"${member.name}" akan dihapus permanen.`}
                onDelete={deleteTeamMember.bind(null, member.id)}
              />,
            ],
          }))}
        />
      </div>
    </div>
  );
}
