import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScaleIn } from "./motion/reveal";

export async function CtaSection() {
  const t = await getTranslations("home");
  const tc = await getTranslations("common");

  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <ScaleIn>
        <div className="relative overflow-hidden rounded-2xl border border-brand-blue/30 px-8 py-14 text-center md:px-16">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "linear-gradient(135deg, rgba(42,16,163,0.4) 0%, rgba(59,68,251,0.3) 50%, rgba(77,33,255,0.2) 100%)",
          }}
        />
        <div className="relative">
          <h2 className="bg-gradient-to-r from-white via-brand-blue-light to-brand-violet bg-clip-text text-2xl font-semibold tracking-tight text-transparent md:text-3xl">
            {t("ctaTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-slate-300">
            {t("ctaDesc")}
          </p>
          <Link
            href="/contact"
            className={cn(
              buttonVariants(),
              "mt-8 inline-flex h-11 border-0 bg-white px-8 text-[#0a0a0a] hover:bg-slate-100",
            )}
          >
            {tc("contactUs")}
          </Link>
        </div>
        </div>
      </ScaleIn>
    </section>
  );
}
