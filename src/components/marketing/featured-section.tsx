import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { publishedWhere, pickLocaleField } from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import { SectionHeading } from "./section-heading";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FolderCode } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "./motion/reveal";

export async function FeaturedSection({ locale }: { locale: Locale }) {
  const t = await getTranslations("home");
  const tc = await getTranslations("common");

  const itProjects = await prisma.itProject.findMany({
    where: { ...publishedWhere(), featured: true },
    take: 3,
    include: { categories: true },
    orderBy: { sortOrder: "asc" },
  });

  if (itProjects.length === 0) return null;

  return (
    <section className="border-y border-(--m-divider) bg-(--m-surface) px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            badge={t("portfolioBadge")}
            heading={t("portfolioTitle")}
            description={t("portfolioDesc")}
            icon={FolderCode}
          />
        </Reveal>
        <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-3">
          {itProjects.map((p) => (
            <StaggerItem key={p.id}>
              <Link
                href={`/it/${p.slug}`}
                className="group block h-full rounded-xl border border-(--m-border) bg-(--m-card) p-6 backdrop-blur transition-all hover:border-brand-blue/40 hover:shadow-xl hover:shadow-brand-blue/10"
              >
                {p.screenshotUrl && (
                  <div className="mb-5 aspect-video overflow-hidden rounded-lg border border-(--m-border) bg-(--m-media-bg)">
                    <Image
                      src={p.screenshotUrl}
                      alt={pickLocaleField(p, "title", locale)}
                      width={960}
                      height={540}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                )}
                <div className="mb-4 h-1 w-12 rounded-full bg-linear-to-r from-brand-blue to-brand-violet" />
                <div className="mb-4 flex flex-wrap gap-2">
                  {p.categories.map((cat) => (
                    <Badge
                      key={cat.id}
                      variant="secondary"
                      className="border-brand-blue/20 bg-brand-blue/10 text-(--m-accent)"
                    >
                      {pickLocaleField(cat, "name", locale)}
                    </Badge>
                  ))}
                </div>
                <h3 className="mt-3 text-lg font-semibold text-(--m-strong) group-hover:text-(--m-accent)">
                  {pickLocaleField(p, "title", locale)}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-(--m-muted)">
                  {pickLocaleField(p, "summary", locale)}
                </p>
                <span className="mt-4 inline-block text-sm text-(--m-accent)">
                  {tc("readMore")} →
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
        <Reveal delay={0.2} className="mt-10 text-center">
          <Link
            href="/it"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-(--m-border-strong) bg-transparent text-(--m-strong) hover:bg-(--m-soft-strong) hover:text-(--m-strong)",
            )}
          >
            {t("ctaIt")}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
