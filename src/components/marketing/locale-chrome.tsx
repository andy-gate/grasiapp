"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";

type LocaleChromeProps = {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
};

export function LocaleChrome({ children, header, footer }: LocaleChromeProps) {
  const pathname = usePathname();
  const isLoginRoute = pathname === "/login";

  return (
    <div className="marketing-theme flex min-h-screen flex-col bg-(--m-bg) text-(--m-text)">
      {!isLoginRoute && header}
      <main
        className={
          isLoginRoute
            ? "flex flex-1 items-center justify-center overflow-hidden px-6"
            : "flex-1"
        }
      >
        {children}
      </main>
      {!isLoginRoute && footer}
    </div>
  );
}
