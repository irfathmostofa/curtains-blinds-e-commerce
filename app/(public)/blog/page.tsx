import { BlogList } from "@/components/blog-list";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/section-heading";
import { getBlogPosts } from "@/lib/data/catalog";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Curtains & Blinds Journal",
  description: "Guides on blackout, sunscreen blinds and motorised curtains for Dubai and Abu Dhabi homes.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return (
    <main className="container space-y-6 pt-4 pb-10 md:pt-5">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }]} />
      <SectionHeading as="h1" title="Journal" subtitle="Practical notes on fabric, heat and motors." />
      <BlogList posts={posts} />
    </main>
  );
}
