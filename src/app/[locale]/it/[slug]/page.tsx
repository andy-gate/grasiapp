import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
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

  const project = await prisma.itProject.findFirst({
    where: { slug, ...publishedWhere() },
    include: { category: true },
  });

  if (!project) notFound();

  const body = pickLocaleField(project, "body", loc);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Badge className="mb-4 border-brand-blue/30 bg-brand-blue/20 text-brand-blue-light">
        {pickLocaleField(project.category, "name", loc)}
      </Badge>
      <h1 className="marketing-page-title">
        {pickLocaleField(project, "title", loc)}
      </h1>
      {project.clientName && (
        <p className="mt-2 marketing-muted">Client: {project.clientName}</p>
      )}
      {project.year && (
        <p className="text-sm marketing-muted">{project.year}</p>
      )}
      <div
        className="prose prose-invert mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: body }}
      />
      <div className="mt-8 flex gap-4">
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="marketing-link underline"
          >
            Demo
          </a>
        )}
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="marketing-link underline"
          >
            Repository
          </a>
        )}
      </div>
    </article>
  );
}
