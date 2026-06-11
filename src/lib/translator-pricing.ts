import { prisma } from "@/lib/db";

export type SpeedPackage = {
  nameId: string;
  nameEn: string;
  multiplier: number;
  noteId?: string;
  noteEn?: string;
};

export type TranslatorSpeedSettings = {
  packages?: SpeedPackage[];
};

export async function getSpeedPackages(): Promise<SpeedPackage[]> {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: "translatorSpeeds" },
  });
  const value = (setting?.value ?? {}) as TranslatorSpeedSettings;
  return value.packages ?? [];
}
