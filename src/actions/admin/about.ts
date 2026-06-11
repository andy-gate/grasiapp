"use server";

import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/admin-auth";
import { fail, type ActionResult } from "@/lib/action-result";

const valueSchema = z.object({
  titleId: z.string().min(1),
  titleEn: z.string().min(1),
  descId: z.string().default(""),
  descEn: z.string().default(""),
});

const schema = z.object({
  visionId: z.string().optional(),
  visionEn: z.string().optional(),
  missionId: z.string().optional(),
  missionEn: z.string().optional(),
  foundedYear: z.coerce
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear())
    .optional(),
  values: z.array(valueSchema).default([]),
});

function parseJsonField(formData: FormData, name: string): unknown {
  const raw = String(formData.get(name) ?? "[]");
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`Data ${name} tidak valid`);
  }
}

export async function updateAboutSettings(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requirePermission("about.manage");
  try {
    const value = schema.parse({
      visionId: String(formData.get("visionId") ?? "").trim() || undefined,
      visionEn: String(formData.get("visionEn") ?? "").trim() || undefined,
      missionId: String(formData.get("missionId") ?? "").trim() || undefined,
      missionEn: String(formData.get("missionEn") ?? "").trim() || undefined,
      foundedYear:
        String(formData.get("foundedYear") ?? "").trim() || undefined,
      values: parseJsonField(formData, "valuesJson"),
    });
    await prisma.siteSetting.upsert({
      where: { key: "about" },
      update: { value },
      create: { key: "about", value },
    });
    revalidatePath("/admin/about");
    revalidatePath("/id/about");
    revalidatePath("/en/about");
    redirect("/admin/about");
  } catch (e) {
    unstable_rethrow(e);
    return fail(e instanceof Error ? e.message : "Gagal menyimpan");
  }
}
