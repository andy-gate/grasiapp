"use server";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/admin-auth";
import { fail, type ActionResult } from "@/lib/action-result";
import { BackgroundType, PublishStatus } from "@/generated/prisma/client";
import { getUploadDir } from "@/lib/server-utils";

const UPLOAD_DIR = getUploadDir("bio");
const ALLOWED_IMAGE_TYPES = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);
const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2MB

async function saveUploadedImage(file: File, userId: string): Promise<string> {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const ext = ALLOWED_IMAGE_TYPES.get(file.type);
  if (!ext) {
    throw new Error("Format gambar harus PNG, JPG, WEBP, atau GIF");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Ukuran gambar maksimal adalah 2MB");
  }
  const filename = `${randomUUID()}.${ext}`;
  const filePath = path.join(UPLOAD_DIR, filename);
  await writeFile(filePath, Buffer.from(await file.arrayBuffer()));
  
  // Create a Media record in the database
  const media = await prisma.media.create({
    data: {
      filename: file.name,
      url: `/uploads/bio/${filename}`,
      mimeType: file.type,
      size: file.size,
      uploadedById: userId,
    },
  });

  return media.id;
}

const bioLinkSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Judul link wajib diisi"),
  url: z.string().url("URL harus berupa alamat web yang valid (contoh: https://...)"),
  isActive: z.boolean().default(true),
  openInNewTab: z.boolean().default(true),
});

