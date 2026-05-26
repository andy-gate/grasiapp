import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/db";
import { publishedWhere, pickLocaleField } from "@/lib/content";
import type { Locale } from "@/i18n/routing";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const page = await prisma.page.findFirst({
    where: { slug: "about", ...publishedWhere() },
  });
  if (!page) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="marketing-page-title">
        {pickLocaleField(page, "title", loc)}
      </h1>
      <div
        className="prose prose-invert mt-8 max-w-none"
        dangerouslySetInnerHTML={{
          __html: pickLocaleField(page, "body", loc),
        }}
      />
    </article>
  );
}
