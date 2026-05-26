import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/marketing/hero-section";
import { TechStackSection } from "@/components/marketing/tech-stack-section";
import { ClientsSection } from "@/components/marketing/clients-section";
import { ProcessSection } from "@/components/marketing/process-section";
import { FeaturedSection } from "@/components/marketing/featured-section";
import { DivisionsSection } from "@/components/marketing/divisions-section";
import { CtaSection } from "@/components/marketing/cta-section";
import type { Locale } from "@/i18n/routing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  return (
    <>
      <HeroSection />
      <TechStackSection locale={loc} />
      <ClientsSection locale={loc} />
      <ProcessSection />
      <FeaturedSection locale={loc} />
      <DivisionsSection />
      <CtaSection />
    </>
  );
}
