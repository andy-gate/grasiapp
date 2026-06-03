"use client";

import Image from "next/image";
import { createClient, updateClient } from "@/actions/admin/clients";
import { AdminForm } from "@/components/admin/admin-form";
import {
  BilingualPair,
  FormCheckbox,
  FormField,
  FormFile,
} from "@/components/admin/form-fields";
import { Label } from "@/components/ui/label";
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
      {client?.logoUrl && (
        <div className="space-y-2">
          <Label>Logo saat ini</Label>
          <div className="flex h-16 w-fit items-center rounded-md border bg-white px-3">
            <Image
              src={client.logoUrl}
              alt={client.nameId}
              width={120}
              height={48}
              className="h-10 w-auto object-contain"
            />
          </div>
        </div>
      )}
      <FormFile
        label="Upload logo"
        name="logoFile"
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        hint="Opsional — PNG/JPG/SVG/WEBP, maks 2MB. Jika diisi, akan menggantikan logo lama."
      />
      <FormField
        label="URL logo"
        name="logoUrl"
        defaultValue={client?.logoUrl ?? ""}
        hint="Alternatif tanpa upload: tempel URL gambar atau path seperti /client/nama.png"
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
