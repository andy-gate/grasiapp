import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { publishedWhere, pickLocaleField } from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { MarketingCard } from "@/components/marketing/marketing-card";
import { cn } from "@/lib/utils";

export default async function ItProjectsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category: categorySlug } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("it");
  const tc = await getTranslations("common");
  const loc = locale as Locale;

  const categories = await prisma.itCategory.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const projects = await prisma.itProject.findMany({
    where: {
      ...publishedWhere(),
      ...(categorySlug
        ? { categories: { some: { slug: categorySlug, isActive: true } } }
        : {}),
    },
    include: { categories: true },
    orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="marketing-page-title">{t("title")}</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/it"
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm transition-colors",
            !categorySlug
              ? "border-brand-blue/50 bg-brand-blue/20 text-brand-blue-light"
              : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white",
          )}
        >
          {tc("all")}
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/it?category=${cat.slug}`}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              categorySlug === cat.slug
                ? "border-brand-blue/50 bg-brand-blue/20 text-brand-blue-light"
                : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white",
            )}
          >
            {pickLocaleField(cat, "name", loc)}
          </Link>
        ))}
      </div>

      <div className="mt-8">
        {projects.length === 0 ? (
          <p className="marketing-muted">{t("empty")}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <MarketingCard key={p.id}>
                {p.screenshotUrl && (
                  <div className="mb-4 aspect-video overflow-hidden rounded-lg border border-white/10 bg-black/20">
                    <Image
                      src={p.screenshotUrl}
                      alt={pickLocaleField(p, "title", loc)}
                      width={960}
                      height={540}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {p.categories.map((cat) => (
                    <Badge
                      key={cat.id}
                      variant="outline"
                      className="border-brand-blue/30 text-brand-blue-light"
                    >
                      {pickLocaleField(cat, "name", loc)}
                    </Badge>
                  ))}
                </div>
                <h2 className="mt-3 text-lg font-semibold text-white">
                  <Link href={`/it/${p.slug}`} className="marketing-link">
                    {pickLocaleField(p, "title", loc)}
                  </Link>
                </h2>
                <p className="mt-2 text-sm marketing-muted">
                  {pickLocaleField(p, "summary", loc)}
                </p>
              </MarketingCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
