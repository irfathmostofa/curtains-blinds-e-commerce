Build a production-ready, SEO-optimized e-commerce + lead-generation website for a curtains & blinds business, using Next.js (App Router), Tailwind CSS, and Supabase (Postgres + Auth + Storage). Prioritize maximum component reusability, a config-driven admin panel, strong technical SEO, cookie-based session/consent handling, and optimized image uploads.

=== TECH STACK ===
- Next.js 14+ (App Router, Server Components, Server Actions)
- TypeScript (strict mode)
- Tailwind CSS + shadcn/ui for base primitives
- Supabase: Postgres (with RLS), Auth (admin login via @supabase/ssr), Storage (product/blog images)
- sharp for server-side image processing before upload
- next/image for all images (WebP, responsive srcset)
- Dynamic app/sitemap.ts + app/robots.ts
- Zod for schema validation on all forms
- react-hook-form for forms
- Framer Motion for light animations (hero, carousels)
- next-intl (optional) if EN/AR bilingual support is needed later — design components to be i18n-ready even if only EN ships first

=== SITE MAP (public) ===
1. Home — hero, trust badges (ratings/reviews count), "why choose us" feature grid, bestseller product carousel, testimonial carousel, WhatsApp CTA block, partner logos, SEO content section (long-form, keyword-rich), footer
2. Products listing (/products) — category filters, price sort, grid of ProductCard
3. Category pages (/products/[category]) — e.g. curtains-and-drapes, blinds-and-shades, motorized
4. Product detail (/products/[category]/[slug]) — gallery, variant/size selector, price table, fabric options, related products, FAQ accordion, "Book a Free Visit" CTA
5. Get Estimate (/get-estimate) — multi-step lead form (room count, product type, budget, contact info) → stored as a "lead" in Supabase
6. Book a Free Visit (/book) — booking form with date/time slot picker, location (Dubai/Abu Dhabi), address, contact info → stored as "booking"
7. About Us (/about-us)
8. FAQs (/faqs) — accordion, pulled from CMS table
9. Blog (/blog, /blog/[slug]) — CMS-driven articles for SEO
10. Partnerships / Trade program (/partnerships)
11. Privacy Policy, Terms of Use — CMS-driven static pages
12. Contact info in footer (phone, WhatsApp, email, map embed per location)

=== REUSABLE COMPONENT LIBRARY (build these once, use everywhere) ===
- <Button variant="primary|secondary|outline|ghost" size="sm|md|lg" />
- <Card /> — base card used for products, blog posts, testimonials
- <ProductCard product={} /> — image, name, "From AED X", CTA
- <CategoryCard /> — icon/image + label, links to category
- <PriceTag amount currency="AED" note="From" />
- <Badge /> — e.g. "12-Month Warranty", "Same-Day Visit"
- <TestimonialCarousel items={} />
- <PartnerLogosStrip logos={} />
- <FAQAccordion items={} /> — renders real text in DOM (crawlable), not JS-injected only
- <CTABanner title subtitle buttonLabel buttonHref /> — reused across product pages, home, footer
- <Navbar /> + <MobileMenu /> — config-driven nav links pulled from Supabase (site_settings.nav_links)
- <Footer /> — config-driven contact info + social links pulled from site_settings, uses <address> for location info
- <WhatsAppFloatingButton phone={} />
- <Breadcrumbs items={} /> — semantic <nav aria-label="Breadcrumb"><ol>, also emits BreadcrumbList JSON-LD
- <ImageGallery images={} /> — for product detail
- <VariantSelector variants={} onSelect={} /> — size/fabric/color pickers
- <MultiStepForm steps={} /> — generic wrapper used for both Get Estimate and Book a Visit flows
- <SectionHeading eyebrow title subtitle />
- <CookieConsentBanner /> — first-visit consent banner, gates analytics/marketing scripts
- <ImageUploader /> (admin) — drag-drop, preview, progress bar, used across every entity's form
- <SEOHead /> helper (or generateMetadata utility) — generates title, description, canonical, OG tags, JSON-LD from a single "seoConfig" object per page/entity

Design every component to accept data via props/config objects (not hardcoded content) so the SAME component renders differently based on Supabase-driven content — one <ProductCard>, one <CTABanner>, one <FAQAccordion> used across 10+ pages.

=== SUPABASE SCHEMA (core tables) ===
- categories (id, name, slug, description, image_url, image_alt, parent_id, sort_order, seo_title, seo_description)
- products (id, category_id, name, slug, description, base_price, images jsonb [{url, alt}], fabric_options jsonb, is_bestseller, is_active, seo_title, seo_description, created_at)
- product_variants (id, product_id, size_label, price, sku)
- leads (id, name, phone, email, product_interest, budget_range, message, source, status, created_at)
- bookings (id, name, phone, email, location, address, preferred_date, preferred_time_slot, status, created_at)
- testimonials (id, customer_name, rating, review_text, source, is_featured, created_at)
- blog_posts (id, title, slug, excerpt, content, cover_image_url, cover_image_alt, author, published_at, seo_title, seo_description)
- faqs (id, question, answer, category, sort_order)
- partners (id, name, logo_url, logo_alt, sort_order)
- site_settings (key, value jsonb) — nav links, footer contact info, social links, WhatsApp number, business hours, locations served
- admin_users (id, email, role) — tied to Supabase Auth

Enable RLS on every table: public read on published/active rows only; write access restricted to authenticated admin role via a policy checking admin_users.

