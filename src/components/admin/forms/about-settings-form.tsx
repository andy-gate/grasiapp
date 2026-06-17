"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { updateAboutSettings } from "@/actions/admin/about";
import { AdminForm } from "@/components/admin/admin-form";
import { BilingualPair, FormField, FormTextarea } from "@/components/admin/form-fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AboutSettings, AboutValue } from "@/lib/about";

const emptyValue: AboutValue = {
  titleId: "",
  titleEn: "",
  descId: "",
  descEn: "",
};

export function AboutSettingsForm({ settings }: { settings: AboutSettings }) {
  const [values, setValues] = useState<AboutValue[]>(settings.values ?? []);

  const setValueField = (idx: number, field: keyof AboutValue, val: string) =>
    setValues((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item)),
    );

  return (
    <AdminForm action={updateAboutSettings} cancelHref="/admin/about">
      <input type="hidden" name="valuesJson" value={JSON.stringify(values)} />

      <div className="grid gap-4 md:grid-cols-2">
        <FormTextarea
          label="Pengantar (ID)"
          name="introId"
          defaultValue={settings.introId ?? ""}
          rows={3}
        />
        <FormTextarea
          label="Pengantar (EN)"
          name="introEn"
          defaultValue={settings.introEn ?? ""}
          rows={3}
        />
      </div>
      <FormField
        label="Tahun berdiri"
        name="foundedYear"
        type="number"
        defaultValue={settings.foundedYear ?? ""}
        hint="Dipakai untuk menghitung statistik tahun pengalaman secara otomatis. Statistik lain (proyek, klien, charity) dihitung dari database."
      />
      <BilingualPair
        base="vision"
        label="Visi"
        values={{ id: settings.visionId ?? "", en: settings.visionEn ?? "" }}
        multiline
      />
      <BilingualPair
        base="mission"
        label="Misi"
        values={{ id: settings.missionId ?? "", en: settings.missionEn ?? "" }}
        multiline
      />

      <fieldset className="space-y-3">
        <div className="flex items-center justify-between">
          <legend className="text-sm font-medium">Nilai Perusahaan</legend>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setValues((prev) => [...prev, { ...emptyValue }])}
          >
            <Plus className="size-4" />
            Tambah nilai
          </Button>
        </div>
        {values.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Belum ada nilai perusahaan. Contoh: Integritas, Kolaborasi.
          </p>
        )}
        {values.map((value, idx) => (
          <div key={idx} className="space-y-3 rounded-md border p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Judul (ID)</p>
                  <Input
                    value={value.titleId}
                    placeholder="Integritas"
                    onChange={(e) =>
                      setValueField(idx, "titleId", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Judul (EN)</p>
                  <Input
                    value={value.titleEn}
                    placeholder="Integrity"
                    onChange={(e) =>
                      setValueField(idx, "titleEn", e.target.value)
                    }
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Hapus nilai"
                onClick={() =>
                  setValues((prev) => prev.filter((_, i) => i !== idx))
                }
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Deskripsi (ID)</p>
                <Textarea
                  value={value.descId}
                  rows={2}
                  onChange={(e) => setValueField(idx, "descId", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Deskripsi (EN)</p>
                <Textarea
                  value={value.descEn}
                  rows={2}
                  onChange={(e) => setValueField(idx, "descEn", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </fieldset>
    </AdminForm>
  );
}
