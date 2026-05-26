import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/db";
import { publishedWhere, pickLocaleField } from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import { MarketingCard } from "@/components/marketing/marketing-card";

export default async function CharityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("charity");
  const loc = locale as Locale;

  const projects = await prisma.charityProject.findMany({
    where: publishedWhere(),
    orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="marketing-page-title">{t("title")}</h1>
      {projects.length === 0 ? (
        <p className="mt-6 marketing-muted">{t("empty")}</p>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <MarketingCard key={p.id}>
              <h2 className="text-lg font-semibold text-white">
                <Link href={`/charity/${p.slug}`} className="marketing-link">
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
  );
}
