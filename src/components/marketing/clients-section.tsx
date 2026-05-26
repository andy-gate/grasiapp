import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SectionHeading } from "./section-heading";
import { Building2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { pickLocaleField } from "@/lib/content";
import type { Locale } from "@/i18n/routing";

export async function ClientsSection({ locale }: { locale: Locale }) {
  const t = await getTranslations("home");

  const clients = await prisma.client.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  if (clients.length === 0) return null;

  return (
    <section className="border-b border-white/5 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          badge={t("clientsBadge")}
          heading={t("clientsTitle")}
          description={t("clientsDesc")}
          icon={Building2}
        />
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {clients.map((client) => {
            const name = pickLocaleField(client, "name", locale);
            const content = client.logoUrl ? (
              <Image
                src={client.logoUrl}
                alt={name}
                width={120}
                height={48}
                className="h-10 w-auto max-w-[120px] object-contain opacity-70 grayscale transition-all group-hover:opacity-100 group-hover:grayscale-0"
              />
            ) : (
              <span className="text-center text-sm font-medium text-slate-400 transition-colors group-hover:text-brand-blue-light">
                {name}
              </span>
            );

            const className =
              "group flex h-20 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 backdrop-blur transition-colors hover:border-brand-blue/30 hover:bg-white/[0.06]";

            if (client.websiteUrl) {
              return (
                <a
                  key={client.id}
                  href={client.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                  title={name}
                >
                  {content}
                </a>
              );
            }

            return (
              <div key={client.id} className={className} title={name}>
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
