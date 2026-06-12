import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "./brand-logo";
import { getCompanySettings, getWhatsAppLink } from "@/lib/company";

export async function SiteFooter() {
  const t = await getTranslations("nav");
  const company = await getCompanySettings();
  const waLink = getWhatsAppLink(company.waNumber ?? company.phone);

  return (
    <footer className="mt-auto border-t border-(--m-border) bg-(--m-bg)">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <BrandLogo size="lg" />
            <p className="mt-4 text-sm text-(--m-faint)">
              Grasia Prima Perfekta
              <br />
              Software development & digital solutions
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-(--m-accent)">
              Navigasi
            </p>
            <ul className="mt-4 space-y-2 text-sm text-(--m-muted)">
              <li>
                <Link href="/about" className="hover:text-(--m-accent)">
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link href="/it" className="hover:text-(--m-accent)">
                  {t("it")}
                </Link>
              </li>
              <li>
                <Link href="/charity" className="hover:text-(--m-accent)">
                  {t("charity")}
                </Link>
              </li>
              <li>
                <Link href="/translator" className="hover:text-(--m-accent)">
                  {t("translator")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-(--m-accent)">
              Kontak
            </p>
            <ul className="mt-4 space-y-2 text-sm text-(--m-muted)">
              <li>
                <Link href="/contact" className="hover:text-(--m-accent)">
                  {t("contact")}
                </Link>
              </li>
              {company.email && (
                <li>
                  <a
                    href={`mailto:${company.email}`}
                    className="hover:text-(--m-accent)"
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
                    className="hover:text-(--m-accent)"
                  >
                    WhatsApp {company.phone ? `· ${company.phone}` : ""}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <p className="mt-12 border-t border-(--m-border) pt-8 text-center text-xs text-(--m-faint)">
          © {new Date().getFullYear()} Grasia Prima Perfekta. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
