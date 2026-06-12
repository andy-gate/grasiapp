"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "./brand-logo";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/it", key: "it" },
  { href: "/charity", key: "charity" },
  { href: "/translator", key: "translator" },
  { href: "/contact", key: "contact" },
] as const;

export function SiteHeader() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-(--m-border) bg-(--m-header-bg) backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <BrandLogo variant="nav" size="md" className="shrink-0" />

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors",
                pathname === item.href
                  ? "text-(--m-accent)"
                  : "text-(--m-muted) hover:text-(--m-strong)",
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle className="flex size-8 items-center justify-center rounded-full border border-(--m-border) text-(--m-muted) transition-colors hover:border-(--m-border-strong) hover:text-(--m-strong)" />
          <Link
            href={pathname}
            locale={locale === "id" ? "en" : "id"}
            className="hidden text-sm font-medium text-(--m-muted) hover:text-(--m-strong) sm:inline"
          >
            {locale === "id" ? "EN" : "ID"}
          </Link>
          <button
            type="button"
            className="inline-flex text-(--m-strong) md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-(--m-border) px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-(--m-soft-text)"
              >
                {t(item.key)}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
