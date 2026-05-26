import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { DeleteDialog } from "./delete-dialog";

export function RowActions({
  editHref,
  deleteTitle,
  deleteDescription,
  onDelete,
}: {
  editHref: string;
  deleteTitle: string;
  deleteDescription: string;
  onDelete: () => Promise<void>;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={editHref}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "inline-flex items-center gap-1",
        )}
      >
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </Link>
      <DeleteDialog
        title={deleteTitle}
        description={deleteDescription}
        onConfirm={onDelete}
      />
    </div>
  );
}
