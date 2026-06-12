"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export type CalculatorRate = {
  sourceLang: string;
  targetLang: string;
  pricePerPage: number;
};

export type CalculatorService = {
  id: string;
  name: string;
  rates: CalculatorRate[];
};

export type CalculatorSpeed = {
  name: string;
  note?: string;
  multiplier: number;
};

const selectClass =
  "h-11 w-full rounded-md border border-(--m-border-strong) bg-(--m-card-strong) px-3 text-sm text-(--m-strong) outline-none transition-colors focus:border-brand-blue/60";

export function PriceCalculator({
  services,
  speeds,
  waLink,
}: {
  services: CalculatorService[];
  speeds: CalculatorSpeed[];
  waLink: string | null;
}) {
  const t = useTranslations("translator");
  const locale = useLocale();

  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [sourceLang, setSourceLang] = useState(
    services[0]?.rates[0]?.sourceLang ?? "",
  );
  const [targetLang, setTargetLang] = useState(
    services[0]?.rates[0]?.targetLang ?? "",
  );
  const [speedIdx, setSpeedIdx] = useState(0);
  const [pages, setPages] = useState("1");

  const service = services.find((s) => s.id === serviceId) ?? services[0];
  const sourceLangs = [
    ...new Set((service?.rates ?? []).map((r) => r.sourceLang)),
  ];
  const activeSource = sourceLangs.includes(sourceLang)
    ? sourceLang
    : sourceLangs[0];
  const targetLangs = [
    ...new Set(
      (service?.rates ?? [])
        .filter((r) => r.sourceLang === activeSource)
        .map((r) => r.targetLang),
    ),
  ];
  const activeTarget = targetLangs.includes(targetLang)
    ? targetLang
    : targetLangs[0];
  const rate = (service?.rates ?? []).find(
    (r) => r.sourceLang === activeSource && r.targetLang === activeTarget,
  );
  const speed = speeds[speedIdx] ?? speeds[0];
  const pageCount = Math.max(parseInt(pages, 10) || 0, 0);

  const estimate = useMemo(() => {
    if (!rate || pageCount <= 0) return null;
    const multiplier = speed?.multiplier ?? 1;
    return Math.ceil(rate.pricePerPage * pageCount * multiplier);
  }, [rate, speed, pageCount]);

  const formatIDR = (amount: number) =>
    new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);

  if (!service) return null;

  const pairLabel = rate ? `${rate.sourceLang} → ${rate.targetLang}` : "";

  const waHref =
    waLink && estimate !== null
      ? `${waLink}?text=${encodeURIComponent(
          t("calcWaMessage", {
            service: service.name,
            pair: pairLabel,
            pages: pageCount,
            speed: speed?.name ?? "-",
            price: formatIDR(estimate),
          }),
        )}`
      : null;

  return (
    <div className="rounded-2xl border border-(--m-border) bg-(--m-card) p-6 backdrop-blur md:p-8">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-lg bg-brand-blue/15">
          <Calculator className="size-5 text-(--m-accent)" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-(--m-strong)">
            {t("calcTitle")}
          </h2>
          <p className="text-sm marketing-muted">{t("calcSubtitle")}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label className="text-(--m-soft-text)">{t("calcService")}</Label>
          <select
            className={selectClass}
            value={service.id}
            onChange={(e) => {
              const next = services.find((s) => s.id === e.target.value);
              setServiceId(e.target.value);
              setSourceLang(next?.rates[0]?.sourceLang ?? "");
              setTargetLang(next?.rates[0]?.targetLang ?? "");
            }}
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label className="text-(--m-soft-text)">{t("calcSource")}</Label>
          <select
            className={selectClass}
            value={activeSource ?? ""}
            onChange={(e) => setSourceLang(e.target.value)}
          >
            {sourceLangs.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label className="text-(--m-soft-text)">{t("calcTarget")}</Label>
          <select
            className={selectClass}
            value={activeTarget ?? ""}
            onChange={(e) => setTargetLang(e.target.value)}
          >
            {targetLangs.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
        {speeds.length > 0 && (
          <div className="space-y-2">
            <Label className="text-(--m-soft-text)">{t("calcSpeed")}</Label>
            <select
              className={selectClass}
              value={speedIdx}
              onChange={(e) => setSpeedIdx(Number(e.target.value))}
            >
              {speeds.map((s, idx) => (
                <option key={idx} value={idx}>
                  {s.name}
                  {s.note ? ` (${s.note})` : ""}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="space-y-2">
          <Label className="text-(--m-soft-text)">{t("calcPages")}</Label>
          <Input
            type="number"
            min={1}
            value={pages}
            onChange={(e) => setPages(e.target.value)}
            className="h-11 border-(--m-border-strong) bg-(--m-card-strong) text-(--m-strong)"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-xl border border-brand-blue/20 bg-brand-blue/5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm marketing-muted">{t("calcEstimate")}</p>
          <p className="mt-1 bg-linear-to-r from-brand-indigo to-brand-blue bg-clip-text text-3xl font-bold text-transparent">
            {estimate !== null ? formatIDR(estimate) : "—"}
          </p>
          <p className="mt-1 text-xs marketing-muted">{t("calcDisclaimer")}</p>
        </div>
        {waHref && (
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 shrink-0 items-center gap-2.5 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-white shadow-lg shadow-[#25D366]/25 transition-colors hover:bg-[#1DA851]"
          >
            <WhatsAppIcon className="size-5" />
            {t("calcOrder")}
          </a>
        )}
      </div>
    </div>
  );
}
