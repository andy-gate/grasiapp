import { getTranslations } from "next-intl/server";
import { SectionHeading } from "./section-heading";
import { Layers } from "lucide-react";

const STACK = [
  "Next.js",
  "React",
  "TypeScript",
  "PostgreSQL",
  "Node.js",
  "Cloud",
  "Docker",
  "API / REST",
];

export async function TechStackSection() {
  const t = await getTranslations("home");

  return (
    <section className="border-b border-white/5 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          badge={t("stackBadge")}
          heading={t("stackTitle")}
          description={t("stackDesc")}
          icon={Layers}
        />
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {STACK.map((tech) => (
            <span
              key={tech}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 font-mono text-sm text-slate-300 backdrop-blur transition-colors hover:border-brand-blue/40 hover:text-brand-blue-light"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
