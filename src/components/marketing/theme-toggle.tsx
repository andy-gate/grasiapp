"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className }: { className?: string }) {
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.classList.contains("marketing-light"));
  }, []);

  const toggle = () => {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("marketing-light", next);
    try {
      localStorage.setItem("marketing-theme", next ? "light" : "dark");
    } catch {
      // localStorage tidak tersedia (mis. mode privat) — abaikan
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={light ? "Aktifkan mode gelap" : "Aktifkan mode terang"}
      className={className}
    >
      {light ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </button>
  );
}
