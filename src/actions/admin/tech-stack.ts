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
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "on" ? "true" : "false",
  });
}

function revalidateTechStackPaths() {
  revalidatePath("/admin/tech-stack");
  revalidatePath("/id");
  revalidatePath("/en");
}

export async function createTechStackItem(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requirePermission("tech_stack.manage");
  try {
    const data = parse(formData);
    await prisma.techStackItem.create({ data });
    revalidateTechStackPaths();
    redirect("/admin/tech-stack");
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Gagal menyimpan");
  }
}

export async function updateTechStackItem(
  id: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requirePermission("tech_stack.manage");
  try {
    const data = parse(formData);
    await prisma.techStackItem.update({ where: { id }, data });
    revalidateTechStackPaths();
    redirect("/admin/tech-stack");
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Gagal menyimpan");
  }
}

export async function deleteTechStackItem(id: string) {
  await requirePermission("tech_stack.manage");
  await prisma.techStackItem.delete({ where: { id } });
  revalidateTechStackPaths();
  redirect("/admin/tech-stack");
}
