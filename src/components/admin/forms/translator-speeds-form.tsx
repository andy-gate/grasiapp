"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { updateTranslatorSpeeds } from "@/actions/admin/translator-speeds";
import { AdminForm } from "@/components/admin/admin-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SpeedPackage } from "@/lib/translator-pricing";

type SpeedInput = {
  nameId: string;
  nameEn: string;
  multiplier: number | string;
  noteId: string;
  noteEn: string;
};

const emptyPackage: SpeedInput = {
  nameId: "",
  nameEn: "",
  multiplier: "",
  noteId: "",
  noteEn: "",
};

export function TranslatorSpeedsForm({
  packages: initial,
}: {
  packages: SpeedPackage[];
}) {
  const [packages, setPackages] = useState<SpeedInput[]>(
    initial.map((pkg) => ({
      nameId: pkg.nameId,
      nameEn: pkg.nameEn,
      multiplier: pkg.multiplier,
      noteId: pkg.noteId ?? "",
      noteEn: pkg.noteEn ?? "",
    })),
  );

  const setField = (idx: number, field: keyof SpeedInput, val: string) =>
    setPackages((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item)),
    );

  return (
    <AdminForm action={updateTranslatorSpeeds} cancelHref="/admin/turnaround">
      <input
        type="hidden"
        name="packagesJson"
        value={JSON.stringify(packages)}
      />
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Pengali harga 1 berarti harga normal, 1.5 berarti +50%, dst.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setPackages((prev) => [...prev, { ...emptyPackage }])}
        >
          <Plus className="size-4" />
          Tambah opsi
        </Button>
      </div>
      {packages.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Belum ada opsi waktu pengerjaan. Contoh: Reguler (x1), Express
          (x1.5).
        </p>
      )}
      {packages.map((pkg, idx) => (
        <div key={idx} className="space-y-3 rounded-md border p-3">
          <div className="flex items-end gap-3">
            <div className="grid flex-1 gap-3 sm:grid-cols-[1fr_1fr_130px]">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Nama (ID)</p>
                <Input
                  value={pkg.nameId}
                  placeholder="Reguler"
                  onChange={(e) => setField(idx, "nameId", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Nama (EN)</p>
                <Input
                  value={pkg.nameEn}
                  placeholder="Regular"
                  onChange={(e) => setField(idx, "nameEn", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Pengali harga</p>
                <Input
                  type="number"
                  min={0}
                  step="0.05"
                  value={pkg.multiplier}
                  placeholder="1"
                  onChange={(e) => setField(idx, "multiplier", e.target.value)}
                />
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Hapus opsi"
              onClick={() =>
                setPackages((prev) => prev.filter((_, i) => i !== idx))
              }
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Catatan durasi (ID)
              </p>
              <Input
                value={pkg.noteId}
                placeholder="3-5 hari kerja"
                onChange={(e) => setField(idx, "noteId", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Catatan durasi (EN)
              </p>
              <Input
                value={pkg.noteEn}
                placeholder="3-5 working days"
                onChange={(e) => setField(idx, "noteEn", e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
    </AdminForm>
  );
}
