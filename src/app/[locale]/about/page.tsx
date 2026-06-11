import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { publishedWhere, pickLocaleField } from "@/lib/content";
import { getAboutSettings } from "@/lib/about";
import type { Locale } from "@/i18n/routing";
import {
  Reveal,
  StaggerGroup,
  StaggerItem,
} from "@/components/marketing/motion/reveal";
import { Eye, Target, Sparkles } from "lucide-react";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations("about");

  const [page, settings, team, projectCount, clientCount, charityCount] =
    await Promise.all([
      prisma.page.findFirst({ where: { slug: "about", ...publishedWhere() } }),
      getAboutSettings(),
      prisma.teamMember.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.itProject.count({ where: publishedWhere() }),
      prisma.client.count({ where: { isActive: true } }),
      prisma.charityProject.count({ where: publishedWhere() }),
    ]);
  if (!page) notFound();

  const tr = (id?: string, en?: string) => (loc === "id" ? id : en) ?? "";
  const yearsOfExperience = settings.foundedYear
    ? Math.max(new Date().getFullYear() - settings.foundedYear, 0)
    : null;
  const stats = [
    yearsOfExperience !== null
      ? { value: `${yearsOfExperience}+`, label: t("statsYears") }
      : null,
    { value: `${projectCount}+`, label: t("statsProjects") },
    { value: String(clientCount), label: t("statsClients") },
    { value: String(charityCount), label: t("statsCharity") },
  ].filter((stat) => stat !== null);
  const values = settings.values ?? [];
  const vision = tr(settings.visionId, settings.visionEn);
  const mission = tr(settings.missionId, settings.missionEn);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Intro */}
      <Reveal className="mx-auto max-w-3xl text-center">
        <h1 className="marketing-page-title">
          {pickLocaleField(page, "title", loc)}
        </h1>
        <div
          className="prose prose-invert mx-auto mt-6 max-w-none text-left"
          dangerouslySetInnerHTML={{
            __html: pickLocaleField(page, "body", loc),
          }}
        />
      </Reveal>

      {/* Statistik */}
      <StaggerGroup className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat, idx) => (
          <StaggerItem
            key={idx}
            className="rounded-xl border border-white/10 bg-[#0d1117]/60 p-6 text-center backdrop-blur"
          >
            <p className="bg-linear-to-r from-brand-indigo to-brand-blue bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              {stat.value}
            </p>
            <p className="mt-2 text-sm marketing-muted">{stat.label}</p>
          </StaggerItem>
        ))}
      </StaggerGroup>

      {/* Visi & Misi */}
      {(vision || mission) && (
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {vision && (
            <Reveal className="h-full">
              <div className="h-full rounded-xl border border-white/10 bg-[#0d1117]/60 p-8 backdrop-blur">
                <div className="flex size-11 items-center justify-center rounded-lg bg-brand-blue/15">
                  <Eye className="size-5 text-brand-blue-light" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-white">
                  {t("vision")}
                </h2>
                <p className="mt-3 leading-relaxed marketing-muted">{vision}</p>
              </div>
            </Reveal>
          )}
          {mission && (
            <Reveal className="h-full" delay={0.1}>
              <div className="h-full rounded-xl border border-white/10 bg-[#0d1117]/60 p-8 backdrop-blur">
                <div className="flex size-11 items-center justify-center rounded-lg bg-brand-indigo/15">
                  <Target className="size-5 text-brand-blue-light" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-white">
                  {t("mission")}
                </h2>
                <p className="mt-3 whitespace-pre-line leading-relaxed marketing-muted">
                  {mission}
                </p>
              </div>
            </Reveal>
          )}
        </div>
      )}

      {/* Nilai Perusahaan */}
      {values.length > 0 && (
        <section className="mt-16">
          <Reveal className="text-center">
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              {t("valuesTitle")}
            </h2>
            <p className="mt-2 marketing-muted">{t("valuesSubtitle")}</p>
          </Reveal>
          <StaggerGroup className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value, idx) => (
              <StaggerItem
                key={idx}
                className="rounded-xl border border-white/10 bg-[#0d1117]/60 p-6 backdrop-blur transition-colors hover:border-brand-blue/40"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-brand-blue/15">
                    <Sparkles className="size-4 text-brand-blue-light" />
                  </div>
                  <h3 className="font-semibold text-white">
                    {tr(value.titleId, value.titleEn)}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed marketing-muted">
                  {tr(value.descId, value.descEn)}
                </p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>
      )}

      {/* Tim */}
      {team.length > 0 && (
        <section className="mt-16">
          <Reveal className="text-center">
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              {t("teamTitle")}
            </h2>
            <p className="mt-2 marketing-muted">{t("teamSubtitle")}</p>
          </Reveal>
          <StaggerGroup className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {team.map((member) => (
              <StaggerItem
                key={member.id}
                className="group rounded-xl border border-white/10 bg-[#0d1117]/60 p-6 text-center backdrop-blur transition-colors hover:border-brand-blue/40"
              >
                {member.photoUrl ? (
                  <Image
                    src={member.photoUrl}
                    alt={member.name}
                    width={240}
                    height={240}
                    className="mx-auto size-24 rounded-full border border-white/10 object-cover"
                  />
                ) : (
                  <div className="mx-auto flex size-24 items-center justify-center rounded-full border border-white/10 bg-linear-to-br from-brand-indigo/30 to-brand-blue/30 text-2xl font-semibold text-white">
                    {member.name
                      .split(" ")
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                )}
                <h3 className="mt-4 font-semibold text-white">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm marketing-muted">
                  {tr(member.roleId, member.roleEn)}
                </p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>
      )}
    </div>
  );
}
