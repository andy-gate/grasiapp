import { requireAdminSession } from "@/lib/admin-auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { BioForm } from "@/components/admin/forms/bio-form";

export default async function MyBioPage() {
  const session = await requireAdminSession();
  const permissions = new Set(session.user.permissions);

  if (!hasPermission(permissions, "bio_page.access")) {
    redirect("/admin");
  }

  const bio = await prisma.bioPage.findUnique({
    where: { userId: session.user.id },
    include: {
      links: { orderBy: { sortOrder: "asc" } },
      avatarMedia: true,
      backgroundMedia: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bio Saya</h1>
      </div>
      <BioForm initialData={bio || undefined} />
    </div>
  );
}

