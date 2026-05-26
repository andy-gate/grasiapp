import { getTranslations } from "next-intl/server";
import { SectionHeading } from "./section-heading";
import { GitBranch } from "lucide-react";

const STEPS = ["discover", "design", "build", "deploy", "maintain"] as const;

export async function ProcessSection() {
  const t = await getTranslations("home");

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          badge={t("processBadge")}
          heading={t("processTitle")}
          description={t("processDesc")}
          icon={GitBranch}
        />
        <div className="mt-12 grid gap-4 md:grid-cols-5">
          {STEPS.map((step, i) => (
            <div
              key={step}
              className="group relative rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-5 backdrop-blur transition-all hover:border-brand-blue/30 hover:shadow-lg hover:shadow-brand-blue/5"
            >
              <span className="font-mono text-xs text-brand-blue-light">
                0{i + 1}
              </span>
              <h3 className="mt-2 font-semibold text-white">
                {t(`process.${step}.title`)}
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                {t(`process.${step}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
