"use client";

import { updateCompanySettings } from "@/actions/admin/settings";
import { AdminForm } from "@/components/admin/admin-form";
import { BilingualPair, FormField } from "@/components/admin/form-fields";
import type { CompanySettings } from "@/lib/company";

export function CompanySettingsForm({
  settings,
}: {
  settings: CompanySettings;
}) {
  const socials = settings.socials ?? {};

  return (
    <AdminForm action={updateCompanySettings} cancelHref="/admin/settings">
      <BilingualPair
        base="name"
        label="Nama perusahaan"
        values={{ id: settings.nameId ?? "", en: settings.nameEn ?? "" }}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <FormField
          label="Email"
          name="email"
          type="email"
          defaultValue={settings.email ?? ""}
        />
        <FormField
          label="Telepon"
          name="phone"
          defaultValue={settings.phone ?? ""}
        />
        <FormField
          label="Nomor WhatsApp"
          name="waNumber"
          defaultValue={settings.waNumber ?? ""}
          hint="Format internasional tanpa +, mis. 6281234567890"
        />
      </div>
      <BilingualPair
        base="address"
        label="Alamat"
        values={{ id: settings.addressId ?? "", en: settings.addressEn ?? "" }}
        multiline
      />
      <BilingualPair
        base="hours"
        label="Jam operasional"
        values={{ id: settings.hoursId ?? "", en: settings.hoursEn ?? "" }}
      />
      <fieldset className="space-y-4">
        <legend className="text-sm font-medium">Media Sosial</legend>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            label="Facebook"
            name="facebook"
            defaultValue={socials.facebook ?? ""}
          />
          <FormField
            label="Instagram"
            name="instagram"
            defaultValue={socials.instagram ?? ""}
          />
          <FormField
            label="LinkedIn"
            name="linkedin"
            defaultValue={socials.linkedin ?? ""}
          />
          <FormField
            label="YouTube"
            name="youtube"
            defaultValue={socials.youtube ?? ""}
          />
          <FormField label="X (Twitter)" name="x" defaultValue={socials.x ?? ""} />
          <FormField
            label="TikTok"
            name="tiktok"
            defaultValue={socials.tiktok ?? ""}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Isi dengan URL lengkap (https://...). Kosongkan yang tidak dipakai.
        </p>
      </fieldset>
    </AdminForm>
  );
}