=== ADMIN PANEL (/admin, protected via Supabase Auth + middleware) ===
Build a config-driven generic CRUD engine (one DataTable + one FormBuilder component driven by a schema/config object per entity) so adding a new manageable entity later doesn't require new UI code — just a new config. Screens:
- Dashboard — lead count, bookings this week, top products, simple charts
- Products manager — CRUD, drag-to-reorder, image upload via <ImageUploader />, variant/pricing editor, toggle bestseller/active, required alt-text field per image
- Categories manager — CRUD, nested categories, image upload
- Leads inbox — table with filters/status (new/contacted/converted), export CSV
- Bookings calendar/table — status management, location filter
- Testimonials manager — CRUD, feature toggle
- Blog CMS — rich text editor (e.g. Tiptap), SEO fields per post, publish/draft toggle
- FAQs manager — CRUD, category grouping
- Partners/logos manager — CRUD, image upload
- Site settings — edit nav links, footer, contact numbers, WhatsApp number, business hours (structured JSON forms, no code changes needed)
- Users/roles — manage admin accounts

=== COOKIES ===
- Use @supabase/ssr (createServerClient/createBrowserClient) so Supabase Auth sessions live in httpOnly cookies, not localStorage — required for correct behavior with Server Components/middleware.
- Add middleware.ts that refreshes the Supabase session cookie on every request and protects /admin/* routes (redirect to /admin/login if no valid session).
- <CookieConsentBanner /> shown on first visit; store choice in a first-party cookie (cookie_consent=accepted|rejected, 1-year expiry). Only load analytics/marketing scripts (GTM, Meta Pixel, etc.) after consent is accepted.
- Persist in-progress multi-step form data (Get Estimate / Book a Visit) in a short-lived cookie (estimate_draft) so users don't lose progress on refresh; clear on successful submission.
- Optional recently_viewed_products cookie (array of product slugs, capped at 10) read server-side to power a "Recently Viewed" section without client JS.
- Store locale preference in a cookie if/when EN/AR is added (NEXT_LOCALE).

=== IMAGE UPLOAD & OPTIMIZATION (Supabase Storage) ===
- All image uploads (products, categories, blog covers, testimonials, partner logos) go through a single server-side upload utility — never let the browser upload raw files directly.
- On upload, process with sharp before sending to Storage:
  - Resize to sensible max dimensions per use case (product images max 1600px wide + a 400px thumbnail variant, stored separately).
  - Convert to WebP.
  - Compress at quality: 80 → sharp: .webp({ quality: 80 }).
  - Strip EXIF metadata.
- Store in a Supabase Storage bucket (e.g. product-images, blog-images) with a clean, slug-based filename (not the original messy filename) — descriptive filenames also help SEO.
- Save the public Storage URL + a required alt_text field together in the DB row. alt_text is mandatory in every admin image form, defaulting to a sensible auto-suggestion (e.g. "{product name} - {category}") the admin can edit.
- Use next/image everywhere on the frontend with proper sizes and priority (only on the LCP/hero image) so Next.js layers its own responsive optimization on top of the pre-compressed WebP source.
- One reusable <ImageUploader /> admin component used across every entity's form instead of duplicating upload logic per screen.

=== SEO REQUIREMENTS ===
- Static generation (SSG) with ISR (revalidate) for product, category, and blog pages
- Dynamic generateMetadata() per page using each entity's seo_title/seo_description, with sensible fallback defaults
- JSON-LD structured data: Organization + LocalBusiness (per location: Dubai, Abu Dhabi) on home, Product schema on product pages (price, currency, availability, rating), BreadcrumbList sitewide, FAQPage schema on FAQ/product pages, Article schema on blog posts
- Auto-generated sitemap.xml (app/sitemap.ts) pulling live slugs from Supabase
- robots.txt via app/robots.ts
- Canonical URLs on every page
- OpenGraph + Twitter card metadata per page

=== SEO-FRIENDLY SEMANTIC HTML (enforce everywhere, not just metadata) ===
- <header> for site header/nav, <nav aria-label="Main navigation"> for nav links
- <main> wrapping the unique content of each page (exactly one per page)
- <section> for distinct homepage blocks (hero, features, bestsellers, testimonials, partners, SEO content)
- <article> for each blog post and each product card in a grid
- <footer> with <address> for contact/location info
- Exactly one <h1> per page (product name on product pages, page title elsewhere); <h2> for major sections, <h3> for sub-items — never skip levels or use headings purely for styling
- Real <a>/<Link> elements with descriptive text (no "click here"); real <button> for non-link interactive elements
- Every image has a meaningful, non-empty alt attribute pulled from alt_text
- Breadcrumbs as <nav aria-label="Breadcrumb"><ol>, paired with BreadcrumbList JSON-LD
- FAQ text rendered directly in the DOM (crawlable), paired with FAQPage JSON-LD
- Product price rendered as visible text (not image/canvas), paired with Product JSON-LD
- Render primary content via Server Components/SSG — avoid client-only rendering that leaves an empty shell for crawlers

=== NON-FUNCTIONAL ===
- Mobile-first responsive design
- Accessible components (keyboard nav, ARIA labels on carousels/accordions)
- Environment-based config (.env for Supabase keys, WhatsApp number, analytics IDs)
- Error boundaries + loading skeletons for all data-fetching routes
- Form submissions protected with basic honeypot/rate-limiting against spam

=== BUILD ORDER ===
1. Supabase schema + RLS policies
2. Cookie/session middleware (@supabase/ssr)
3. Reusable component library
4. Public pages consuming components
5. Image upload pipeline (sharp + Storage + ImageUploader)
6. Admin CRUD engine
7. SEO layer (metadata, JSON-LD, sitemap, semantic HTML pass)
8. Polish (animations, loading states, accessibility pass, cookie consent banner)