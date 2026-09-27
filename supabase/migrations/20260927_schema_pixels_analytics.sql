-- Align schema with the public/admin design:
-- SEO keywords, booking notes, analytics event log.
-- Safe to run on an existing Maison Drape database.

alter table public.categories
  add column if not exists seo_keywords text not null default '';

alter table public.products
  add column if not exists seo_keywords text not null default '';

alter table public.blog_posts
  add column if not exists seo_keywords text not null default '';

alter table public.bookings
  add column if not exists notes text not null default '';

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  event_id text not null unique,
  event_source_url text not null default '',
  source text not null default 'server' check (source in ('client', 'server')),
  platform text not null check (platform in ('meta', 'tiktok', 'gtm', 'internal')),
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'queued' check (status in ('queued', 'sent', 'failed', 'skipped')),
  error text not null default '',
  created_at timestamptz not null default now()
);

alter table public.analytics_events enable row level security;

drop policy if exists "admin read analytics_events" on public.analytics_events;
drop policy if exists "admin write analytics_events" on public.analytics_events;

create policy "admin read analytics_events"
  on public.analytics_events for select
  using (public.is_admin());

create policy "admin write analytics_events"
  on public.analytics_events for all
  using (public.is_admin())
  with check (public.is_admin());

create index if not exists categories_slug_idx on public.categories (slug);
create index if not exists categories_parent_id_idx on public.categories (parent_id);
create index if not exists products_slug_idx on public.products (slug);
create index if not exists products_category_id_idx on public.products (category_id);
create index if not exists products_is_active_idx on public.products (is_active);
create index if not exists products_is_bestseller_idx on public.products (is_bestseller);
create index if not exists product_variants_product_id_idx on public.product_variants (product_id);
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists chat_leads_created_at_idx on public.chat_leads (created_at desc);
create index if not exists chat_leads_status_idx on public.chat_leads (status);
create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
create index if not exists bookings_status_idx on public.bookings (status);
create index if not exists bookings_preferred_date_idx on public.bookings (preferred_date);
create index if not exists blog_posts_slug_idx on public.blog_posts (slug);
create index if not exists blog_posts_published_at_idx on public.blog_posts (published_at desc);
create index if not exists faqs_sort_order_idx on public.faqs (sort_order);
create index if not exists analytics_events_created_at_idx on public.analytics_events (created_at desc);
create index if not exists analytics_events_event_name_idx on public.analytics_events (event_name);

-- Persist pixel / GTM ids inside site_settings.general without overwriting other keys.
update public.site_settings
set value = coalesce(value, '{}'::jsonb)
  || jsonb_build_object(
    'gtm_id', coalesce(value->>'gtm_id', ''),
    'meta_pixel_id', coalesce(value->>'meta_pixel_id', ''),
    'instagram_pixel_id', coalesce(value->>'instagram_pixel_id', ''),
    'tiktok_pixel_id', coalesce(value->>'tiktok_pixel_id', '')
  )
where key = 'general';
