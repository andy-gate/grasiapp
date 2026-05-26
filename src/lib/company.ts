import { prisma } from "@/lib/db";

export type CompanySettings = {
  nameId?: string;
  nameEn?: string;
  email?: string;
  phone?: string;
  waNumber?: string;
  addressId?: string;
  addressEn?: string;
};

export async function getCompanySettings(): Promise<CompanySettings> {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: "company" },
  });
  return (setting?.value ?? {}) as CompanySettings;
}

export function getWhatsAppLink(waNumber?: string) {
  if (!waNumber) return null;
  const digits = waNumber.replace(/\D/g, "");
  if (!digits) return null;
  const normalized = digits.startsWith("0")
    ? `62${digits.slice(1)}`
    : digits;
  return `https://wa.me/${normalized}`;
}
