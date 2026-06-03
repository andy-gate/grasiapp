"use server";

import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/admin-auth";
import { fail, type ActionResult } from "@/lib/action-result";
import { isValidUsername, normalizeUsername } from "@/lib/username";

const usernameSchema = z
  .string()
  .min(3, "Username minimal 3 karakter")
  .max(32, "Username maksimal 32 karakter")
  .transform(normalizeUsername)
  .refine(isValidUsername, "Username hanya huruf kecil, angka, dan underscore");

const createSchema = z.object({
  email: z.string().email(),
  username: usernameSchema,
  name: z.string().min(2),
  password: z.string().min(6),
  isActive: z.boolean(),
  roleIds: z.array(z.string()),
});

const updateSchema = z.object({
  email: z.string().email(),
  username: usernameSchema,
  name: z.string().min(2),
  password: z.string().optional(),
  isActive: z.boolean(),
  roleIds: z.array(z.string()),
});

function parseRoles(formData: FormData) {
  return formData.getAll("roleIds").map(String);
}

export async function createUser(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requirePermission("user.manage");
  try {
    const data = createSchema.parse({
      email: String(formData.get("email") ?? "").trim(),
      username: String(formData.get("username") ?? "").trim(),
      name: String(formData.get("name") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
      isActive: formData.get("isActive") === "on",
      roleIds: parseRoles(formData),
    });
    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        name: data.name,
        passwordHash,
        isActive: data.isActive,
      },
    });
    if (data.roleIds.length > 0) {
      await prisma.userRole.createMany({
        data: data.roleIds.map((roleId) => ({ userId: user.id, roleId })),
      });
    }
    revalidatePath("/admin/users");
    redirect("/admin/users");
  } catch (e) {
    unstable_rethrow(e);
    return fail(e instanceof Error ? e.message : "Gagal menyimpan");
  }
}

export async function updateUser(
  id: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requirePermission("user.manage");
  try {
    const data = updateSchema.parse({
      email: String(formData.get("email") ?? "").trim(),
      username: String(formData.get("username") ?? "").trim(),
      name: String(formData.get("name") ?? "").trim(),
      password: String(formData.get("password") ?? "").trim() || undefined,
      isActive: formData.get("isActive") === "on",
      roleIds: parseRoles(formData),
    });
    const passwordHash = data.password
      ? await bcrypt.hash(data.password, 12)
      : undefined;
    await prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        username: data.username,
        name: data.name,
        isActive: data.isActive,
        ...(passwordHash ? { passwordHash } : {}),
      },
    });
    await prisma.userRole.deleteMany({ where: { userId: id } });
    if (data.roleIds.length > 0) {
      await prisma.userRole.createMany({
        data: data.roleIds.map((roleId) => ({ userId: id, roleId })),
      });
    }
    revalidatePath("/admin/users");
    redirect("/admin/users");
  } catch (e) {
    unstable_rethrow(e);
    return fail(e instanceof Error ? e.message : "Gagal menyimpan");
  }
}

export async function deleteUser(id: string) {
  await requirePermission("user.manage");
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
  redirect("/admin/users");
}
