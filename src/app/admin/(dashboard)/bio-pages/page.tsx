import { requirePermission } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { deleteBioPage } from "@/actions/admin/bio";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  AdminDataTable,
  StatusBadge,
} from "@/components/admin/data-table";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import Link from "next/link";

export default async function AdminBioPagesPage() {
  await requirePermission("bio_page.manage");

  const pages = await prisma.bioPage.findMany({
    include: { user: true, _count: { select: { links: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Bio Pages"
        description="Daftar semua halaman bio Linktree pengguna terdaftar."
      />
      <div className="mt-6">
        <AdminDataTable
          columns={["Slug", "Nama", "User", "Link", "Status", "Preview", "Aksi"]}
          rows={pages.map((b) => ({
            id: b.id,
            cells: [
              b.slug,
              b.displayName,
              b.user.email,
              String(b._count.links),
              <StatusBadge key="s" status={b.status} />,
              b.status === "PUBLISHED" ? (
                <Link
                  key="p"
                  href={`/u/${b.slug}`}
                  className="text-primary underline"
                  target="_blank"
                >
                  /u/{b.slug}
                </Link>
              ) : (
                "-"
              ),
              <div key="a" className="flex items-center justify-end">
                <DeleteDialog
                  title="Hapus Bio Page?"
                  description={`Halaman bio milik ${b.displayName} (/u/${b.slug}) akan dihapus secara permanen.`}
                  onConfirm={deleteBioPage.bind(null, b.id)}
                />
              </div>,
            ],
          }))}
        />
      </div>
    </div>
  );
}

