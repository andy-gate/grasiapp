"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BrandLogo } from "@/components/marketing/brand-logo";

export function LoginForm({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  const t = useTranslations("login");
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      identifier: form.get("identifier"),
      password: form.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError(t("error"));
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex w-full max-w-2xl flex-col items-center justify-center px-6 py-0">
      <BrandLogo size="lg" className="mb-8 md:mb-10 md:scale-110" />
      <Card className="w-full max-w-xl border-(--m-border) bg-(--m-card-strong) text-(--m-strong) backdrop-blur-xl">
        <CardHeader className="space-y-2 p-8 pb-4">
          <CardTitle className="text-2xl text-(--m-strong) md:text-3xl">
            {title ?? t("title")}
          </CardTitle>
          <CardDescription className="text-base text-(--m-muted)">
            {description ?? t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-2">
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-base">
                {t("identifier")}
              </Label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                defaultValue="admin"
                className="h-12 text-base"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base">
                {t("password")}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="h-12 text-base"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button
              type="submit"
              className="h-12 w-full border-0 bg-linear-to-r from-brand-indigo to-brand-blue text-base shadow-lg shadow-brand-blue/25 hover:opacity-90"
              disabled={loading}
            >
              {loading ? t("loading") : t("submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
