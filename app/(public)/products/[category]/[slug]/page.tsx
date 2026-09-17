import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CTABanner } from "@/components/cta-banner";
import { FAQAccordion } from "@/components/faq-accordion";
import { ImageGallery } from "@/components/image-gallery";
import { ProductCard } from "@/components/product-card";
import { ProductOptions } from "@/components/product-options";
import { RememberProduct } from "@/components/remember-product";
import {
  getFaqs,
  getProductBySlug,
  getProducts,
  getRelatedProducts,
  getSiteSettings,
} from "@/lib/data/catalog";
import { buildMetadata, faqJsonLd, productJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await getProducts();
  return products
    .filter((p) => p.category)
    .map((p) => ({ category: p.category!.slug, slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { category: string; slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  return buildMetadata({
    title: product.seo_title || product.name,
    description: product.seo_description || product.description.slice(0, 160),
    path: `/products/${params.category}/${product.slug}`,
    image: product.images[0]?.url,
    type: "product",
  });
}

export default async function ProductPage({ params }: { params: { category: string; slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product || product.category?.slug !== params.category) notFound();

  const [related, faqs, settings] = await Promise.all([
    getRelatedProducts(product),
    getFaqs("products"),
    getSiteSettings(),
  ]);

  const path = `/products/${params.category}/${product.slug}`;

  return (
    <main className="container space-y-12 py-10">
      <RememberProduct slug={product.slug} />
      <JsonLd
        data={productJsonLd({
          name: product.name,
          description: product.description,
          image: product.images[0]?.url || "",
          price: product.base_price,
          path,
          rating: settings.trust.rating,
          reviewCount: settings.trust.reviews,
        })}
      />
      <JsonLd data={faqJsonLd(faqs)} />
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: product.category?.name || "Category", path: `/products/${params.category}` },
          { name: product.name, path },
        ]}
      />
      <div className="grid gap-10 lg:grid-cols-2">
        <ImageGallery images={product.images} />
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.2em] text-accent">{product.category?.name}</p>
          <h1 className="font-serif text-4xl">{product.name}</h1>
          <p className="leading-relaxed text-muted-foreground">{product.description}</p>
          <ProductOptions product={product} />
        </div>
      </div>
      <section className="space-y-4">
        <h2 className="font-serif text-3xl">Questions we hear on this range</h2>
        <FAQAccordion items={faqs} />
      </section>
      {related.length ? (
        <section className="space-y-6">
          <h2 className="font-serif text-3xl">Related pieces</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}
      <CTABanner
        title="See these fabrics in your light"
        subtitle="A complimentary visit covers measuring, samples and a written estimate."
        buttonLabel="Book a free visit"
        buttonHref="/book"
      />
    </main>
  );
}
