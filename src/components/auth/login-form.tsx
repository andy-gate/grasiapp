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
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
      <BrandLogo size="lg" className="mb-8" />
      <Card className="w-full max-w-md border-white/10 bg-[#0d1117]/80 text-white backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">{title ?? t("title")}</CardTitle>
          <CardDescription className="text-slate-400">
            {description ?? t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">{t("identifier")}</Label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                defaultValue="admin"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full border-0 bg-gradient-to-r from-brand-indigo to-brand-blue shadow-lg shadow-brand-blue/25 hover:opacity-90"
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
