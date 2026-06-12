"use server";

import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/admin-auth";
import { fail, type ActionResult } from "@/lib/action-result";

const urlOrEmpty = z
  .string()
  .trim()
  .refine((v) => v === "" || /^https?:\/\//.test(v), {
    message: "URL harus diawali http:// atau https://",
  });

const schema = z.object({
  nameId: z.string().min(1),
  nameEn: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  waNumber: z.string().optional(),
  addressId: z.string().optional(),
  addressEn: z.string().optional(),
  hoursId: z.string().optional(),
  hoursEn: z.string().optional(),
  socials: z.object({
    facebook: urlOrEmpty,
    instagram: urlOrEmpty,
    linkedin: urlOrEmpty,
    youtube: urlOrEmpty,
    x: urlOrEmpty,
    tiktok: urlOrEmpty,
  }),
});

const str = (formData: FormData, name: string) =>
  String(formData.get(name) ?? "").trim();

export async function updateCompanySettings(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requirePermission("setting.manage");
  try {
    const value = schema.parse({
      nameId: str(formData, "nameId"),
      nameEn: str(formData, "nameEn"),
      email: str(formData, "email") || undefined,
      phone: str(formData, "phone") || undefined,
      waNumber: str(formData, "waNumber") || undefined,
      addressId: str(formData, "addressId") || undefined,
      addressEn: str(formData, "addressEn") || undefined,
      hoursId: str(formData, "hoursId") || undefined,
      hoursEn: str(formData, "hoursEn") || undefined,
      socials: {
        facebook: str(formData, "facebook"),
        instagram: str(formData, "instagram"),
        linkedin: str(formData, "linkedin"),
        youtube: str(formData, "youtube"),
        x: str(formData, "x"),
        tiktok: str(formData, "tiktok"),
      },
    });
    await prisma.siteSetting.upsert({
      where: { key: "company" },
      update: { value },
      create: { key: "company", value },
    });
    revalidatePath("/admin/settings");
    revalidatePath("/id/contact");
    revalidatePath("/en/contact");
    revalidatePath("/id");
    revalidatePath("/en");
    redirect("/admin/settings");
  } catch (e) {
    unstable_rethrow(e);
    return fail(e instanceof Error ? e.message : "Gagal menyimpan");
  }
}
