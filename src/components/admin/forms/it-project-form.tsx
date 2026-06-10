"use client";

import Image from "next/image";
import {
  createItProject,
  updateItProject,
} from "@/actions/admin/it-projects";
import { AdminForm } from "@/components/admin/admin-form";
import {
  BilingualPair,
  FormCheckbox,
  FormFile,
  FormField,
  FormMultiCheckbox,
  FormSelect,
  PublishStatusField,
} from "@/components/admin/form-fields";
import type {
  Client,
  ItCategory,
  ItProject,
  TechStackItem,
} from "@/generated/prisma/client";

type ItProjectWithRelations = ItProject & {
  categories: ItCategory[];
  techStackItems: TechStackItem[];
};

export function ItProjectForm({
  project,
  categories,
  clients,
  techStackItems,
}: {
  project?: ItProjectWithRelations;
  categories: ItCategory[];
  clients: Client[];
  techStackItems: TechStackItem[];
}) {
  const action = project
    ? updateItProject.bind(null, project.id)
    : createItProject;

  return (
    <AdminForm
      action={action}
      cancelHref="/admin/it-projects"
      submitLabel={project ? "Perbarui" : "Buat"}
    >
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
      <FormMultiCheckbox
        label="Kategori"
        name="categoryIds"
        hint="Pilih satu atau lebih kategori proyek."
        defaultValues={project?.categories.map((c) => c.id) ?? []}
        options={categories.map((c) => ({
          value: c.id,
          label: c.nameId,
        }))}
      />
      <FormSelect
        label="Klien"
        name="clientId"
        placeholder="Pilih klien (opsional)"
        defaultValue={project?.clientId ?? ""}
        options={clients.map((c) => ({
          value: c.id,
          label: c.nameId,
        }))}
      />
      <FormMultiCheckbox
        label="Tech stack"
        name="techStackIds"
        hint="Pilih satu atau lebih teknologi yang dipakai proyek ini."
        defaultValues={project?.techStackItems.map((item) => item.id) ?? []}
        options={techStackItems.map((item) => ({
          value: item.id,
          label: item.nameId,
        }))}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <FormField
          label="Website"
          name="websiteUrl"
          defaultValue={project?.websiteUrl ?? ""}
        />
        <FormField
          label="App Store"
          name="appStoreUrl"
          defaultValue={project?.appStoreUrl ?? ""}
        />
        <FormField
          label="Play Store"
          name="playStoreUrl"
          defaultValue={project?.playStoreUrl ?? ""}
        />
      </div>
      <FormFile
        label="Screenshot Aplikasi (Bisa Banyak)"
        name="screenshotFiles"
        accept="image/png,image/jpeg,image/webp"
        multiple
        hint="Upload satu atau lebih screenshot (PNG/JPG/WEBP, maks 5MB per file). Jika diisi, gallery lama akan diganti."
      />
      {(project?.galleryUrls?.length ?? 0) > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Preview gallery saat ini</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {(project?.galleryUrls ?? []).map((url, idx) => (
              <Image
                key={`${url}-${idx}`}
                src={url}
                alt={`${project.titleId} screenshot ${idx + 1}`}
                width={960}
                height={540}
                className="h-40 w-full rounded-md border border-border object-cover"
              />
            ))}
          </div>
        </div>
      )}
      {(project?.galleryUrls?.length ?? 0) === 0 && project?.screenshotUrl && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Preview screenshot saat ini</p>
          <Image
            src={project.screenshotUrl}
            alt={project.titleId}
            width={960}
            height={540}
            className="h-40 w-full rounded-md border border-border object-cover sm:max-w-md"
          />
        </div>
      )}
      <FormField
        label="Tahun"
        name="year"
        type="number"
        defaultValue={project?.year ?? ""}
      />
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
