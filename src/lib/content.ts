import type { Locale } from "@/i18n/routing";

export function pickLocaleField(
  record: Record<string, unknown>,
  base: string,
  locale: Locale,
): string {
  const key = locale === "id" ? `${base}Id` : `${base}En`;
  const value = record[key];
  if (typeof value === "string" && value.length > 0) return value;
  const fallback = record[`${base}Id`];
  return typeof fallback === "string" ? fallback : "";
}

export function publishedWhere() {
  return { status: "PUBLISHED" as const };
}
