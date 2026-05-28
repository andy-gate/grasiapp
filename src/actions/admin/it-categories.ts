"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/admin-auth";
import { slugify } from "@/lib/slug";
import { fail, type ActionResult } from "@/lib/action-result";

const schema = z.object({
  slug: z.string().min(1),
  nameId: z.string().min(1),
  nameEn: z.string().min(1),
  descriptionId: z.string().optional(),
  descriptionEn: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.enum(["true", "false"]).transform((v) => v === "true"),
});

function parse(formData: FormData) {
  const slugInput = String(formData.get("slug") ?? "").trim();
  const nameId = String(formData.get("nameId") ?? "").trim();
  return schema.parse({
    slug: slugInput || slugify(nameId),
    nameId,
    nameEn: String(formData.get("nameEn") ?? "").trim(),
    descriptionId: String(formData.get("descriptionId") ?? "").trim() || undefined,
    descriptionEn: String(formData.get("descriptionEn") ?? "").trim() || undefined,
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "on" ? "true" : "false",
  });
}

export async function createItCategory(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requirePermission("it_category.manage");
  try {
    const data = parse(formData);
    await prisma.itCategory.create({ data });
    revalidatePath("/admin/it-categories");
    revalidatePath("/id/it");
    revalidatePath("/en/it");
    redirect("/admin/it-categories");
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Gagal menyimpan");
  }
}

export async function updateItCategory(
  id: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requirePermission("it_category.manage");
  try {
    const data = parse(formData);
    await prisma.itCategory.update({ where: { id }, data });
    revalidatePath("/admin/it-categories");
    revalidatePath("/id/it");
    revalidatePath("/en/it");
    redirect("/admin/it-categories");
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Gagal menyimpan");
  }
}

export async function deleteItCategory(id: string) {
  await requirePermission("it_category.manage");
  const count = await prisma.itProject.count({
    where: { categories: { some: { id } } },
  });
  if (count > 0) {
    throw new Error(`Kategori masih dipakai ${count} proyek`);
  }
  await prisma.itCategory.delete({ where: { id } });
  revalidatePath("/admin/it-categories");
  redirect("/admin/it-categories");
}
