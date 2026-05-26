"use client";

import { useActionState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { submitContactForm } from "@/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const t = useTranslations("contact");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [state, action, pending] = useActionState(submitContactForm, {
    ok: false,
  });

  if (state.ok) {
    return (
      <p className="rounded-lg border border-brand-blue/30 bg-brand-blue/10 p-4 text-brand-blue-light">
        {t("success")}
      </p>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="locale" value={locale} />
      <div className="space-y-2">
        <Label htmlFor="name">{t("name")}</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">{t("phone")}</Label>
        <Input id="phone" name="phone" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">{t("message")}</Label>
        <Textarea id="message" name="message" rows={5} required />
      </div>
      <Button
        type="submit"
        disabled={pending}
        className="w-full border-0 bg-gradient-to-r from-brand-indigo to-brand-blue shadow-lg shadow-brand-blue/25 hover:opacity-90"
      >
        {tc("send")}
      </Button>
    </form>
  );
}
