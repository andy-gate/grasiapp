"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderCode,
  Tags,
  Heart,
  Languages,
  FileText,
  Users,
  Link2,
  Mail,
  UserCircle,
  Layers,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/marketing/brand-logo";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
};

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/admin/it-categories",
    label: "Kategori IT",
    icon: Tags,
    permission: "it_category.manage",
  },
  {
    href: "/admin/it-projects",
    label: "Proyek IT",
    icon: FolderCode,
    permission: "it_project.manage",
  },
  {
    href: "/admin/tech-stack",
    label: "Tech Stack",
    icon: Layers,
    permission: "tech_stack.manage",
  },
  {
    href: "/admin/clients",
    label: "Klien",
    icon: Building2,
    permission: "client.manage",
  },
  {
    href: "/admin/charity",
    label: "Charity",
    icon: Heart,
    permission: "charity.manage",
  },
  {
    href: "/admin/translator",
    label: "Translator",
    icon: Languages,
    permission: "translator.manage",
  },
  {
    href: "/admin/pages",
    label: "Halaman CMS",
    icon: FileText,
    permission: "page.manage",
  },
  {
    href: "/admin/messages",
    label: "Pesan Kontak",
    icon: Mail,
    permission: "contact.read",
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
    permission: "user.manage",
  },
  {
    href: "/admin/bio-pages",
    label: "Bio Pages",
    icon: Link2,
    permission: "bio_page.manage",
  },
  {
    href: "/admin/my-bio",
    label: "Bio Saya",
    icon: UserCircle,
    permission: "bio_page.access",
  },
];

export function AdminSidebar({
  permissions,
}: {
  permissions: string[];
}) {
  const pathname = usePathname();
  const permSet = new Set(permissions);

  const canSee = (item: NavItem) => {
    if (!item.permission) return true;
    if (permSet.has(item.permission)) return true;
    const [resource] = item.permission.split(".");
    return permSet.has(`${resource}.manage`);
  };

  return (
    <aside className="flex w-56 flex-col border-r bg-muted/20">
      <div className="flex h-16 items-center border-b px-4">
        <BrandLogo
          variant="onLight"
          size="sm"
          href="/admin"
          link="next"
        />
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.filter(canSee).map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-3">
        <Link
          href="/id"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Ke situs
        </Link>
      </div>
    </aside>
  );
}
