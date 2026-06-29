import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { publishedWhere } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://grasiapp.com";

  // Rute static multibahasa
  const locales = ["id", "en"];
  const staticPaths = ["", "/about", "/it", "/charity", "/translator", "/contact"];

  const staticEntries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const path of staticPaths) {
      staticEntries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: path === "" ? 1.0 : 0.8,
      });
    }
  }

  // Proyek IT dari DB
  const itProjects = await prisma.itProject.findMany({
    where: publishedWhere(),
    select: { slug: true, updatedAt: true },
  });
  const itEntries = itProjects.flatMap((p) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/it/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  );

  // Charity Projects dari DB
  const charityProjects = await prisma.charityProject.findMany({
    where: publishedWhere(),
    select: { slug: true, updatedAt: true },
  });
  const charityEntries = charityProjects.flatMap((p) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/charity/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  );

  // Translator Services dari DB
  const translatorServices = await prisma.translatorService.findMany({
    where: publishedWhere(),
    select: { slug: true, publishedAt: true },
  });
  const translatorEntries = translatorServices.flatMap((s) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/translator/${s.slug}`,
      lastModified: s.publishedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  );

  // Bio public pages dari DB
  const bioPages = await prisma.bioPage.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });
  const bioEntries = bioPages.map((b) => ({
    url: `${baseUrl}/u/${b.slug}`,
    lastModified: b.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [
    ...staticEntries,
    ...itEntries,
    ...charityEntries,
    ...translatorEntries,
    ...bioEntries,
  ];
}
