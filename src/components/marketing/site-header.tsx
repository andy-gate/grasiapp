"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "./brand-logo";
import { ThemeToggle } from "./theme-toggle";
import { motion, AnimatePresence } from "framer-motion";

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
    <header className="sticky top-0 z-50 border-b border-(--m-border) bg-(--m-header-bg) backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <BrandLogo variant="nav" size="md" className="shrink-0" />

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "text-(--m-strong)"
                    : "text-(--m-muted) hover:text-(--m-strong)",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-(--m-soft-strong)"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle className="flex size-8 items-center justify-center rounded-full border border-(--m-border) text-(--m-muted) transition-colors hover:border-(--m-border-strong) hover:text-(--m-strong) cursor-pointer" />
          
          <div className="hidden items-center gap-0.5 rounded-full border border-(--m-border) p-0.5 sm:flex bg-(--m-soft)">
            <Link
              href={pathname}
              locale="id"
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold transition-colors duration-200",
                locale === "id"
                  ? "bg-(--m-strong) text-(--m-bg)"
                  : "text-(--m-muted) hover:text-(--m-strong)"
              )}
            >
              ID
            </Link>
            <Link
              href={pathname}
              locale="en"
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold transition-colors duration-200",
                locale === "en"
                  ? "bg-(--m-strong) text-(--m-bg)"
                  : "text-(--m-muted) hover:text-(--m-strong)"
              )}
            >
              EN
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex size-8 items-center justify-center rounded-full border border-(--m-border) text-(--m-strong) md:hidden cursor-pointer hover:bg-(--m-soft)"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-t border-(--m-border) bg-(--m-header-bg) backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-(--m-soft-strong) text-(--m-strong)"
                        : "text-(--m-soft-text) hover:bg-(--m-soft) hover:text-(--m-strong)"
                    )}
                  >
                    {t(item.key)}
                  </Link>
                );
              })}
              <div className="mt-2 flex items-center justify-between border-t border-(--m-border) pt-4 px-3">
                <span className="text-xs font-semibold text-(--m-muted) uppercase tracking-wider">
                  Language / Bahasa
                </span>
                <div className="flex items-center gap-0.5 rounded-full border border-(--m-border) p-0.5 bg-(--m-soft)">
                  <Link
                    href={pathname}
                    locale="id"
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
                      locale === "id"
                        ? "bg-(--m-strong) text-(--m-bg)"
                        : "text-(--m-muted) hover:text-(--m-strong)"
                    )}
                  >
                    ID
                  </Link>
                  <Link
                    href={pathname}
                    locale="en"
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
                      locale === "en"
                        ? "bg-(--m-strong) text-(--m-bg)"
                        : "text-(--m-muted) hover:text-(--m-strong)"
                    )}
                  >
                    EN
                  </Link>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
