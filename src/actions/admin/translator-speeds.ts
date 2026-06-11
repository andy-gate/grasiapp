"use server";

import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/admin-auth";
import { fail, type ActionResult } from "@/lib/action-result";

const packageSchema = z.object({
  nameId: z.string().min(1, "Nama opsi (ID) wajib diisi"),
  nameEn: z.string().min(1, "Nama opsi (EN) wajib diisi"),
  multiplier: z.coerce.number().positive("Pengali harga harus > 0"),
  noteId: z.string().default(""),
  noteEn: z.string().default(""),
});

export async function updateTranslatorSpeeds(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requirePermission("translator.manage");
  try {
    const raw = String(formData.get("packagesJson") ?? "[]");
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("Data waktu pengerjaan tidak valid");
    }
    const packages = z.array(packageSchema).parse(parsed);
    await prisma.siteSetting.upsert({
      where: { key: "translatorSpeeds" },
      update: { value: { packages } },
      create: { key: "translatorSpeeds", value: { packages } },
    });
    revalidatePath("/admin/turnaround");
    revalidatePath("/id/translator");
    revalidatePath("/en/translator");
    redirect("/admin/turnaround");
  } catch (e) {
    unstable_rethrow(e);
    return fail(e instanceof Error ? e.message : "Gagal menyimpan");
  }
}
