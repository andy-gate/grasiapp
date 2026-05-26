"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/admin-auth";

export async function markMessageRead(id: string) {
  const session = await requirePermission("contact.read");
  await prisma.contactMessage.update({
    where: { id },
    data: { readAt: new Date(), readById: session.user.id },
  });
  revalidatePath("/admin/messages");
}
