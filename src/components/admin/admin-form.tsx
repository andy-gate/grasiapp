"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/action-result";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

async function compressImage(file: File, quality = 0.8, maxWidth = 1600): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: outputType,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          outputType,
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = event.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

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
  const wrappedAction = async (prev: ActionResult, formData: FormData) => {
    const compressedFormData = new FormData();
    for (const [key, value] of formData.entries()) {
      if (value instanceof File && value.type.startsWith("image/") && value.size > 0) {
        try {
          const compressedFile = await compressImage(value);
          compressedFormData.append(key, compressedFile);
        } catch {
          compressedFormData.append(key, value);
        }
      } else {
        compressedFormData.append(key, value);
      }
    }
    return action(prev, compressedFormData);
  };

  const [state, formAction, pending] = useActionState(wrappedAction, { ok: true });

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
