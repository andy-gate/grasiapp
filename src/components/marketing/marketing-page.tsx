import { cn } from "@/lib/utils";

export function MarketingPage({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-6xl px-4 py-12", className)}>
      <h1 className="text-3xl font-bold text-white md:text-4xl">{title}</h1>
      <div className="mt-8">{children}</div>
    </div>
  );
}
