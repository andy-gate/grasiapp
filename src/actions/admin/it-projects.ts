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
  categoryIds: z.array(z.string()).min(1, "Pilih minimal satu kategori"),
  clientId: z.string().optional(),
  techStackIds: z.array(z.string()),
  websiteUrl: z.string().optional(),
  appStoreUrl: z.string().optional(),
  playStoreUrl: z.string().optional(),
  year: z.coerce.number().int().optional().nullable(),
  status: z.nativeEnum(PublishStatus),
  featured: z.boolean(),
  sortOrder: z.coerce.number().int().default(0),
});

function parse(formData: FormData, userId: string) {
  const titleId = String(formData.get("titleId") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const clientId = String(formData.get("clientId") ?? "").trim();
  const yearRaw = formData.get("year");
  const status = formData.get("status") as PublishStatus;
  const parsed = schema.parse({
    slug: slugInput || slugify(titleId),
    titleId,
    titleEn: String(formData.get("titleEn") ?? "").trim(),
    summaryId: String(formData.get("summaryId") ?? "").trim() || undefined,
    summaryEn: String(formData.get("summaryEn") ?? "").trim() || undefined,
    bodyId: String(formData.get("bodyId") ?? "").trim() || undefined,
    bodyEn: String(formData.get("bodyEn") ?? "").trim() || undefined,
    categoryIds: formData.getAll("categoryIds").map(String),
    clientId: clientId || undefined,
    techStackIds: formData.getAll("techStackIds").map(String),
    websiteUrl: String(formData.get("websiteUrl") ?? "").trim() || undefined,
    appStoreUrl: String(formData.get("appStoreUrl") ?? "").trim() || undefined,
    playStoreUrl: String(formData.get("playStoreUrl") ?? "").trim() || undefined,
    year: yearRaw ? Number(yearRaw) : null,
    status,
    featured: formData.get("featured") === "on",
    sortOrder: formData.get("sortOrder"),
  });
  const { categoryIds, techStackIds, clientId: parsedClientId, ...rest } =
    parsed;
  return {
    ...rest,
    clientId: parsedClientId ?? null,
    categoryConnect: categoryIds.map((id) => ({ id })),
    techStackConnect: techStackIds.map((id) => ({ id })),
    publishedAt: status === "PUBLISHED" ? new Date() : null,
    createdById: userId,
  };
}

export async function createItProject(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requirePermission("it_project.manage");
  try {
    const {
      categoryConnect,
      techStackConnect,
      publishedAt,
      createdById,
      clientId,
      ...data
    } = parse(formData, session.user.id);
    await prisma.itProject.create({
      data: {
        ...data,
        clientId,
        publishedAt,
        createdById,
        categories: { connect: categoryConnect },
        techStackItems: techStackConnect.length
          ? { connect: techStackConnect }
          : undefined,
      },
    });
    revalidatePath("/admin/it-projects");
    revalidatePath("/id");
    revalidatePath("/en");
    redirect("/admin/it-projects");
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Gagal menyimpan");
  }
}

export async function updateItProject(
  id: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requirePermission("it_project.manage");
  try {
    const {
      categoryConnect,
      techStackConnect,
      publishedAt,
      createdById,
      clientId,
      ...data
    } = parse(formData, session.user.id);
    await prisma.itProject.update({
      where: { id },
      data: {
        ...data,
        clientId,
        publishedAt:
          data.status === "PUBLISHED" ? publishedAt ?? new Date() : null,
        categories: { set: categoryConnect },
        techStackItems: { set: techStackConnect },
      },
    });
    revalidatePath("/admin/it-projects");
    revalidatePath("/id");
    revalidatePath("/en");
    redirect("/admin/it-projects");
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Gagal menyimpan");
  }
}

export async function deleteItProject(id: string) {
  await requirePermission("it_project.manage");
  await prisma.itProject.delete({ where: { id } });
  revalidatePath("/admin/it-projects");
  redirect("/admin/it-projects");
}
