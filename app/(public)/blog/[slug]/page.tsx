import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getBlogPost, getBlogPosts } from "@/lib/data/catalog";
import { articleJsonLd, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { CTABanner } from "@/components/cta-banner";
import { HtmlContent } from "@/components/html-content";
import { stripHtml } from "@/lib/html";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getBlogPost(params.slug);
  if (!post) return {};
  return buildMetadata({
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || stripHtml(post.content).slice(0, 160),
    path: `/blog/${post.slug}`,
    image: post.cover_image_url,
    type: "article",
    keywords: post.seo_keywords || post.title,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getBlogPost(params.slug);
  if (!post) notFound();
  return (
    <main className="container space-y-6 pt-4 pb-10 md:pt-5">
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.excerpt || stripHtml(post.content).slice(0, 160),
          image: post.cover_image_url,
          path: `/blog/${post.slug}`,
          author: post.author,
          date: post.published_at || new Date().toISOString(),
        })}
      />
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />
      <article className="mx-auto max-w-3xl space-y-6">
        <h1 className="font-serif text-4xl">{post.title}</h1>
        <p className="text-sm text-muted-foreground">
          {post.author}
          {post.published_at
            ? ` · ${new Date(post.published_at).toLocaleDateString("en-AE")}`
            : ""}
        </p>
        {post.cover_image_url ? (
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl">
            <Image
              src={post.cover_image_url}
              alt={post.cover_image_alt || post.title}
              fill
              className="object-cover"
              priority
              sizes="800px"
            />
          </div>
        ) : null}
        <HtmlContent html={post.content} className="text-foreground" />
      </article>
      <CTABanner
        title="See these fabrics in your light"
        subtitle="A complimentary visit covers measuring, samples and a written estimate."
        buttonLabel="Book a free visit"
        buttonHref="/book"
      />
    </main>
  );
}
