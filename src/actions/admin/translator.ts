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
  nameId: z.string().min(1),
  nameEn: z.string().min(1),
  descriptionId: z.string().optional(),
  descriptionEn: z.string().optional(),
  sourceLanguages: z.string().min(1),
  targetLanguages: z.string().min(1),
  serviceType: z.string().min(1),
  pricingNoteId: z.string().optional(),
  pricingNoteEn: z.string().optional(),
  sampleUrl: z.string().optional(),
  status: z.nativeEnum(PublishStatus),
  featured: z.boolean(),
  sortOrder: z.coerce.number().int().default(0),
});

function parseLangs(value: string) {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parse(formData: FormData, userId: string) {
  const nameId = String(formData.get("nameId") ?? "").trim();
  const status = formData.get("status") as PublishStatus;
  const parsed = schema.parse({
    slug: String(formData.get("slug") ?? "").trim() || slugify(nameId),
    nameId,
    nameEn: String(formData.get("nameEn") ?? "").trim(),
    descriptionId: String(formData.get("descriptionId") ?? "").trim() || undefined,
    descriptionEn: String(formData.get("descriptionEn") ?? "").trim() || undefined,
    sourceLanguages: String(formData.get("sourceLanguages") ?? ""),
    targetLanguages: String(formData.get("targetLanguages") ?? ""),
    serviceType: String(formData.get("serviceType") ?? "document"),
    pricingNoteId: String(formData.get("pricingNoteId") ?? "").trim() || undefined,
    pricingNoteEn: String(formData.get("pricingNoteEn") ?? "").trim() || undefined,
    sampleUrl: String(formData.get("sampleUrl") ?? "").trim() || undefined,
    status,
    featured: formData.get("featured") === "on",
    sortOrder: formData.get("sortOrder"),
  });
  return {
    ...parsed,
    sourceLanguages: parseLangs(parsed.sourceLanguages),
    targetLanguages: parseLangs(parsed.targetLanguages),
    publishedAt: status === "PUBLISHED" ? new Date() : null,
    createdById: userId,
  };
}

export async function createTranslatorService(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requirePermission("translator.manage");
  try {
    const parsed = parse(formData, session.user.id);
    const { publishedAt, createdById, sourceLanguages, targetLanguages, ...rest } =
      parsed;
    await prisma.translatorService.create({
      data: {
        ...rest,
        sourceLanguages,
        targetLanguages,
        publishedAt,
        createdById,
      },
    });
    revalidatePath("/admin/translator");
    revalidatePath("/id/translator");
    revalidatePath("/en/translator");
    redirect("/admin/translator");
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Gagal menyimpan");
  }
}

export async function updateTranslatorService(
  id: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requirePermission("translator.manage");
  try {
    const parsed = parse(formData, session.user.id);
    const { publishedAt, createdById, sourceLanguages, targetLanguages, ...rest } =
      parsed;
    await prisma.translatorService.update({
      where: { id },
      data: {
        ...rest,
        sourceLanguages,
        targetLanguages,
        publishedAt:
          rest.status === "PUBLISHED" ? publishedAt ?? new Date() : null,
      },
    });
    revalidatePath("/admin/translator");
    revalidatePath("/id/translator");
    revalidatePath("/en/translator");
    redirect("/admin/translator");
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Gagal menyimpan");
  }
}

export async function deleteTranslatorService(id: string) {
  await requirePermission("translator.manage");
  await prisma.translatorService.delete({ where: { id } });
  revalidatePath("/admin/translator");
  redirect("/admin/translator");
}
