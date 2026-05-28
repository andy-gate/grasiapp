import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
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
    include: { category: true },
    orderBy: { sortOrder: "asc" },
  });

  if (itProjects.length === 0) return null;

  return (
    <section className="border-y border-white/5 bg-white/[0.02] px-4 py-20">
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
                className="group block h-full rounded-xl border border-white/10 bg-[#0d1117]/60 p-6 backdrop-blur transition-all hover:border-brand-blue/40 hover:shadow-xl hover:shadow-brand-blue/10"
              >
                <div className="mb-4 h-1 w-12 rounded-full bg-gradient-to-r from-brand-blue to-brand-violet" />
                <Badge
                  variant="secondary"
                  className="border-brand-blue/20 bg-brand-blue/10 text-brand-blue-light"
                >
                  {pickLocaleField(p.category, "name", locale)}
                </Badge>
                <h3 className="mt-3 text-lg font-semibold text-white group-hover:text-brand-blue-light">
                  {pickLocaleField(p, "title", locale)}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                  {pickLocaleField(p, "summary", locale)}
                </p>
                <span className="mt-4 inline-block text-sm text-brand-blue-light">
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
              "border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white",
            )}
          >
            {t("ctaIt")}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
