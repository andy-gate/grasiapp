import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/db";
import { publishedWhere, pickLocaleField } from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn, ensureAbsoluteUrl } from "@/lib/utils";
import { Globe } from "lucide-react";
import { ProjectGallerySlider } from "@/components/marketing/project-gallery-slider";
import { MarketingCard } from "@/components/marketing/marketing-card";

export default async function ItProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations("it");

  const project = await prisma.itProject.findFirst({
    where: { slug, ...publishedWhere() },
    include: { categories: true, client: true, techStackItems: true },
  });

  if (!project) notFound();

  const otherProjects = await prisma.itProject.findMany({
    where: { ...publishedWhere(), id: { not: project.id } },
    include: { categories: true },
    orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
    take: 3,
  });

  const body = pickLocaleField(project, "body", loc);
  const clientName = project.client
    ? pickLocaleField(project.client, "name", loc)
    : null;

  const storeBadges = [
    {
      href: project.appStoreUrl ? ensureAbsoluteUrl(project.appStoreUrl) : null,
      label: t("appStore"),
      src: "/badges/app-store-badge.svg",
      width: 120,
      height: 40,
      className: "h-12 w-auto",
    },
    {
      href: project.playStoreUrl ? ensureAbsoluteUrl(project.playStoreUrl) : null,
      label: t("playStore"),
      src: "/badges/google-play-badge.png",
      width: 646,
      height: 250,
      // Badge Google Play punya padding bawaan, jadi dibuat sedikit lebih tinggi agar sejajar
      className: "h-[70px] w-auto",
    },
  ].filter((badge) => !!badge.href);
  const galleryImages =
    (project.galleryUrls ?? []).length > 0
      ? (project.galleryUrls ?? [])
      : project.screenshotUrl
        ? [project.screenshotUrl]
        : [];

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-4 flex flex-wrap gap-2">
        {project.categories.map((cat) => (
          <Badge
            key={cat.id}
            className="border-brand-blue/30 bg-brand-blue/20 text-(--m-accent)"
          >
            {pickLocaleField(cat, "name", loc)}
          </Badge>
        ))}
      </div>
      <h1 className="marketing-page-title">
        {pickLocaleField(project, "title", loc)}
      </h1>
      {clientName && (
        <p className="mt-2 marketing-muted">Client: {clientName}</p>
      )}
      {project.techStackItems.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.techStackItems.map((item) => (
            <Badge
              key={item.id}
              variant="secondary"
              className="border-brand-blue/20 bg-brand-blue/10 font-mono text-(--m-accent)"
            >
              {pickLocaleField(item, "name", loc)}
            </Badge>
          ))}
        </div>
      )}
      {project.year && (
        <p className="text-sm marketing-muted">{project.year}</p>
      )}
      {galleryImages.length > 0 && (
        <div className="mt-6">
          <ProjectGallerySlider
            images={galleryImages}
            altBase={pickLocaleField(project, "title", loc)}
          />
        </div>
      )}
      <div
        className="prose prose-invert mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: body }}
      />
      {(project.websiteUrl || storeBadges.length > 0) && (
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {project.websiteUrl && (
            <a
              href={ensureAbsoluteUrl(project.websiteUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 border border-(--m-border) bg-(--m-soft) px-5 text-(--m-strong) backdrop-blur transition-colors hover:border-brand-blue/40 hover:bg-brand-blue/20 hover:text-(--m-accent)",
              )}
            >
              <Globe className="size-4" />
              {t("website")}
            </a>
          )}
          {storeBadges.map((badge) => (
            <a
              key={badge.label}
              href={badge.href!}
              target="_blank"
              rel="noopener noreferrer"
              title={badge.label}
              className="transition-opacity hover:opacity-80"
            >
              <Image
                src={badge.src}
                alt={badge.label}
                width={badge.width}
                height={badge.height}
                className={badge.className}
              />
            </a>
          ))}
        </div>
      )}

      {otherProjects.length > 0 && (
        <section className="mt-16 border-t border-(--m-border) pt-10">
          <h2 className="text-xl font-semibold text-(--m-strong)">
            {t("otherProjects")}
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherProjects.map((p) => (
              <MarketingCard key={p.id}>
                {p.screenshotUrl && (
                  <Link href={`/it/${p.slug}`} className="block">
                    <div className="mb-4 aspect-video overflow-hidden rounded-lg border border-(--m-border) bg-(--m-media-bg)">
                      <Image
                        src={p.screenshotUrl}
                        alt={pickLocaleField(p, "title", loc)}
                        width={960}
                        height={540}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </Link>
                )}
                <div className="flex flex-wrap gap-2">
                  {p.categories.map((cat) => (
                    <Badge
                      key={cat.id}
                      variant="outline"
                      className="border-brand-blue/30 text-(--m-accent)"
                    >
                      {pickLocaleField(cat, "name", loc)}
                    </Badge>
                  ))}
                </div>
                <h3 className="mt-3 text-base font-semibold text-(--m-strong)">
                  <Link href={`/it/${p.slug}`} className="marketing-link">
                    {pickLocaleField(p, "title", loc)}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-2 text-sm marketing-muted">
                  {pickLocaleField(p, "summary", loc)}
                </p>
              </MarketingCard>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
