"use client";

import {
  createTechStackItem,
  updateTechStackItem,
} from "@/actions/admin/tech-stack";
import { AdminForm } from "@/components/admin/admin-form";
import {
  BilingualPair,
  FormCheckbox,
  FormField,
} from "@/components/admin/form-fields";
import type { TechStackItem } from "@/generated/prisma/client";

export function TechStackForm({ item }: { item?: TechStackItem }) {
  const action = item
    ? updateTechStackItem.bind(null, item.id)
    : createTechStackItem;

  return (
    <AdminForm
      action={action}
      cancelHref="/admin/tech-stack"
      submitLabel={item ? "Perbarui" : "Buat"}
    >
      <FormField
        label="Slug"
        name="slug"
        defaultValue={item?.slug}
        hint="Kosongkan untuk auto-generate dari nama ID"
      />
      <BilingualPair
        base="name"
        label="Nama teknologi"
        values={{ id: item?.nameId ?? "", en: item?.nameEn ?? "" }}
      />
      <FormField
        label="Urutan"
        name="sortOrder"
        type="number"
        defaultValue={item?.sortOrder ?? 0}
      />
      <FormCheckbox
        label="Aktif"
        name="isActive"
        defaultChecked={item?.isActive ?? true}
      />
    </AdminForm>
  );
}
