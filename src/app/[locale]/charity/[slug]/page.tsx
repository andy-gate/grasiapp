import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/db";
import { publishedWhere, pickLocaleField } from "@/lib/content";
import type { Locale } from "@/i18n/routing";

export default async function CharityDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const project = await prisma.charityProject.findFirst({
    where: { slug, ...publishedWhere() },
  });
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="marketing-page-title">
        {pickLocaleField(project, "title", loc)}
      </h1>
      {project.beneficiary && (
        <p className="mt-2 marketing-muted">{project.beneficiary}</p>
      )}
      <div
        className="prose prose-invert mt-8 max-w-none"
        dangerouslySetInnerHTML={{
          __html: pickLocaleField(project, "body", loc),
        }}
      />
      {project.donationUrl && (
        <a
          href={project.donationUrl}
          className="mt-6 inline-block marketing-link underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Donasi
        </a>
      )}
    </article>
  );
}
