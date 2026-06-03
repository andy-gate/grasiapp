import { getTranslations } from "next-intl/server";
import { SectionHeading } from "./section-heading";
import { Building2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { pickLocaleField } from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "./motion/reveal";
import { ClientsMarquee } from "./clients-marquee";

export async function ClientsSection({ locale }: { locale: Locale }) {
  const t = await getTranslations("home");

  const clients = await prisma.client.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  if (clients.length === 0) return null;

  const items = clients.map((client) => ({
    id: client.id,
    name: pickLocaleField(client, "name", locale),
    logoUrl: client.logoUrl,
    websiteUrl: client.websiteUrl,
  }));

  return (
    <section className="border-b border-white/5 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            badge={t("clientsBadge")}
            heading={t("clientsTitle")}
            description={t("clientsDesc")}
            icon={Building2}
          />
        </Reveal>
      </div>
      <ClientsMarquee clients={items} />
    </section>
  );
}
