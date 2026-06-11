import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TeamForm } from "@/components/admin/forms/team-form";

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("about.manage");
  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Anggota Tim" />
      <div className="mt-6">
        <TeamForm member={member} />
      </div>
    </div>
  );
}
