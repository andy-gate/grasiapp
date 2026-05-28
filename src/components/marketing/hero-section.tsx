import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";
import { GridBackground } from "./grid-background";
import { CodeMockup } from "./code-mockup";
import { Cpu } from "lucide-react";
import { HeroEntrance } from "./motion/reveal";

export async function HeroSection() {
  const t = await getTranslations("home");

  return (
    <section className="relative overflow-hidden border-b border-white/5 px-4 pb-24 pt-28 md:pb-32 md:pt-36">
      <GridBackground />
      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-4xl text-center">
          <HeroEntrance>
            <SectionHeading
              badge={t("heroBadge")}
              heading={t("heroTitle")}
              description={t("heroSubtitle")}
              icon={Cpu}
              as="h1"
              gradient
            />
          </HeroEntrance>
          <HeroEntrance delay={0.15} className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className={cn(
                buttonVariants(),
                "h-11 border-0 bg-gradient-to-r from-brand-indigo to-brand-blue px-8 shadow-lg shadow-brand-blue/25 hover:opacity-90",
              )}
            >
              {t("ctaPrimary")}
            </Link>
            <Link
              href="/it"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-11 border-white/20 bg-white/5 px-8 text-white backdrop-blur hover:bg-white/10 hover:text-white",
              )}
            >
              {t("ctaIt")}
            </Link>
          </HeroEntrance>
        </div>
        <CodeMockup />
      </div>
    </section>
  );
}
