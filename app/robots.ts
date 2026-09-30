import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/data/catalog";
import { resolveSiteUrl } from "@/lib/site";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  const siteUrl = resolveSiteUrl(settings);
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/admin/"] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
