"use client";

import Image from "next/image";
import {
  createCharityProject,
  updateCharityProject,
} from "@/actions/admin/charity";
import { AdminForm } from "@/components/admin/admin-form";
import {
  BilingualPair,
  FormCheckbox,
  FormField,
  FormFile,
  PublishStatusField,
} from "@/components/admin/form-fields";
import type { CharityProject } from "@/generated/prisma/client";

export function CharityForm({ project }: { project?: CharityProject }) {
  const action = project
    ? updateCharityProject.bind(null, project.id)
    : createCharityProject;

  return (
    <AdminForm action={action} cancelHref="/admin/charity">
      <FormField label="Slug" name="slug" defaultValue={project?.slug} />
      <BilingualPair
        base="title"
        label="Judul"
        values={{ id: project?.titleId ?? "", en: project?.titleEn ?? "" }}
      />
      <BilingualPair
        base="summary"
        label="Ringkasan"
        values={{
          id: project?.summaryId ?? "",
          en: project?.summaryEn ?? "",
        }}
        multiline
      />
      <BilingualPair
        base="body"
        label="Body"
        values={{ id: project?.bodyId ?? "", en: project?.bodyEn ?? "" }}
        multiline
      />
      <div className="grid gap-4 md:grid-cols-3">
        <FormField
          label="Penerima manfaat"
          name="beneficiary"
          defaultValue={project?.beneficiary ?? ""}
        />
        <FormField
          label="Lokasi"
          name="location"
          defaultValue={project?.location ?? ""}
        />
        <FormField
          label="Tanggal Pelaksanaan"
          name="eventDate"
          type="date"
          defaultValue={project?.eventDate ?? ""}
        />
      </div>
      <FormField
        label="URL Donasi"
        name="donationUrl"
        defaultValue={project?.donationUrl ?? ""}
      />
      <FormFile
        label="Foto Kegiatan (Bisa Banyak)"
        name="imageFiles"
        accept="image/png,image/jpeg,image/webp"
        multiple
        hint="Upload satu atau lebih foto (PNG/JPG/WEBP, maks 5MB per file). Jika diisi, gallery lama akan diganti."
      />
      {(project?.galleryUrls?.length ?? 0) > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Preview gallery saat ini</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {(project?.galleryUrls ?? []).map((url, idx) => (
              <Image
                key={`${url}-${idx}`}
                src={url}
                alt={`${project?.titleId} foto ${idx + 1}`}
                width={960}
                height={540}
                className="h-40 w-full rounded-md border border-border object-cover"
              />
            ))}
          </div>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label="Target donasi"
          name="goalAmount"
          type="number"
          defaultValue={project?.goalAmount?.toString() ?? ""}
        />
        <FormField
          label="Terkumpul"
          name="raisedAmount"
          type="number"
          defaultValue={project?.raisedAmount?.toString() ?? ""}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <PublishStatusField defaultValue={project?.status ?? "DRAFT"} />
        <FormField
          label="Urutan"
          name="sortOrder"
          type="number"
          defaultValue={project?.sortOrder ?? 0}
        />
        <div className="flex items-end pb-2">
          <FormCheckbox
            label="Featured"
            name="featured"
            defaultChecked={project?.featured}
          />
        </div>
      </div>
    </AdminForm>
  );
}
