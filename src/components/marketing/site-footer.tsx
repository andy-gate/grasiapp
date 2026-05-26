import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "./brand-logo";
import { getCompanySettings, getWhatsAppLink } from "@/lib/company";

export async function SiteFooter() {
  const t = await getTranslations("nav");
  const company = await getCompanySettings();
  const waLink = getWhatsAppLink(company.waNumber ?? company.phone);

  return (
    <footer className="mt-auto border-t border-white/10 bg-black">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <BrandLogo size="lg" />
            <p className="mt-4 text-sm text-slate-500">
              Grasia Prima Perfekta
              <br />
              Software development & digital solutions
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-blue-light">
              Navigasi
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/about" className="hover:text-brand-blue-light">
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link href="/it" className="hover:text-brand-blue-light">
                  {t("it")}
                </Link>
              </li>
              <li>
                <Link href="/charity" className="hover:text-brand-blue-light">
                  {t("charity")}
                </Link>
              </li>
              <li>
                <Link href="/translator" className="hover:text-brand-blue-light">
                  {t("translator")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-blue-light">
              Kontak
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/contact" className="hover:text-brand-blue-light">
                  {t("contact")}
                </Link>
              </li>
              {company.email && (
                <li>
                  <a
                    href={`mailto:${company.email}`}
                    className="hover:text-brand-blue-light"
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
                    className="hover:text-brand-blue-light"
                  >
                    WhatsApp {company.phone ? `· ${company.phone}` : ""}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <p className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} Grasia Prima Perfekta. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
