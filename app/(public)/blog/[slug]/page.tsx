import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getBlogPost, getBlogPosts } from "@/lib/data/catalog";
import { articleJsonLd, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);
  if (!post) return {};
  return buildMetadata({
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.cover_image_url,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);
  if (!post) notFound();
  return (
    <main className="container space-y-8 py-10">
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.excerpt,
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
          {post.published_at ? ` · ${new Date(post.published_at).toLocaleDateString("en-AE")}` : ""}
        </p>
        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl">
          <Image src={post.cover_image_url} alt={post.cover_image_alt} fill className="object-cover" priority sizes="800px" />
        </div>
        <div className="prose prose-stone max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </main>
  );
}
