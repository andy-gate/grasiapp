import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/db";
import { publishedWhere, pickLocaleField } from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { MapPin, HeartHandshake } from "lucide-react";

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
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="marketing-page-title">{t("title")}</h1>
      {projects.length === 0 ? (
        <p className="mt-6 marketing-muted">{t("empty")}</p>
      ) : (
        <div className="mt-8 flex flex-col gap-6">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/charity/${p.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-(--m-border) bg-(--m-card) backdrop-blur transition-all hover:border-brand-blue/40 hover:shadow-xl hover:shadow-brand-blue/10 sm:flex-row"
            >
              {p.screenshotUrl && (
                <div className="aspect-video w-full shrink-0 overflow-hidden bg-(--m-media-bg) sm:w-72 sm:self-stretch md:w-80">
                  <Image
                    src={p.screenshotUrl}
                    alt={pickLocaleField(p, "title", loc)}
                    width={960}
                    height={540}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col justify-center p-6">
                <div className="flex flex-wrap gap-2">
                  {p.beneficiary && (
                    <Badge
                      variant="outline"
                      className="border-brand-blue/30 text-(--m-accent)"
                    >
                      <HeartHandshake className="size-3" />
                      {p.beneficiary}
                    </Badge>
                  )}
                  {p.location && (
                    <Badge
                      variant="outline"
                      className="border-(--m-border-strong) text-(--m-muted)"
                    >
                      <MapPin className="size-3" />
                      {p.location}
                    </Badge>
                  )}
                </div>
                <h2 className="mt-3 text-xl font-semibold text-(--m-strong) group-hover:text-(--m-accent)">
                  {pickLocaleField(p, "title", loc)}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm marketing-muted">
                  {pickLocaleField(p, "summary", loc)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
