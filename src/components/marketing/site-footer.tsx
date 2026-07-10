import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "./brand-logo";
import { getCompanySettings, getWhatsAppLink } from "@/lib/company";

export async function SiteFooter() {
  const tNav = await getTranslations("nav");
  const t = await getTranslations("footer");
  const company = await getCompanySettings();
  const waLink = getWhatsAppLink(company.waNumber ?? company.phone);

  return (
    <footer className="mt-auto border-t border-(--m-border) bg-(--m-bg) transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2">
            <BrandLogo size="lg" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-(--m-muted)">
              Grasia Prima Perfekta
              <br />
              {t("desc")}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-(--m-accent)">
              {t("nav")}
            </p>
            <ul className="mt-6 space-y-3 text-sm text-(--m-muted)">
              <li>
                <Link href="/about" className="transition-colors hover:text-(--m-strong)">
                  {tNav("about")}
                </Link>
              </li>
              <li>
                <Link href="/it" className="transition-colors hover:text-(--m-strong)">
                  {tNav("it")}
                </Link>
              </li>
              <li>
                <Link href="/charity" className="transition-colors hover:text-(--m-strong)">
                  {tNav("charity")}
                </Link>
              </li>
              <li>
                <Link href="/translator" className="transition-colors hover:text-(--m-strong)">
                  {tNav("translator")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-(--m-accent)">
              {t("contact")}
            </p>
            <ul className="mt-6 space-y-3 text-sm text-(--m-muted)">
              <li>
                <Link href="/contact" className="transition-colors hover:text-(--m-strong)">
                  {tNav("contact")}
                </Link>
              </li>
              {company.email && (
                <li>
                  <a
                    href={`mailto:${company.email}`}
                    className="transition-colors hover:text-(--m-strong)"
                  >
                    {company.email}
                  </a>
                </li>
              )}
              {waLink && (
                <li>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-(--m-strong)"
                  >
                    WhatsApp {company.phone ? `· ${company.phone}` : ""}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="mt-16 border-t border-(--m-border) pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-(--m-faint)">
          <p>
            {t("rights", { year: new Date().getFullYear() })}
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-(--m-muted) transition-colors">{t("privacy")}</a>
            <a href="#" className="hover:text-(--m-muted) transition-colors">{t("terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
