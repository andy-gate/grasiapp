"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
  locale: z.enum(["id", "en"]),
});

export async function submitContactForm(
  _prev: { ok: boolean; error?: string },
  formData: FormData,
) {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    message: formData.get("message"),
    locale: formData.get("locale"),
  });

  if (!parsed.success) {
    return { ok: false, error: "invalid" };
  }

  await prisma.contactMessage.create({ data: parsed.data });
  return { ok: true };
}
