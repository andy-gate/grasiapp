import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function SectionHeading({
  badge,
  heading,
  description,
  icon: Icon,
  align = "center",
  className,
  as: Tag = "h2",
  gradient = false,
}: {
  badge: string;
  heading: string;
  description?: string;
  icon?: LucideIcon;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2" | "h3";
  gradient?: boolean;
}) {
  return (
    <header
      className={cn(
        "space-y-4",
        align === "center" && "text-center",
        className,
      )}
    >
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-4 py-1.5 text-sm font-medium text-brand-blue-light",
          align === "center" && "mx-auto",
        )}
      >
        {Icon && <Icon className="h-3.5 w-3.5" aria-hidden />}
        {badge}
      </div>
      <Tag
        className={cn(
          "text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl",
          gradient
            ? "bg-gradient-to-r from-white via-brand-blue-light to-brand-violet bg-clip-text text-transparent"
            : "text-white",
        )}
      >
        {heading}
      </Tag>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-base text-slate-400 md:text-lg",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </header>
  );
}
