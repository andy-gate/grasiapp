"use client";

import {
  createCharityProject,
  updateCharityProject,
} from "@/actions/admin/charity";
import { AdminForm } from "@/components/admin/admin-form";
import {
  BilingualPair,
  FormCheckbox,
  FormField,
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
      <div className="grid gap-4 md:grid-cols-2">
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
      </div>
      <FormField
        label="URL Donasi"
        name="donationUrl"
        defaultValue={project?.donationUrl ?? ""}
      />
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
