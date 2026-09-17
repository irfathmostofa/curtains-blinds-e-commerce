"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { ImageAsset } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ImageGallery({ images }: { images: ImageAsset[] }) {
  const [active, setActive] = useState(0);
  if (!images.length) return null;
  const current = images[active];

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-secondary">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.url}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={current.url}
              alt={current.alt}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>
      {images.length > 1 ? (
        <ul className="grid grid-cols-4 gap-2" aria-label="Product images">
          {images.map((image, i) => (
            <li key={image.url}>
              <button
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "relative aspect-square w-full overflow-hidden rounded-xl border transition hover:opacity-90",
                  i === active ? "border-accent ring-2 ring-accent/30" : "border-transparent"
                )}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === active}
              >
                <Image src={image.thumbnailUrl || image.url} alt={image.alt} fill className="object-cover" sizes="120px" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
