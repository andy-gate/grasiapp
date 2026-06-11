"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  createTranslatorService,
  updateTranslatorService,
} from "@/actions/admin/translator";
import { AdminForm } from "@/components/admin/admin-form";
import {
  BilingualPair,
  FormCheckbox,
  FormField,
  PublishStatusField,
} from "@/components/admin/form-fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TranslatorService } from "@/generated/prisma/client";

export type TranslatorRateInput = {
  sourceLanguageId: string;
  targetLanguageId: string;
  pricePerPage: number | string;
};

export type LanguageOption = {
  id: string;
  name: string;
};

const emptyRate: TranslatorRateInput = {
  sourceLanguageId: "",
  targetLanguageId: "",
  pricePerPage: "",
};

export function TranslatorForm({
  service,
  rates: initialRates = [],
  languages = [],
}: {
  service?: TranslatorService;
  rates?: TranslatorRateInput[];
  languages?: LanguageOption[];
}) {
  const action = service
    ? updateTranslatorService.bind(null, service.id)
    : createTranslatorService;
  const [rates, setRates] = useState<TranslatorRateInput[]>(initialRates);

  const setRateField = (
    idx: number,
    field: keyof TranslatorRateInput,
    val: string,
  ) =>
    setRates((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item)),
    );

  return (
    <AdminForm action={action} cancelHref="/admin/translator">
      <input type="hidden" name="ratesJson" value={JSON.stringify(rates)} />
      <FormField label="Slug" name="slug" defaultValue={service?.slug} />
      <BilingualPair
        base="name"
        label="Nama"
        values={{ id: service?.nameId ?? "", en: service?.nameEn ?? "" }}
      />
      <BilingualPair
        base="description"
        label="Deskripsi"
        values={{
          id: service?.descriptionId ?? "",
          en: service?.descriptionEn ?? "",
        }}
        multiline
      />
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label="Bahasa sumber"
          name="sourceLanguages"
          defaultValue={service?.sourceLanguages.join(", ") ?? "id, en"}
          hint="Pisahkan dengan koma"
          required
        />
        <FormField
          label="Bahasa target"
          name="targetLanguages"
          defaultValue={service?.targetLanguages.join(", ") ?? "id, en"}
          required
        />
      </div>
      <FormField
        label="Tipe layanan"
        name="serviceType"
        defaultValue={service?.serviceType ?? "document"}
      />
      <fieldset className="space-y-3">
        <div className="flex items-center justify-between">
          <legend className="text-sm font-medium">
            Tarif per halaman (untuk kalkulator harga)
          </legend>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setRates((prev) => [...prev, { ...emptyRate }])}
          >
            <Plus className="size-4" />
            Tambah tarif
          </Button>
        </div>
        {rates.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Belum ada tarif. Layanan tanpa tarif tidak muncul di kalkulator
            harga.
          </p>
        )}
        {languages.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Belum ada master bahasa. Tambahkan dulu di menu Bahasa
            (/admin/languages).
          </p>
        )}
        {rates.map((rate, idx) => (
          <div
            key={idx}
            className="grid items-end gap-3 rounded-md border p-3 sm:grid-cols-[1fr_1fr_160px_auto]"
          >
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Bahasa asal</p>
              <select
                value={rate.sourceLanguageId}
                onChange={(e) =>
                  setRateField(idx, "sourceLanguageId", e.target.value)
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
              >
                <option value="">Pilih bahasa</option>
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Bahasa tujuan</p>
              <select
                value={rate.targetLanguageId}
                onChange={(e) =>
                  setRateField(idx, "targetLanguageId", e.target.value)
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
              >
                <option value="">Pilih bahasa</option>
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Harga per halaman (Rp)
              </p>
              <Input
                type="number"
                min={0}
                value={rate.pricePerPage}
                placeholder="75000"
                onChange={(e) =>
                  setRateField(idx, "pricePerPage", e.target.value)
                }
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Hapus tarif"
              onClick={() =>
                setRates((prev) => prev.filter((_, i) => i !== idx))
              }
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        ))}
      </fieldset>
      <BilingualPair
        base="pricingNote"
        label="Catatan harga"
        values={{
          id: service?.pricingNoteId ?? "",
          en: service?.pricingNoteEn ?? "",
        }}
        multiline
      />
      <FormField
        label="Sample URL"
        name="sampleUrl"
        defaultValue={service?.sampleUrl ?? ""}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <PublishStatusField defaultValue={service?.status ?? "DRAFT"} />
        <FormField
          label="Urutan"
          name="sortOrder"
          type="number"
          defaultValue={service?.sortOrder ?? 0}
        />
        <div className="flex items-end pb-2">
          <FormCheckbox
            label="Featured"
            name="featured"
            defaultChecked={service?.featured}
          />
        </div>
      </div>
    </AdminForm>
  );
}
