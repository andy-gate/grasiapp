import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  size = "md",
}: {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const heights = { sm: 28, md: 36, lg: 48 };

  return (
    <Link href="/" className={cn("flex items-center", className)}>
      <Image
        src="/logo.png"
        alt="Grasia Prima Perfekta"
        width={heights[size] * 3}
        height={heights[size]}
        className="h-auto object-contain"
        style={{ maxHeight: heights[size] }}
        priority
      />
    </Link>
  );
}
