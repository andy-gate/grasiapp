"use server";

import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/admin-auth";
import { slugify } from "@/lib/slug";
import { fail, type ActionResult } from "@/lib/action-result";

const schema = z.object({
  code: z.string().min(1),
  nameId: z.string().min(1),
  nameEn: z.string().min(1),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.enum(["true", "false"]).transform((v) => v === "true"),
});

function parse(formData: FormData) {
  const nameId = String(formData.get("nameId") ?? "").trim();
  return schema.parse({
    code: String(formData.get("code") ?? "").trim() || slugify(nameId),
    nameId,
    nameEn: String(formData.get("nameEn") ?? "").trim(),
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "on" ? "true" : "false",
  });
}

function revalidateLanguagePaths() {
  revalidatePath("/admin/languages");
  revalidatePath("/id/translator");
  revalidatePath("/en/translator");
}

export async function createLanguage(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requirePermission("translator.manage");
  try {
    await prisma.language.create({ data: parse(formData) });
    revalidateLanguagePaths();
    redirect("/admin/languages");
  } catch (e) {
    unstable_rethrow(e);
    return fail(e instanceof Error ? e.message : "Gagal menyimpan");
  }
}

export async function updateLanguage(
  id: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requirePermission("translator.manage");
  try {
    await prisma.language.update({ where: { id }, data: parse(formData) });
    revalidateLanguagePaths();
    redirect("/admin/languages");
  } catch (e) {
    unstable_rethrow(e);
    return fail(e instanceof Error ? e.message : "Gagal menyimpan");
  }
}

export async function deleteLanguage(id: string) {
  await requirePermission("translator.manage");
  await prisma.language.delete({ where: { id } });
  revalidateLanguagePaths();
  redirect("/admin/languages");
}
