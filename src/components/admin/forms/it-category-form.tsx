"use client";

import {
  createItCategory,
  updateItCategory,
} from "@/actions/admin/it-categories";
import { AdminForm } from "@/components/admin/admin-form";
import {
  BilingualPair,
  FormCheckbox,
  FormField,
} from "@/components/admin/form-fields";
import type { ItCategory } from "@/generated/prisma/client";

export function ItCategoryForm({ category }: { category?: ItCategory }) {
  const action = category
    ? updateItCategory.bind(null, category.id)
    : createItCategory;

  return (
    <AdminForm
      action={action}
      cancelHref="/admin/it-categories"
      submitLabel={category ? "Perbarui" : "Buat"}
    >
      <FormField
        label="Slug"
        name="slug"
        defaultValue={category?.slug}
        hint="Kosongkan untuk auto-generate dari nama ID"
      />
      <BilingualPair
        base="name"
        label="Nama"
        values={{ id: category?.nameId ?? "", en: category?.nameEn ?? "" }}
      />
      <BilingualPair
        base="description"
        label="Deskripsi"
        values={{
          id: category?.descriptionId ?? "",
          en: category?.descriptionEn ?? "",
        }}
        multiline
      />
      <FormField
        label="Urutan"
        name="sortOrder"
        type="number"
        defaultValue={category?.sortOrder ?? 0}
      />
      <FormCheckbox
        label="Aktif"
        name="isActive"
        defaultChecked={category?.isActive ?? true}
      />
    </AdminForm>
  );
}
