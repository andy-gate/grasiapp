import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/db";
import { publishedWhere, pickLocaleField } from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { HeartHandshake, MapPin } from "lucide-react";
import { CharityGallery } from "@/components/marketing/charity-gallery";

export default async function CharityDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations("charity");

  const project = await prisma.charityProject.findFirst({
    where: { slug, ...publishedWhere() },
  });
  if (!project) notFound();

  const otherPrograms = await prisma.charityProject.findMany({
    where: { ...publishedWhere(), id: { not: project.id } },
    orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
    take: 4,
  });

  const galleryImages =
    (project.galleryUrls ?? []).length > 0
      ? (project.galleryUrls ?? [])
      : project.screenshotUrl
        ? [project.screenshotUrl]
        : [];

  const hasInfoCard = !!project.beneficiary || !!project.location;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="border-brand-blue/30 bg-brand-blue/20 text-(--m-accent)">
          {t("title")}
        </Badge>
        {project.location && (
          <Badge variant="outline" className="border-(--m-border-strong) text-(--m-muted)">
            <MapPin className="size-3" />
            {project.location}
          </Badge>
        )}
      </div>
      <h1 className="marketing-page-title mt-4">
        {pickLocaleField(project, "title", loc)}
      </h1>
      {pickLocaleField(project, "summary", loc) && (
        <p className="mt-3 max-w-3xl text-lg marketing-muted">
          {pickLocaleField(project, "summary", loc)}
        </p>
      )}

      {galleryImages.length > 0 && (
        <div className="mt-8">
          <CharityGallery
            images={galleryImages}
            altBase={pickLocaleField(project, "title", loc)}
          />
        </div>
      )}

      <div
        className={cn(
          "mt-10 grid gap-10",
          hasInfoCard && "lg:grid-cols-[1fr_320px]",
        )}
      >
        <article
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{
            __html: pickLocaleField(project, "body", loc),
          }}
        />

        {hasInfoCard && (
          <aside className="lg:sticky lg:top-24 h-fit rounded-xl border border-(--m-border) bg-(--m-card) p-6 backdrop-blur">
            <div className="space-y-4">
              {project.beneficiary && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-(--m-accent)">
                    {t("beneficiary")}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-(--m-strong)">
                    <HeartHandshake className="size-4 text-(--m-accent)" />
                    {project.beneficiary}
                  </p>
                </div>
              )}
              {project.location && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-(--m-accent)">
                    {t("location")}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-(--m-strong)">
                    <MapPin className="size-4 text-(--m-accent)" />
                    {project.location}
                  </p>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {otherPrograms.length > 0 && (
        <section className="mt-16 border-t border-(--m-border) pt-10">
          <h2 className="text-xl font-semibold text-(--m-strong)">
            {t("otherPrograms")}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {otherPrograms.map((p) => (
              <Link
                key={p.id}
                href={`/charity/${p.slug}`}
                className="group flex items-center gap-4 rounded-xl border border-(--m-border) bg-(--m-card) p-4 backdrop-blur transition-all hover:border-brand-blue/40"
              >
                {p.screenshotUrl ? (
                  <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-(--m-border) bg-(--m-media-bg)">
                    <Image
                      src={p.screenshotUrl}
                      alt={pickLocaleField(p, "title", loc)}
                      width={240}
                      height={160}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg border border-(--m-border) bg-(--m-media-bg)">
                    <HeartHandshake className="size-6 text-(--m-accent)" />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-(--m-strong) group-hover:text-(--m-accent)">
                    {pickLocaleField(p, "title", loc)}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs marketing-muted">
                    {pickLocaleField(p, "summary", loc)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
