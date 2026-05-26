"use client";

import { createPage, updatePage } from "@/actions/admin/pages";
import { AdminForm } from "@/components/admin/admin-form";
import {
  BilingualPair,
  FormField,
  PublishStatusField,
} from "@/components/admin/form-fields";
import type { Page } from "@/generated/prisma/client";

export function PageForm({ page }: { page?: Page }) {
  const action = page ? updatePage.bind(null, page.id) : createPage;

  return (
    <AdminForm action={action} cancelHref="/admin/pages">
      <FormField label="Slug" name="slug" defaultValue={page?.slug} required />
      <BilingualPair
        base="title"
        label="Judul"
        values={{ id: page?.titleId ?? "", en: page?.titleEn ?? "" }}
      />
      <BilingualPair
        base="body"
        label="Body"
        values={{ id: page?.bodyId ?? "", en: page?.bodyEn ?? "" }}
        multiline
      />
      <BilingualPair
        base="seoTitle"
        label="SEO Title"
        values={{ id: page?.seoTitleId ?? "", en: page?.seoTitleEn ?? "" }}
      />
      <BilingualPair
        base="seoDesc"
        label="SEO Description"
        values={{ id: page?.seoDescId ?? "", en: page?.seoDescEn ?? "" }}
        multiline
      />
      <PublishStatusField defaultValue={page?.status ?? "DRAFT"} />
    </AdminForm>
  );
}
