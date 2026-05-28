import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/db";
import { publishedWhere, pickLocaleField } from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";

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

  const body = pickLocaleField(project, "body", loc);
  const clientName = project.client
    ? pickLocaleField(project.client, "name", loc)
    : null;

  const links = [
    { href: project.websiteUrl, label: t("website") },
    { href: project.appStoreUrl, label: t("appStore") },
    { href: project.playStoreUrl, label: t("playStore") },
  ].filter((link): link is { href: string; label: string } => !!link.href);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-4 flex flex-wrap gap-2">
        {project.categories.map((cat) => (
          <Badge
            key={cat.id}
            className="border-brand-blue/30 bg-brand-blue/20 text-brand-blue-light"
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
              className="border-brand-blue/20 bg-brand-blue/10 font-mono text-brand-blue-light"
            >
              {pickLocaleField(item, "name", loc)}
            </Badge>
          ))}
        </div>
      )}
      {project.year && (
        <p className="text-sm marketing-muted">{project.year}</p>
      )}
      <div
        className="prose prose-invert mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: body }}
      />
      {links.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="marketing-link underline"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
