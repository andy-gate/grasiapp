"use client";

import { createClient, updateClient } from "@/actions/admin/clients";
import { AdminForm } from "@/components/admin/admin-form";
import {
  BilingualPair,
  FormCheckbox,
  FormField,
} from "@/components/admin/form-fields";
import type { Client } from "@/generated/prisma/client";

export function ClientForm({ client }: { client?: Client }) {
  const action = client
    ? updateClient.bind(null, client.id)
    : createClient;

  return (
    <AdminForm
      action={action}
      cancelHref="/admin/clients"
      submitLabel={client ? "Perbarui" : "Buat"}
    >
      <FormField
        label="Slug"
        name="slug"
        defaultValue={client?.slug}
        hint="Kosongkan untuk auto-generate dari nama ID"
      />
      <BilingualPair
        base="name"
        label="Nama klien"
        values={{ id: client?.nameId ?? "", en: client?.nameEn ?? "" }}
      />
      <FormField
        label="URL logo"
        name="logoUrl"
        type="url"
        defaultValue={client?.logoUrl ?? ""}
        hint="Link gambar logo (PNG/SVG dengan background transparan disarankan)"
      />
      <FormField
        label="Website klien"
        name="websiteUrl"
        type="url"
        defaultValue={client?.websiteUrl ?? ""}
        hint="Opsional — logo akan bisa diklik ke website ini"
      />
      <FormField
        label="Urutan"
        name="sortOrder"
        type="number"
        defaultValue={client?.sortOrder ?? 0}
      />
      <FormCheckbox
        label="Aktif"
        name="isActive"
        defaultChecked={client?.isActive ?? true}
      />
    </AdminForm>
  );
}
