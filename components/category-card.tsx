"use client";

import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";
import { useLocale } from "@/components/locale-provider";
import { stripHtml } from "@/lib/html";

export function CategoryCard({ category }: { category: Category }) {
  const { t } = useLocale();
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border shadow-sm transition duration-500 hover:-translate-y-1.5 hover:shadow-xl">
      <Link href={`/products/${category.slug}`} className="block">
        <div className="relative aspect-[5/4]">
          <Image
            src={category.image_url}
            alt={t(category.image_alt) || category.image_alt}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent transition duration-500 group-hover:from-ink/85" />
          <div className="absolute bottom-0 p-5 text-ivory transition duration-500 group-hover:translate-y-[-4px]">
            <h3 className="font-serif text-2xl">{t(category.name)}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-ivory/80">{stripHtml(t(category.description))}</p>
          </div>
        </div>
      </Link>
    </article>
  );
}
