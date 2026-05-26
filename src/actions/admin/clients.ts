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
  logoUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
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
    logoUrl: String(formData.get("logoUrl") ?? "").trim() || undefined,
    websiteUrl: String(formData.get("websiteUrl") ?? "").trim() || undefined,
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "on" ? "true" : "false",
  });
}

function revalidateClientPaths() {
  revalidatePath("/admin/clients");
  revalidatePath("/id");
  revalidatePath("/en");
}

export async function createClient(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requirePermission("client.manage");
  try {
    const data = parse(formData);
    await prisma.client.create({ data });
    revalidateClientPaths();
    redirect("/admin/clients");
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Gagal menyimpan");
  }
}

export async function updateClient(
  id: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requirePermission("client.manage");
  try {
    const data = parse(formData);
    await prisma.client.update({ where: { id }, data });
    revalidateClientPaths();
    redirect("/admin/clients");
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Gagal menyimpan");
  }
}

export async function deleteClient(id: string) {
  await requirePermission("client.manage");
  await prisma.client.delete({ where: { id } });
  revalidateClientPaths();
  redirect("/admin/clients");
}
