import { getTranslations } from "next-intl/server";
import { SectionHeading } from "./section-heading";
import { Layers } from "lucide-react";
import { prisma } from "@/lib/db";
import { pickLocaleField } from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import { Reveal, StaggerGroup, StaggerItem } from "./motion/reveal";

export async function TechStackSection({ locale }: { locale: Locale }) {
  const t = await getTranslations("home");

  const items = await prisma.techStackItem.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  if (items.length === 0) return null;

  return (
    <section className="border-b border-white/5 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            badge={t("stackBadge")}
            heading={t("stackTitle")}
            description={t("stackDesc")}
            icon={Layers}
          />
        </Reveal>
        <StaggerGroup className="mt-10 flex flex-wrap justify-center gap-3">
          {items.map((item) => (
            <StaggerItem key={item.id}>
              <span
                className="inline-block rounded-lg border border-white/10 bg-white/5 px-4 py-2 font-mono text-sm text-slate-300 backdrop-blur transition-colors hover:border-brand-blue/40 hover:text-brand-blue-light"
              >
                {pickLocaleField(item, "name", locale)}
              </span>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
