import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/marketing/contact-form";
import { ContactInfo } from "@/components/marketing/contact-info";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="marketing-page-title">{t("title")}</h1>
      <p className="mt-2 marketing-muted">{t("subtitle")}</p>

      <div className="mt-8">
        <ContactInfo />
      </div>

      <div className="mt-8 rounded-xl border border-white/10 bg-[#0d1117]/60 p-6 backdrop-blur">
        <h2 className="mb-6 text-lg font-semibold text-white">{t("formTitle")}</h2>
        <ContactForm />
      </div>
    </div>
  );
}
