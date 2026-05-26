import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/db";
import { publishedWhere, pickLocaleField } from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import { MarketingCard } from "@/components/marketing/marketing-card";

export default async function TranslatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("translator");
  const loc = locale as Locale;

  const [overview, services] = await Promise.all([
    prisma.page.findFirst({
      where: { slug: "translator-overview", ...publishedWhere() },
    }),
    prisma.translatorService.findMany({
      where: publishedWhere(),
      orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="marketing-page-title">{t("title")}</h1>
      {overview && (
        <div
          className="prose prose-invert mt-4 max-w-none"
          dangerouslySetInnerHTML={{
            __html: pickLocaleField(overview, "body", loc),
          }}
        />
      )}
      {services.length === 0 ? (
        <p className="mt-8 marketing-muted">{t("empty")}</p>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <MarketingCard key={s.id}>
              <h2 className="text-lg font-semibold text-white">
                <Link href={`/translator/${s.slug}`} className="marketing-link">
                  {pickLocaleField(s, "name", loc)}
                </Link>
              </h2>
              <p className="mt-2 text-sm marketing-muted">
                {pickLocaleField(s, "description", loc)}
              </p>
              <p className="mt-2 text-xs marketing-muted">
                {s.sourceLanguages.join(", ")} → {s.targetLanguages.join(", ")}
              </p>
            </MarketingCard>
          ))}
        </div>
      )}
    </div>
  );
}
