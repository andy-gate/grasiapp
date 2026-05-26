import { requireAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SignOutButton } from "@/components/admin/sign-out-button";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar permissions={session.user.permissions} />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b px-6">
          <p className="text-sm text-muted-foreground">
            {session.user.name} ({session.user.email})
          </p>
          <SignOutButton />
        </header>
        <div className="flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}
