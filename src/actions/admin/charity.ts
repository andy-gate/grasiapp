"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
  summaryId: z.string().optional(),
  summaryEn: z.string().optional(),
  bodyId: z.string().optional(),
  bodyEn: z.string().optional(),
  beneficiary: z.string().optional(),
  location: z.string().optional(),
  donationUrl: z.string().optional(),
  goalAmount: z.coerce.number().optional().nullable(),
  raisedAmount: z.coerce.number().optional().nullable(),
  status: z.nativeEnum(PublishStatus),
  featured: z.boolean(),
  sortOrder: z.coerce.number().int().default(0),
});

function parse(formData: FormData, userId: string) {
  const titleId = String(formData.get("titleId") ?? "").trim();
  return {
    ...schema.parse({
      slug: String(formData.get("slug") ?? "").trim() || slugify(titleId),
      titleId,
      titleEn: String(formData.get("titleEn") ?? "").trim(),
      summaryId: String(formData.get("summaryId") ?? "").trim() || undefined,
      summaryEn: String(formData.get("summaryEn") ?? "").trim() || undefined,
      bodyId: String(formData.get("bodyId") ?? "").trim() || undefined,
      bodyEn: String(formData.get("bodyEn") ?? "").trim() || undefined,
      beneficiary: String(formData.get("beneficiary") ?? "").trim() || undefined,
      location: String(formData.get("location") ?? "").trim() || undefined,
      donationUrl: String(formData.get("donationUrl") ?? "").trim() || undefined,
      goalAmount: formData.get("goalAmount") || null,
      raisedAmount: formData.get("raisedAmount") || null,
      status: formData.get("status"),
      featured: formData.get("featured") === "on",
      sortOrder: formData.get("sortOrder"),
    }),
    publishedAt:
      formData.get("status") === "PUBLISHED" ? new Date() : null,
    createdById: userId,
  };
}

export async function createCharityProject(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requirePermission("charity.manage");
  try {
    const { publishedAt, createdById, ...data } = parse(
      formData,
      session.user.id,
    );
    await prisma.charityProject.create({
      data: { ...data, publishedAt, createdById },
    });
    revalidatePath("/admin/charity");
    revalidatePath("/id/charity");
    revalidatePath("/en/charity");
    redirect("/admin/charity");
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Gagal menyimpan");
  }
}

export async function updateCharityProject(
  id: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requirePermission("charity.manage");
  try {
    const { publishedAt, createdById, ...data } = parse(
      formData,
      session.user.id,
    );
    await prisma.charityProject.update({
      where: { id },
      data: {
        ...data,
        publishedAt:
          data.status === "PUBLISHED" ? publishedAt ?? new Date() : null,
      },
    });
    revalidatePath("/admin/charity");
    revalidatePath("/id/charity");
    revalidatePath("/en/charity");
    redirect("/admin/charity");
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Gagal menyimpan");
  }
}

export async function deleteCharityProject(id: string) {
  await requirePermission("charity.manage");
  await prisma.charityProject.delete({ where: { id } });
  revalidatePath("/admin/charity");
  redirect("/admin/charity");
}
