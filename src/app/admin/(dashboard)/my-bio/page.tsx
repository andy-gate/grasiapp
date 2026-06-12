import { requireAdminSession } from "@/lib/admin-auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { BioForm } from "@/components/admin/forms/bio-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

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

  // Default initial data for new bio page
  const initialData = bio
    ? {
        ...bio,
        links: bio.links.map((link) => ({
          id: link.id,
          title: link.title,
          url: link.url,
          isActive: link.isActive,
          openInNewTab: link.openInNewTab,
        })),
      }
    : {
        slug: session.user.username || "",
        displayName: session.user.name || "",
        bio: "",
        status: "DRAFT",
        themePreset: "light",
        backgroundType: "COLOR",
        backgroundValue: "#f8fafc",
        buttonStyle: "rounded",
        buttonColor: "#0f172a",
        textColor: "#0f172a",
        fontFamily: "sans",
        links: [],
      };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Bio Saya"
        description="Kelola halaman bio publik ala Linktree Anda sendiri."
      />
      <BioForm initialData={initialData} />
    </div>
  );
}

