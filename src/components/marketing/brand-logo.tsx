import Image from "next/image";
import NextLink from "next/link";
import { Link as I18nLink } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export const BRAND = {
  name: "Grasia Prima Perfekta",
  logoTransparent: "/logo.png",
  logoOnLight: "/logo_bg.jpg",
  logoNav: "/logo_bg_inv.jpg",
  favicon: "/favicon.ico",
} as const;

export function BrandLogo({
  className,
  size = "md",
  variant = "onDark",
  href = "/",
  link = "i18n",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  /** onDark = transparan, onLight = bg putih, nav = ikon biru untuk menu bar */
  variant?: "onDark" | "onLight" | "nav";
  href?: string;
  link?: "i18n" | "next";
}) {
  const heights = { sm: 28, md: 36, lg: 48 };
  const height = heights[size];
  const LinkComponent = link === "next" ? NextLink : I18nLink;
  const isNav = variant === "nav";
  const onDarkSurface = variant === "onDark";
  const src = isNav
    ? BRAND.logoNav
    : onDarkSurface
      ? BRAND.logoTransparent
      : BRAND.logoOnLight;

  return (
    <LinkComponent
      href={href}
      className={cn("inline-flex shrink-0 items-center", className)}
    >
      <Image
        src={src}
        alt={BRAND.name}
        width={isNav ? height : height * 2.8}
        height={height}
        className={cn(
          "block h-auto w-auto object-contain",
          isNav && "rounded-md",
          onDarkSurface && "drop-shadow-[0_0_10px_rgba(107,159,255,0.25)]",
        )}
        style={
          isNav
            ? { width: height, height, maxWidth: height, maxHeight: height }
            : { maxHeight: height, maxWidth: height * 2.8 }
        }
        priority={isNav || size !== "sm"}
      />
    </LinkComponent>
  );
}
