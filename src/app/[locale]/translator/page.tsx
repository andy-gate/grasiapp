import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/db";
import { publishedWhere, pickLocaleField } from "@/lib/content";
import { getSpeedPackages } from "@/lib/translator-pricing";
import { getCompanySettings, getWhatsAppLink } from "@/lib/company";
import type { Locale } from "@/i18n/routing";
import { MarketingCard } from "@/components/marketing/marketing-card";
import { PriceCalculator } from "@/components/marketing/price-calculator";

export default async function TranslatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("translator");
  const loc = locale as Locale;

  const [overview, services, speedPackages, company] = await Promise.all([
    prisma.page.findFirst({
      where: { slug: "translator-overview", ...publishedWhere() },
    }),
    prisma.translatorService.findMany({
      where: publishedWhere(),
      orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
      include: {
        rates: {
          orderBy: { sortOrder: "asc" },
          include: { sourceLanguage: true, targetLanguage: true },
        },
      },
    }),
    getSpeedPackages(),
    getCompanySettings(),
  ]);

  const tr = (id?: string | null, en?: string | null) =>
    (loc === "id" ? id : en) ?? "";
  const calculatorServices = services
    .filter((s) => s.rates.length > 0)
    .map((s) => ({
      id: s.id,
      name: pickLocaleField(s, "name", loc),
      rates: s.rates.map((rate) => ({
        sourceLang: pickLocaleField(rate.sourceLanguage, "name", loc),
        targetLang: pickLocaleField(rate.targetLanguage, "name", loc),
        pricePerPage: Number(rate.pricePerPage),
      })),
    }));
  const calculatorSpeeds = speedPackages.map((pkg) => ({
    name: tr(pkg.nameId, pkg.nameEn),
    note: tr(pkg.noteId, pkg.noteEn) || undefined,
    multiplier: pkg.multiplier,
  }));
  const waLink = getWhatsAppLink(company.waNumber);

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
              <h2 className="text-lg font-semibold text-(--m-strong)">
                {pickLocaleField(s, "name", loc)}
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
      {calculatorServices.length > 0 && (
        <section className="mt-12">
          <PriceCalculator
            services={calculatorServices}
            speeds={calculatorSpeeds}
            waLink={waLink}
          />
        </section>
      )}
    </div>
  );
}
