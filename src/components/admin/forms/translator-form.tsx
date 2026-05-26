"use client";

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
import type { TranslatorService } from "@/generated/prisma/client";

export function TranslatorForm({ service }: { service?: TranslatorService }) {
  const action = service
    ? updateTranslatorService.bind(null, service.id)
    : createTranslatorService;

  return (
    <AdminForm action={action} cancelHref="/admin/translator">
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
