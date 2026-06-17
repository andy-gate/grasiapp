import { requirePermission } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import {
  AdminDataTable,
  StatusBadge,
} from "@/components/admin/data-table";
import Link from "next/link";

export default async function AdminBioPagesPage() {
  await requirePermission("bio_page.manage");

  const pages = await prisma.bioPage.findMany({
    include: { user: true, _count: { select: { links: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Bio Pages</h1>
      <div className="mt-6">
        <AdminDataTable
          columns={["Slug", "Nama", "User", "Link", "Status", "Preview"]}
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
            ],
          }))}
        />
      </div>
    </div>
  );
}
