"use client";

import {
  createItProject,
  updateItProject,
} from "@/actions/admin/it-projects";
import { AdminForm } from "@/components/admin/admin-form";
import {
  BilingualPair,
  FormCheckbox,
  FormField,
  FormTextarea,
  PublishStatusField,
} from "@/components/admin/form-fields";
import type { ItCategory, ItProject } from "@/generated/prisma/client";

export function ItProjectForm({
  project,
  categories,
}: {
  project?: ItProject;
  categories: ItCategory[];
}) {
  const action = project
    ? updateItProject.bind(null, project.id)
    : createItProject;
  const techStack = Array.isArray(project?.techStack)
    ? (project.techStack as string[]).join(", ")
    : "";

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
      <div className="space-y-2">
        <label htmlFor="categoryId" className="text-sm font-medium">
          Kategori
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          defaultValue={project?.categoryId}
          className="flex h-9 w-full rounded-md border border-input px-3 text-sm"
        >
          <option value="">Pilih kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nameId}
            </option>
          ))}
        </select>
      </div>
      <FormField
        label="Klien"
        name="clientName"
        defaultValue={project?.clientName ?? ""}
      />
      <FormField
        label="Tech stack"
        name="techStack"
        defaultValue={techStack}
        hint="Pisahkan dengan koma, contoh: Next.js, PostgreSQL"
      />
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Demo URL" name="demoUrl" defaultValue={project?.demoUrl ?? ""} />
        <FormField label="Repo URL" name="repoUrl" defaultValue={project?.repoUrl ?? ""} />
      </div>
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
