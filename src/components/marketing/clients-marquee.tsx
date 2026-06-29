"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ensureAbsoluteUrl } from "@/lib/utils";

export type MarqueeClient = {
  id: string;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
};

type Tip = { name: string; x: number; y: number } | null;

type DragState = {
  active: boolean;
  startX: number;
  startScroll: number;
  moved: boolean;
};

function ClientCard({
  client,
  dragRef,
  onMove,
  onLeave,
}: {
  client: MarqueeClient;
  dragRef: React.RefObject<DragState>;
  onMove: (name: string, e: React.MouseEvent) => void;
  onLeave: () => void;
}) {
  const logo = client.logoUrl ? (
    <Image
      src={client.logoUrl}
      alt={client.name}
      width={320}
      height={140}
      draggable={false}
      className="h-28 w-64 object-contain opacity-80 grayscale transition-transform duration-300 ease-out will-change-transform select-none group-hover:scale-150 group-hover:opacity-100 group-hover:grayscale-0"
    />
  ) : (
    <span className="block w-64 text-center text-base font-medium text-(--m-muted) transition-transform duration-300 ease-out select-none group-hover:scale-150 group-hover:text-(--m-accent)">
      {client.name}
    </span>
  );

  const className =
    "group relative z-0 flex h-36 w-72 shrink-0 items-center justify-center transition-[z-index] hover:z-20";

  const handlers = {
    onMouseMove: (e: React.MouseEvent) => onMove(client.name, e),
    onMouseLeave: onLeave,
  };

  if (client.websiteUrl) {
    return (
      <a
        href={ensureAbsoluteUrl(client.websiteUrl)}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={(e) => {
          if (dragRef.current.moved) e.preventDefault();
        }}
        {...handlers}
      >
        {logo}
      </a>
    );
  }

  return (
    <div className={className} {...handlers}>
      {logo}
    </div>
  );
}

export function ClientsMarquee({ clients }: { clients: MarqueeClient[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState>({ active: false, startX: 0, startScroll: 0, moved: false });
  const pausedRef = useRef(false);
  const [tip, setTip] = useState<Tip>(null);

  const handleMove = (name: string, e: React.MouseEvent) =>
    setTip({ name, x: e.clientX, y: e.clientY });

  const wrap = (el: HTMLDivElement) => {
    const half = el.scrollWidth / 2;
    if (half <= 0) return;
    if (el.scrollLeft >= half) el.scrollLeft -= half;
    else if (el.scrollLeft <= 0) el.scrollLeft += half;
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let last = performance.now();
    const speed = 45; // px per detik

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!pausedRef.current && !dragRef.current.active) {
        el.scrollLeft += speed * dt;
        wrap(el);
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
    };
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el || !dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 4) dragRef.current.moved = true;
    el.scrollLeft = dragRef.current.startScroll - dx;
    wrap(el);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    dragRef.current.active = false;
    if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    // reset flag setelah event click sempat dibatalkan
    setTimeout(() => {
      dragRef.current.moved = false;
    }, 0);
  };

  return (
    <>
      <div
        ref={scrollerRef}
        className="no-scrollbar mt-10 flex cursor-grab gap-2 overflow-x-auto overscroll-x-contain py-6 active:cursor-grabbing mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          pausedRef.current = false;
          setTip(null);
        }}
      >
        {[...clients, ...clients].map((client, i) => (
          <div key={`${client.id}-${i}`} aria-hidden={i >= clients.length ? true : undefined}>
            <ClientCard
              client={client}
              dragRef={dragRef}
              onMove={handleMove}
              onLeave={() => setTip(null)}
            />
          </div>
        ))}
      </div>

      {tip && (
        <div
          style={{ left: tip.x, top: tip.y }}
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-[calc(100%+16px)] whitespace-nowrap rounded-md bg-slate-900/95 px-2.5 py-1 text-xs font-medium text-white shadow-lg ring-1 ring-white/10"
        >
          {tip.name}
        </div>
      )}
    </>
  );
}