const bioPageSchema = z.object({
  slug: z
    .string()
    .min(3, "Slug minimal 3 karakter")
    .regex(/^[a-z0-9-_]+$/, "Slug hanya boleh berisi huruf kecil, angka, dash (-), dan underscore (_)"),
  displayName: z.string().min(1, "Nama tampilan wajib diisi"),
  bio: z.string().optional().nullable(),
  status: z.nativeEnum(PublishStatus).default(PublishStatus.DRAFT),
  themePreset: z.string().optional().nullable(),
  backgroundType: z.nativeEnum(BackgroundType).default(BackgroundType.COLOR),
  backgroundValue: z.string().optional().nullable(),
  buttonStyle: z.string().optional().nullable(),
  buttonColor: z.string().optional().nullable(),
  textColor: z.string().optional().nullable(),
  fontFamily: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

export async function saveBioPage(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requirePermission("bio_page.access");
  const userId = session.user.id;

  try {
    const data = bioPageSchema.parse({
      slug: String(formData.get("slug") ?? "").trim().toLowerCase(),
      displayName: String(formData.get("displayName") ?? "").trim(),
      bio: String(formData.get("bio") ?? "").trim() || null,
      status: formData.get("status") || PublishStatus.DRAFT,
      themePreset: String(formData.get("themePreset") ?? "").trim() || null,
      backgroundType: formData.get("backgroundType") || BackgroundType.COLOR,
      backgroundValue: String(formData.get("backgroundValue") ?? "").trim() || null,
      buttonStyle: String(formData.get("buttonStyle") ?? "").trim() || null,
      buttonColor: String(formData.get("buttonColor") ?? "").trim() || null,
      textColor: String(formData.get("textColor") ?? "").trim() || null,
      fontFamily: String(formData.get("fontFamily") ?? "").trim() || null,
      seoTitle: String(formData.get("seoTitle") ?? "").trim() || null,
      seoDescription: String(formData.get("seoDescription") ?? "").trim() || null,
    });

    // Check slug uniqueness
    const existingWithSlug = await prisma.bioPage.findFirst({
      where: {
        slug: data.slug,
        NOT: { userId },
      },
    });

    if (existingWithSlug) {
      return fail("URL Slug sudah digunakan oleh user lain. Silakan pilih slug lain.");
    }

    // Find if user already has a bio page
    const oldBio = await prisma.bioPage.findUnique({
      where: { userId },
    });

    let avatarMediaId = oldBio?.avatarMediaId || null;
    let backgroundMediaId = oldBio?.backgroundMediaId || null;

    // Handle delete requests
    const deleteAvatar = formData.get("deleteAvatar") === "true";
    const deleteBackground = formData.get("deleteBackground") === "true";

    if (deleteAvatar && oldBio?.avatarMediaId) {
      avatarMediaId = null;
      await prisma.media.delete({ where: { id: oldBio.avatarMediaId } }).catch(() => {});
    }

    if (deleteBackground && oldBio?.backgroundMediaId) {
      backgroundMediaId = null;
      await prisma.media.delete({ where: { id: oldBio.backgroundMediaId } }).catch(() => {});
    }

    // Handle file uploads
    const avatarFile = formData.get("avatarFile");
    if (avatarFile instanceof File && avatarFile.size > 0) {
      // Delete old if exists
      if (oldBio?.avatarMediaId) {
        await prisma.media.delete({ where: { id: oldBio.avatarMediaId } }).catch(() => {});
      }
      avatarMediaId = await saveUploadedImage(avatarFile, userId);
    }

    const backgroundFile = formData.get("backgroundFile");
    if (
      data.backgroundType === BackgroundType.IMAGE &&
      backgroundFile instanceof File &&
      backgroundFile.size > 0
    ) {
      // Delete old if exists
      if (oldBio?.backgroundMediaId) {
        await prisma.media.delete({ where: { id: oldBio.backgroundMediaId } }).catch(() => {});
      }
      backgroundMediaId = await saveUploadedImage(backgroundFile, userId);
    }

    // Parse links
    const rawLinks = String(formData.get("linksJson") ?? "[]");
    let parsedLinks: z.infer<typeof bioLinkSchema>[];
    try {
      parsedLinks = z.array(bioLinkSchema).parse(JSON.parse(rawLinks));
    } catch (e) {
      return fail("Format data links tidak valid.");
    }

    // Upsert Bio Page
    const bioPage = await prisma.bioPage.upsert({
      where: { userId },
      update: {
        ...data,
        avatarMediaId,
        backgroundMediaId,
        publishedAt: data.status === PublishStatus.PUBLISHED ? new Date() : null,
      },
      create: {
        ...data,
        userId,
        avatarMediaId,
        backgroundMediaId,
        publishedAt: data.status === PublishStatus.PUBLISHED ? new Date() : null,
      },
    });

    // Sync Links
    const existingLinks = await prisma.bioLink.findMany({
      where: { bioPageId: bioPage.id },
      select: { id: true },
    });
    const existingIds = existingLinks.map((l) => l.id);
    const submittedIds = parsedLinks.map((l) => l.id).filter(Boolean) as string[];
    const idsToDelete = existingIds.filter((id) => !submittedIds.includes(id));

    await prisma.$transaction([
      prisma.bioLink.deleteMany({
        where: { id: { in: idsToDelete } },
      }),
      ...parsedLinks.map((link, idx) => {
        if (link.id) {
          return prisma.bioLink.update({
            where: { id: link.id },
            data: {
              title: link.title,
              url: link.url,
              isActive: link.isActive,
              openInNewTab: link.openInNewTab,
              sortOrder: idx,
            },
          });
        } else {
          return prisma.bioLink.create({
            data: {
              bioPageId: bioPage.id,
              title: link.title,
              url: link.url,
              isActive: link.isActive,
              openInNewTab: link.openInNewTab,
              sortOrder: idx,
            },
          });
        }
      }),
    ]);

    revalidatePath("/admin/my-bio");
    revalidatePath(`/u/${data.slug}`);
    revalidatePath("/admin/bio-pages");
    
    // Redirect or return success
    return { ok: true };
  } catch (e) {
    unstable_rethrow(e);
    return fail(e instanceof Error ? e.message : "Gagal menyimpan halaman bio.");
  }
}

export async function deleteBioPage(id: string) {
  await requirePermission("bio_page.manage");
  
  // Find the bio page
  const bio = await prisma.bioPage.findUnique({
    where: { id },
  });
  if (!bio) return;

  // Delete associated media records (cascade handles filesystem, but let's clean database media rows)
  if (bio.avatarMediaId) {
    await prisma.media.delete({ where: { id: bio.avatarMediaId } }).catch(() => {});
  }
  if (bio.backgroundMediaId) {
    await prisma.media.delete({ where: { id: bio.backgroundMediaId } }).catch(() => {});
  }

  // Delete bio page (cascade deletes links)
  await prisma.bioPage.delete({
    where: { id },
  });

  revalidatePath("/admin/bio-pages");
}
