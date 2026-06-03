"use server";

import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/admin-auth";
import { slugify } from "@/lib/slug";
import { fail, type ActionResult } from "@/lib/action-result";
import { PublishStatus } from "@/generated/prisma/client";

const schema = z.object({
  slug: z.string().min(1),
  titleId: z.string().min(1),
  titleEn: z.string().min(1),
  bodyId: z.string().optional(),
  bodyEn: z.string().optional(),
  seoTitleId: z.string().optional(),
  seoTitleEn: z.string().optional(),
  seoDescId: z.string().optional(),
  seoDescEn: z.string().optional(),
  status: z.nativeEnum(PublishStatus),
});

function parse(formData: FormData, userId: string) {
  const titleId = String(formData.get("titleId") ?? "").trim();
  return {
    ...schema.parse({
      slug: String(formData.get("slug") ?? "").trim() || slugify(titleId),
      titleId,
      titleEn: String(formData.get("titleEn") ?? "").trim(),
      bodyId: String(formData.get("bodyId") ?? "").trim() || undefined,
      bodyEn: String(formData.get("bodyEn") ?? "").trim() || undefined,
      seoTitleId: String(formData.get("seoTitleId") ?? "").trim() || undefined,
      seoTitleEn: String(formData.get("seoTitleEn") ?? "").trim() || undefined,
      seoDescId: String(formData.get("seoDescId") ?? "").trim() || undefined,
      seoDescEn: String(formData.get("seoDescEn") ?? "").trim() || undefined,
      status: formData.get("status"),
    }),
    updatedById: userId,
  };
}

export async function createPage(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requirePermission("page.manage");
  try {
    const data = parse(formData, session.user.id);
    await prisma.page.create({ data });
    revalidatePath("/admin/pages");
    revalidatePath("/id");
    revalidatePath("/en");
    redirect("/admin/pages");
  } catch (e) {
    unstable_rethrow(e);
    return fail(e instanceof Error ? e.message : "Gagal menyimpan");
  }
}

export async function updatePage(
  id: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requirePermission("page.manage");
  try {
    const data = parse(formData, session.user.id);
    await prisma.page.update({ where: { id }, data });
    revalidatePath("/admin/pages");
    revalidatePath("/id");
    revalidatePath("/en");
    redirect("/admin/pages");
  } catch (e) {
    unstable_rethrow(e);
    return fail(e instanceof Error ? e.message : "Gagal menyimpan");
  }
}

export async function deletePage(id: string) {
  await requirePermission("page.manage");
  await prisma.page.delete({ where: { id } });
  revalidatePath("/admin/pages");
  redirect("/admin/pages");
}
