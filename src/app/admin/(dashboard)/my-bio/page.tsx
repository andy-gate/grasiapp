import { requireAdminSession } from "@/lib/admin-auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function MyBioPage() {
  const session = await requireAdminSession();
  const permissions = new Set(session.user.permissions);

  if (!hasPermission(permissions, "bio_page.access")) {
    redirect("/admin");
  }

  const bio = await prisma.bioPage.findUnique({
    where: { userId: session.user.id },
    include: { links: { orderBy: { sortOrder: "asc" } } },
  });

  if (!bio) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Bio Saya</h1>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Belum ada bio page</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              Hubungi admin untuk membuat bio page untuk akun Anda, atau fitur
              editor akan tersedia di update berikutnya.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Bio Saya</h1>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {bio.displayName}
            <Badge>{bio.status}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p>
            URL:{" "}
            {bio.status === "PUBLISHED" ? (
              <Link
                href={`/u/${bio.slug}`}
                className="text-primary underline"
                target="_blank"
              >
                /u/{bio.slug}
              </Link>
            ) : (
              <span className="text-muted-foreground">/u/{bio.slug} (draft)</span>
            )}
          </p>
          <p>Link aktif: {bio.links.filter((l) => l.isActive).length}</p>
        </CardContent>
      </Card>
    </div>
  );
}
