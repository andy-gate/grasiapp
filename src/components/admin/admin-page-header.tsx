import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export function AdminPageHeader({
  title,
  description,
  createHref,
  createLabel = "Tambah",
}: {
  title: string;
  description?: string;
  createHref?: string;
  createLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {createHref && (
        <Link
          href={createHref}
          className={cn(buttonVariants(), "inline-flex items-center gap-2")}
        >
          <Plus className="h-4 w-4" />
          {createLabel}
        </Link>
      )}
    </div>
  );
}
