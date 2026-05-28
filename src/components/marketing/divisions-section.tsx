import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "./section-heading";
import { Code2, Heart, Languages, ArrowRight } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "./motion/reveal";

export async function DivisionsSection() {
  const t = await getTranslations("home");

  const items = [
    {
      href: "/it" as const,
      icon: Code2,
      title: t("ctaIt"),
      desc: t("divisionItDesc"),
      featured: true,
    },
    {
      href: "/charity" as const,
      icon: Heart,
      title: t("ctaCharity"),
      desc: t("divisionCharityDesc"),
      featured: false,
    },
    {
      href: "/translator" as const,
      icon: Languages,
      title: t("ctaTranslator"),
      desc: t("divisionTranslatorDesc"),
      featured: false,
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <Reveal>
        <SectionHeading
          badge={t("divisionsBadge")}
          heading={t("divisionsTitle")}
          description={t("divisionsDesc")}
          align="center"
        />
      </Reveal>
      <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <StaggerItem key={item.href}>
              <Link href={item.href} className="group block h-full">
                <div
                  className={`h-full rounded-xl border p-6 transition-all ${
                    item.featured
                      ? "border-brand-blue/40 bg-gradient-to-br from-brand-indigo/20 to-brand-blue/5 shadow-lg shadow-brand-blue/10"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20"
                  }`}
                >
                  <div
                    className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg ${
                      item.featured
                        ? "bg-brand-blue/20 text-brand-blue-light"
                        : "bg-white/10 text-slate-400"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="flex items-center justify-between font-semibold text-white">
                    {item.title}
                    <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </h3>
                  <p className="mt-2 text-sm text-slate-400">{item.desc}</p>
                </div>
              </Link>
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </section>
  );
}
