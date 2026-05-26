import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const [it, charity, translator, messages, bioPages] = await Promise.all([
    prisma.itProject.count(),
    prisma.charityProject.count(),
    prisma.translatorService.count(),
    prisma.contactMessage.count({ where: { readAt: null } }),
    prisma.bioPage.count(),
  ]);

  const stats = [
    { label: "Proyek IT", value: it },
    { label: "Charity", value: charity },
    { label: "Layanan Translator", value: translator },
    { label: "Pesan belum dibaca", value: messages },
    { label: "Bio pages", value: bioPages },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">
        Ringkasan konten GrasiApp
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
