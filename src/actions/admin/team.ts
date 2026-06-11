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

const schema = z.object({
  name: z.string().min(1),
  roleId: z.string().min(1),
  roleEn: z.string().min(1),
  photoUrl: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.enum(["true", "false"]).transform((v) => v === "true"),
});

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "team");
const ALLOWED_PHOTO_TYPES = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
]);
const MAX_PHOTO_BYTES = 2 * 1024 * 1024;

async function saveUploadedPhoto(
  formData: FormData,
): Promise<string | undefined> {
  const file = formData.get("photoFile");
  if (!(file instanceof File) || file.size === 0) return undefined;
  const ext = ALLOWED_PHOTO_TYPES.get(file.type);
  if (!ext) throw new Error("Format foto harus PNG, JPG, atau WEBP");
  if (file.size > MAX_PHOTO_BYTES) throw new Error("Ukuran foto maksimal 2MB");
  await mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${randomUUID()}.${ext}`;
  await writeFile(
    path.join(UPLOAD_DIR, filename),
    Buffer.from(await file.arrayBuffer()),
  );
  return `/uploads/team/${filename}`;
}

function parse(formData: FormData) {
  return schema.parse({
    name: String(formData.get("name") ?? "").trim(),
    roleId: String(formData.get("roleId") ?? "").trim(),
    roleEn: String(formData.get("roleEn") ?? "").trim(),
    photoUrl: String(formData.get("photoUrl") ?? "").trim() || undefined,
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "on" ? "true" : "false",
  });
}

function revalidateTeamPaths() {
  revalidatePath("/admin/team");
  revalidatePath("/id/about");
  revalidatePath("/en/about");
}

export async function createTeamMember(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requirePermission("about.manage");
  try {
    const data = parse(formData);
    const uploaded = await saveUploadedPhoto(formData);
    if (uploaded) data.photoUrl = uploaded;
    await prisma.teamMember.create({ data });
    revalidateTeamPaths();
    redirect("/admin/team");
  } catch (e) {
    unstable_rethrow(e);
    return fail(e instanceof Error ? e.message : "Gagal menyimpan");
  }
}

export async function updateTeamMember(
  id: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requirePermission("about.manage");
  try {
    const data = parse(formData);
    const uploaded = await saveUploadedPhoto(formData);
    if (uploaded) data.photoUrl = uploaded;
    await prisma.teamMember.update({ where: { id }, data });
    revalidateTeamPaths();
    redirect("/admin/team");
  } catch (e) {
    unstable_rethrow(e);
    return fail(e instanceof Error ? e.message : "Gagal menyimpan");
  }
}

export async function deleteTeamMember(id: string) {
  await requirePermission("about.manage");
  await prisma.teamMember.delete({ where: { id } });
  revalidateTeamPaths();
  redirect("/admin/team");
}
