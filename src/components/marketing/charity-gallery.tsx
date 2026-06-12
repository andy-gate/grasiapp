"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CharityGallery({
  images,
  altBase,
}: {
  images: string[];
  altBase: string;
}) {
  const normalized = useMemo(
    () => images.filter((item, idx, arr) => item && arr.indexOf(item) === idx),
    [images],
  );
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const open = lightboxIndex !== null;

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft")
        setLightboxIndex((prev) =>
          prev === null ? prev : (prev - 1 + normalized.length) % normalized.length,
        );
      if (e.key === "ArrowRight")
        setLightboxIndex((prev) =>
          prev === null ? prev : (prev + 1) % normalized.length,
        );
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, normalized.length]);

  if (normalized.length === 0) return null;

  const [first, ...rest] = normalized;

  return (
    <>
      {/* Mosaic: foto utama besar di kiri, sisanya grid di kanan */}
      <div
        className={cn(
          "grid gap-3",
          rest.length > 0 ? "md:grid-cols-3" : "md:grid-cols-1",
        )}
      >
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          className={cn(
            "group relative aspect-video cursor-zoom-in overflow-hidden rounded-xl border border-(--m-border) bg-(--m-media-bg)",
            rest.length > 0 && "md:col-span-2 md:aspect-4/3",
          )}
          aria-label={`${altBase} foto 1`}
        >
          <Image
            src={first}
            alt={`${altBase} foto 1`}
            width={1280}
            height={960}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            priority
          />
        </button>
        {rest.length > 0 && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
            {rest.slice(0, 4).map((image, idx) => {
              const realIdx = idx + 1;
              const hiddenCount = rest.length - 4;
              const isLastVisible = idx === 3 && hiddenCount > 0;
              return (
                <button
                  key={`${image}-${realIdx}`}
                  type="button"
                  onClick={() => setLightboxIndex(realIdx)}
                  className="group relative aspect-video cursor-zoom-in overflow-hidden rounded-lg border border-(--m-border) bg-(--m-media-bg)"
                  aria-label={`${altBase} foto ${realIdx + 1}`}
                >
                  <Image
                    src={image}
                    alt={`${altBase} foto ${realIdx + 1}`}
                    width={640}
                    height={360}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  {isLastVisible && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-lg font-semibold text-white">
                      +{hiddenCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm md:p-10"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${altBase} foto ${lightboxIndex + 1}`}
        >
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="absolute right-4 top-4 z-10 bg-white/10 text-white hover:bg-white/20"
            onClick={() => setLightboxIndex(null)}
            aria-label="Tutup"
          >
            <X className="size-5" />
          </Button>

          {normalized.length > 1 && (
            <>
              <Button
                type="button"
                size="icon-lg"
                variant="secondary"
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-white/10 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(
                    (lightboxIndex - 1 + normalized.length) % normalized.length,
                  );
                }}
                aria-label="Foto sebelumnya"
              >
                <ChevronLeft className="size-5" />
              </Button>
              <Button
                type="button"
                size="icon-lg"
                variant="secondary"
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-white/10 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex + 1) % normalized.length);
                }}
                aria-label="Foto berikutnya"
              >
                <ChevronRight className="size-5" />
              </Button>
            </>
          )}

          <div
            className="max-h-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={normalized[lightboxIndex]}
              alt={`${altBase} foto ${lightboxIndex + 1}`}
              width={1920}
              height={1080}
              className="max-h-[85vh] w-auto rounded-lg object-contain"
            />
            {normalized.length > 1 && (
              <p className="mt-3 text-center text-sm text-slate-400">
                {lightboxIndex + 1} / {normalized.length}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
