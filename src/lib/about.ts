import { prisma } from "@/lib/db";

export type AboutValue = {
  titleId: string;
  titleEn: string;
  descId: string;
  descEn: string;
};

export type AboutSettings = {
  visionId?: string;
  visionEn?: string;
  missionId?: string;
  missionEn?: string;
  foundedYear?: number;
  values?: AboutValue[];
};

export async function getAboutSettings(): Promise<AboutSettings> {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: "about" },
  });
  return (setting?.value ?? {}) as AboutSettings;
}
