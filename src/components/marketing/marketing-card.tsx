import { cn } from "@/lib/utils";

export function MarketingCard({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "article";
}) {
  return (
    <Tag
      className={cn(
        "rounded-xl border border-(--m-border) bg-(--m-card) p-6 backdrop-blur transition-all hover:border-brand-blue/40 hover:shadow-xl hover:shadow-brand-blue/10",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
