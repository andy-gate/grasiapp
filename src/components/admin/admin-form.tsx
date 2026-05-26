"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/action-result";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminForm({
  action,
  children,
  cancelHref,
  submitLabel = "Simpan",
}: {
  action: (
    prev: ActionResult,
    formData: FormData,
  ) => Promise<ActionResult>;
  children: React.ReactNode;
  cancelHref: string;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, { ok: true });

  return (
    <form action={formAction} className="mx-auto max-w-3xl space-y-6">
      {state.ok === false && (
        <p className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}
      {children}
      <div className="flex gap-3 border-t pt-6">
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : submitLabel}
        </Button>
        <Link
          href={cancelHref}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
