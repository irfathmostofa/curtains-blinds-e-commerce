"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { useLocale } from "@/components/locale-provider";
import { stripHtml } from "@/lib/html";
import type { BlogPost } from "@/lib/types";

function haystack(post: BlogPost) {
  return [post.title, post.excerpt, stripHtml(post.content), post.author, post.seo_keywords]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function BlogList({ posts }: { posts: BlogPost[] }) {
  const { t } = useLocale();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    const terms = q.split(/\s+/).filter(Boolean);
    return posts.filter((post) => {
      const text = haystack(post);
      return terms.every((term) => text.includes(term));
    });
  }, [posts, query]);

  return (
    <div className="space-y-6">
      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("Search articles")}
          aria-label={t("Search articles")}
          className="pl-10"
        />
      </div>
      {filtered.length ? (
        <Stagger className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <StaggerItem key={post.id}>
              <article className="group overflow-hidden rounded-2xl border bg-card transition duration-500 hover:-translate-y-1.5 hover:shadow-xl">
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.cover_image_url}
                      alt={post.cover_image_alt}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-110"
                      sizes="(min-width:768px) 33vw, 100vw"
                    />
                  </div>
                  <div className="space-y-2 p-5">
                    <h2 className="font-serif text-2xl">{t(post.title)}</h2>
                    <p className="text-sm text-muted-foreground">{t(post.excerpt)}</p>
                  </div>
                </Link>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <p className="rounded-2xl border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
          {t("No articles match your search.")}
        </p>
      )}
    </div>
  );
}
