"use client";

import { useCallback, useState, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const LENS = 168;
const ZOOM = 2.4;

export function ImageMagnifier({
  src,
  className,
  children,
}: {
  src: string;
  className?: string;
  children: ReactNode;
}) {
  const [active, setActive] = useState(false);
  const [pos, setPos] = useState({ left: 0, top: 0, x: 0, y: 0, w: 0, h: 0 });

  const onMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height));
    setPos({
      left: x - LENS / 2,
      top: y - LENS / 2,
      x,
      y,
      w: rect.width,
      h: rect.height,
    });
  }, []);

  return (
    <div
      className={cn("relative overflow-hidden touch-none cursor-zoom-in", className)}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        setActive(true);
        onMove(event);
      }}
      onPointerUp={() => setActive(false)}
      onPointerMove={onMove}
    >
      {children}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute z-10 overflow-hidden rounded-full border-2 border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.28)] ring-1 ring-black/10",
          active ? "opacity-100" : "opacity-0"
        )}
        style={{ width: LENS, height: LENS, left: pos.left, top: pos.top }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          draggable={false}
          className="absolute max-w-none object-cover"
          style={{
            width: pos.w * ZOOM,
            height: pos.h * ZOOM,
            left: -(pos.x * ZOOM - LENS / 2),
            top: -(pos.y * ZOOM - LENS / 2),
          }}
        />
      </div>
    </div>
  );
}
