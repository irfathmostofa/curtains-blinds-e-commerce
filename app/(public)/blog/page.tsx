import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/section-heading";
import { getBlogPosts } from "@/lib/data/catalog";
import { buildMetadata } from "@/lib/seo";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Curtains & Blinds Journal",
  description: "Guides on blackout, sunscreen blinds and motorised curtains for Dubai and Abu Dhabi homes.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return (
    <main className="container space-y-8 py-10">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }]} />
      <SectionHeading as="h1" title="Journal" subtitle="Practical notes on fabric, heat and motors." />
      <Stagger className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
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
                  <h2 className="font-serif text-2xl">{post.title}</h2>
                  <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                </div>
              </Link>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </main>
  );
}
