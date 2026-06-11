"use client";

import { createLanguage, updateLanguage } from "@/actions/admin/languages";
import { AdminForm } from "@/components/admin/admin-form";
import {
  BilingualPair,
  FormCheckbox,
  FormField,
} from "@/components/admin/form-fields";
import type { Language } from "@/generated/prisma/client";

export function LanguageForm({ language }: { language?: Language }) {
  const action = language
    ? updateLanguage.bind(null, language.id)
    : createLanguage;

  return (
    <AdminForm
      action={action}
      cancelHref="/admin/languages"
      submitLabel={language ? "Perbarui" : "Buat"}
    >
      <FormField
        label="Kode"
        name="code"
        defaultValue={language?.code}
        hint="Kode unik, mis. id, en, zh. Kosongkan untuk auto-generate dari nama ID"
      />
      <BilingualPair
        base="name"
        label="Nama bahasa"
        values={{ id: language?.nameId ?? "", en: language?.nameEn ?? "" }}
      />
      <FormField
        label="Urutan"
        name="sortOrder"
        type="number"
        defaultValue={language?.sortOrder ?? 0}
      />
      <FormCheckbox
        label="Aktif"
        name="isActive"
        defaultChecked={language?.isActive ?? true}
      />
    </AdminForm>
  );
}
