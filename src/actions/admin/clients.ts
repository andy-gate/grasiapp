"use server";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
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

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "clients");
const ALLOWED_LOGO_TYPES = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/svg+xml", "svg"],
  ["image/webp", "webp"],
]);
const MAX_LOGO_BYTES = 2 * 1024 * 1024;

async function saveUploadedLogo(formData: FormData): Promise<string | undefined> {
  const file = formData.get("logoFile");
  if (!(file instanceof File) || file.size === 0) return undefined;
  const ext = ALLOWED_LOGO_TYPES.get(file.type);
  if (!ext) throw new Error("Format logo harus PNG, JPG, SVG, atau WEBP");
  if (file.size > MAX_LOGO_BYTES) throw new Error("Ukuran logo maksimal 2MB");
  await mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${randomUUID()}.${ext}`;
  await writeFile(
    path.join(UPLOAD_DIR, filename),
    Buffer.from(await file.arrayBuffer()),
  );
  return `/uploads/clients/${filename}`;
}

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
    const uploaded = await saveUploadedLogo(formData);
    if (uploaded) data.logoUrl = uploaded;
    await prisma.client.create({ data });
    revalidateClientPaths();
    redirect("/admin/clients");
  } catch (e) {
    unstable_rethrow(e);
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
    const uploaded = await saveUploadedLogo(formData);
    if (uploaded) data.logoUrl = uploaded;
    await prisma.client.update({ where: { id }, data });
    revalidateClientPaths();
    redirect("/admin/clients");
  } catch (e) {
    unstable_rethrow(e);
    return fail(e instanceof Error ? e.message : "Gagal menyimpan");
  }
}

export async function deleteClient(id: string) {
  await requirePermission("client.manage");
  await prisma.client.delete({ where: { id } });
  revalidateClientPaths();
  redirect("/admin/clients");
}
