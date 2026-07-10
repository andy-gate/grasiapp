"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProjectGallerySlider({
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
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const goPrev = () =>
    setIndex((prev) => (prev - 1 + normalized.length) % normalized.length);
  const goNext = () => setIndex((prev) => (prev + 1) % normalized.length);

  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft")
        setIndex((prev) => (prev - 1 + normalized.length) % normalized.length);
      if (e.key === "ArrowRight")
        setIndex((prev) => (prev + 1) % normalized.length);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, normalized.length]);

  if (normalized.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="relative aspect-video overflow-hidden rounded-xl border border-(--m-border) bg-(--m-media-bg)">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="block h-full w-full cursor-zoom-in"
          aria-label="Lihat gambar penuh"
        >
          <Image
            src={normalized[index]}
            alt={`${altBase} screenshot ${index + 1}`}
            width={1280}
            height={720}
            className="h-full w-full object-cover"
            priority
          />
        </button>
        {normalized.length > 1 && (
          <>
            <Button
              type="button"
              size="icon-sm"
              variant="secondary"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white hover:bg-black/80"
              onClick={goPrev}
              aria-label="Previous screenshot"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="secondary"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white hover:bg-black/80"
              onClick={goNext}
              aria-label="Next screenshot"
            >
              <ChevronRight className="size-4" />
            </Button>
          </>
        )}
      </div>

      {normalized.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth snap-x snap-mandatory">
          {normalized.map((image, idx) => (
            <button
              key={`${image}-${idx}`}
              type="button"
              onClick={() => setIndex(idx)}
              className={cn(
                "shrink-0 snap-start overflow-hidden rounded-md border border-(--m-border) transition",
                idx === index ? "ring-2 ring-brand-blue-light" : "opacity-70 hover:opacity-100",
              )}
              aria-label={`Open screenshot ${idx + 1}`}
            >
              <Image
                src={image}
                alt={`${altBase} thumb ${idx + 1}`}
                width={240}
                height={135}
                className="h-16 w-28 object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm md:p-10"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${altBase} screenshot ${index + 1}`}
        >
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="absolute right-4 top-4 z-10 bg-white/10 text-white hover:bg-white/20"
            onClick={() => setLightboxOpen(false)}
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
                  goPrev();
                }}
                aria-label="Previous screenshot"
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
                  goNext();
                }}
                aria-label="Next screenshot"
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
              src={normalized[index]}
              alt={`${altBase} screenshot ${index + 1}`}
              width={1920}
              height={1080}
              className="max-h-[85vh] w-auto rounded-lg object-contain"
            />
            {normalized.length > 1 && (
              <p className="mt-3 text-center text-sm text-slate-400">
                {index + 1} / {normalized.length}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
