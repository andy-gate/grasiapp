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
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="marketing-page-title">{t("title")}</h1>
      <p className="mt-2 max-w-2xl marketing-muted">{t("subtitle")}</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_3fr]">
        <ContactInfo />
        <div className="h-fit rounded-xl border border-(--m-border) bg-(--m-card) p-6 backdrop-blur md:p-8">
          <h2 className="mb-6 text-lg font-semibold text-(--m-strong)">
            {t("formTitle")}
          </h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
