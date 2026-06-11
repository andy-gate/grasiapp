"use client";

import Image from "next/image";
import { createTeamMember, updateTeamMember } from "@/actions/admin/team";
import { AdminForm } from "@/components/admin/admin-form";
import {
  BilingualPair,
  FormCheckbox,
  FormField,
  FormFile,
} from "@/components/admin/form-fields";
import { Label } from "@/components/ui/label";
import type { TeamMember } from "@/generated/prisma/client";

export function TeamForm({ member }: { member?: TeamMember }) {
  const action = member
    ? updateTeamMember.bind(null, member.id)
    : createTeamMember;

  return (
    <AdminForm
      action={action}
      cancelHref="/admin/team"
      submitLabel={member ? "Perbarui" : "Buat"}
    >
      <FormField label="Nama" name="name" defaultValue={member?.name} />
      <BilingualPair
        base="role"
        label="Jabatan"
        values={{ id: member?.roleId ?? "", en: member?.roleEn ?? "" }}
      />
      {member?.photoUrl && (
        <div className="space-y-2">
          <Label>Foto saat ini</Label>
          <Image
            src={member.photoUrl}
            alt={member.name}
            width={160}
            height={160}
            className="h-28 w-28 rounded-full border object-cover"
          />
        </div>
      )}
      <FormFile
        label="Upload foto"
        name="photoFile"
        accept="image/png,image/jpeg,image/webp"
        hint="Opsional — PNG/JPG/WEBP, maks 2MB. Jika diisi, akan menggantikan foto lama."
      />
      <FormField
        label="URL foto"
        name="photoUrl"
        defaultValue={member?.photoUrl ?? ""}
        hint="Alternatif tanpa upload: tempel URL gambar atau path internal"
      />
      <FormField
        label="Urutan"
        name="sortOrder"
        type="number"
        defaultValue={member?.sortOrder ?? 0}
      />
      <FormCheckbox
        label="Aktif"
        name="isActive"
        defaultChecked={member?.isActive ?? true}
      />
    </AdminForm>
  );
}
