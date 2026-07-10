import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/db";
import { publishedWhere, pickLocaleField } from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const service = await prisma.translatorService.findFirst({
    where: { slug, ...publishedWhere() },
  });

  if (!service) {
    return { title: "Not Found" };
  }

  const title = pickLocaleField(service, "name", loc);
  const description = pickLocaleField(service, "description", loc) || undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function TranslatorServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const service = await prisma.translatorService.findFirst({
    where: { slug, ...publishedWhere() },
  });
  if (!service) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="marketing-page-title">
        {pickLocaleField(service, "name", loc)}
      </h1>
      <p className="mt-2 text-sm marketing-muted capitalize">
        {service.serviceType}
      </p>
      <p className="mt-2 marketing-muted">
        {service.sourceLanguages.join(", ")} → {service.targetLanguages.join(", ")}
      </p>
      <div
        className="prose prose-invert mt-8 max-w-none whitespace-pre-wrap"
        dangerouslySetInnerHTML={{
          __html: pickLocaleField(service, "description", loc),
        }}
      />
      {pickLocaleField(service, "pricingNote", loc) && (
        <p className="mt-6 rounded-xl border border-(--m-border) bg-(--m-soft) p-4 text-sm text-(--m-soft-text)">
          {pickLocaleField(service, "pricingNote", loc)}
        </p>
      )}
    </article>
  );
}
