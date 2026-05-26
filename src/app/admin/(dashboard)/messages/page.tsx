import { requirePermission } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { markMessageRead } from "@/actions/admin/messages";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default async function AdminMessagesPage() {
  await requirePermission("contact.read");

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <AdminPageHeader title="Pesan Kontak" />
      <div className="mt-6 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`rounded-lg border p-4 ${m.readAt ? "opacity-70" : "bg-muted/30"}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium">
                  {m.name} · {m.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(m.createdAt, "dd MMM yyyy HH:mm")} · {m.locale}
                </p>
              </div>
              {!m.readAt && (
                <form action={markMessageRead.bind(null, m.id)}>
                  <Button type="submit" size="sm" variant="outline">
                    Tandai dibaca
                  </Button>
                </form>
              )}
            </div>
            <p className="mt-3 text-sm whitespace-pre-wrap">{m.message}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-muted-foreground">Belum ada pesan.</p>
        )}
      </div>
    </div>
  );
}
