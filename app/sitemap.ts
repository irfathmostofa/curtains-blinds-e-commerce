import type { MetadataRoute } from "next";
import { getBlogPosts, getCategories, getProducts } from "@/lib/data/catalog";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, posts] = await Promise.all([getProducts(), getCategories(), getBlogPosts()]);
  const staticRoutes = [
    "",
    "/products",
    "/get-estimate",
    "/book",
    "/about-us",
    "/faqs",
    "/blog",
    "/partnerships",
    "/privacy-policy",
    "/terms-of-use",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  return [
    ...staticRoutes,
    ...categories.map((c) => ({ url: `${SITE_URL}/products/${c.slug}`, lastModified: new Date() })),
    ...products
      .filter((p) => p.category)
      .map((p) => ({ url: `${SITE_URL}/products/${p.category!.slug}/${p.slug}`, lastModified: new Date(p.created_at) })),
    ...posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: new Date(p.published_at || Date.now()) })),
  ];
}
