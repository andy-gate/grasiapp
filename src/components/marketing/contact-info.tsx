import { getTranslations } from "next-intl/server";
import { Mail, MessageCircle } from "lucide-react";
import {
  getCompanySettings,
  getWhatsAppLink,
} from "@/lib/company";

export async function ContactInfo() {
  const t = await getTranslations("contact");
  const company = await getCompanySettings();
  const waLink = getWhatsAppLink(company.waNumber ?? company.phone);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {company.email && (
        <a
          href={`mailto:${company.email}`}
          className="group flex items-start gap-3 rounded-xl border border-white/10 bg-[#0d1117]/60 p-4 backdrop-blur transition-colors hover:border-brand-blue/40"
        >
          <Mail className="mt-0.5 size-5 shrink-0 text-brand-blue-light" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {t("email")}
            </p>
            <p className="mt-1 text-sm text-white group-hover:text-brand-blue-light">
              {company.email}
            </p>
          </div>
        </a>
      )}
      {(company.phone || waLink) && (
        <a
          href={waLink ?? `tel:${company.phone}`}
          target={waLink ? "_blank" : undefined}
          rel={waLink ? "noopener noreferrer" : undefined}
          className="group flex items-start gap-3 rounded-xl border border-white/10 bg-[#0d1117]/60 p-4 backdrop-blur transition-colors hover:border-brand-blue/40"
        >
          <MessageCircle className="mt-0.5 size-5 shrink-0 text-brand-blue-light" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {t("whatsapp")}
            </p>
            <p className="mt-1 text-sm text-white group-hover:text-brand-blue-light">
              {company.phone ?? company.waNumber}
            </p>
          </div>
        </a>
      )}
    </div>
  );
}
