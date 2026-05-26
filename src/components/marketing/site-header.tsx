"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "./brand-logo";

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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#000000]/80 backdrop-blur-xl">
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
                  ? "text-brand-blue-light"
                  : "text-slate-400 hover:text-white",
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={pathname}
            locale={locale === "id" ? "en" : "id"}
            className="hidden text-sm font-medium text-slate-400 hover:text-white sm:inline"
          >
            {locale === "id" ? "EN" : "ID"}
          </Link>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ size: "sm" }),
              "hidden border-0 bg-gradient-to-r from-brand-indigo to-brand-blue sm:inline-flex hover:opacity-90",
            )}
          >
            {t("login")}
          </Link>
          <button
            type="button"
            className="inline-flex text-white md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-slate-300"
              >
                {t(item.key)}
              </Link>
            ))}
            <Link href="/login" onClick={() => setOpen(false)}>
              {t("login")}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
