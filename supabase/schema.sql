-- Maison Drape schema + RLS. Run in the Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique not null,
  role text not null default 'admin' check (role in ('admin', 'editor'))
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text not null default '',
  image_url text not null default '',
  image_alt text not null default '',
  parent_id uuid references public.categories (id) on delete set null,
  sort_order int not null default 0,
  seo_title text not null default '',
  seo_description text not null default '',
  seo_keywords text not null default ''
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories (id) on delete set null,
  name text not null,
  slug text unique not null,
  description text not null default '',
  base_price numeric not null default 0,
  images jsonb not null default '[]'::jsonb,
  fabric_options jsonb not null default '[]'::jsonb,
  is_bestseller boolean not null default false,
  is_active boolean not null default true,
  seo_title text not null default '',
  seo_description text not null default '',
  seo_keywords text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  size_label text not null,
  price numeric not null,
  sku text not null
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  product_interest text not null default '',
  budget_range text not null default '',
  message text not null default '',
  source text not null default 'website',
  status text not null default 'new' check (status in ('new', 'contacted', 'converted')),
  created_at timestamptz not null default now()
);

create table if not exists public.chat_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  phone text not null default '',
  email text not null default '',
  product_interest text not null default '',
  rooms text not null default '',
  location text not null default '',
  estimate_min numeric not null default 0,
  estimate_max numeric not null default 0,
  booking_date text not null default '',
  booking_time text not null default '',
  transcript jsonb not null default '[]'::jsonb,
  source text not null default 'ai-chatbot',
  status text not null default 'new' check (status in ('new', 'contacted', 'converted')),
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  location text not null,
  address text not null,
  preferred_date date not null,
  preferred_time_slot text not null,
  notes text not null default '',
  status text not null default 'new' check (status in ('new', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  rating int not null default 5 check (rating between 1 and 5),
  review_text text not null,
  source text not null default 'Google',
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text not null default '',
  content text not null default '',
  cover_image_url text not null default '',
  cover_image_alt text not null default '',
  author text not null default 'Maison Drape Studio',
  published_at timestamptz,
  seo_title text not null default '',
  seo_description text not null default '',
  seo_keywords text not null default ''
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text not null default 'general',
  sort_order int not null default 0
);

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text not null default '',
  logo_alt text not null default '',
  sort_order int not null default 0
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb
);

create table if not exists public.cms_pages (
  slug text primary key,
  title text not null,
  content text not null default '',
  seo_title text not null default '',
  seo_description text not null default ''
);

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

alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.leads enable row level security;
alter table public.chat_leads enable row level security;
alter table public.bookings enable row level security;
alter table public.testimonials enable row level security;
alter table public.blog_posts enable row level security;
alter table public.faqs enable row level security;
alter table public.partners enable row level security;
alter table public.site_settings enable row level security;
alter table public.cms_pages enable row level security;
alter table public.analytics_events enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users au
    where au.id = auth.uid()
  );
$$;

drop policy if exists "public read categories" on public.categories;
drop policy if exists "admin write categories" on public.categories;
create policy "public read categories" on public.categories for select using (true);
create policy "admin write categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read active products" on public.products;
drop policy if exists "admin write products" on public.products;
create policy "public read active products" on public.products for select using (is_active = true or public.is_admin());
create policy "admin write products" on public.products for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read variants" on public.product_variants;
drop policy if exists "admin write variants" on public.product_variants;
create policy "public read variants" on public.product_variants for select using (true);
create policy "admin write variants" on public.product_variants for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public insert leads" on public.leads;
drop policy if exists "admin read leads" on public.leads;
drop policy if exists "admin write leads" on public.leads;
create policy "public insert leads" on public.leads for insert with check (true);
create policy "admin read leads" on public.leads for select using (public.is_admin());
create policy "admin write leads" on public.leads for update using (public.is_admin());

drop policy if exists "public insert chat_leads" on public.chat_leads;
drop policy if exists "admin read chat_leads" on public.chat_leads;
drop policy if exists "admin write chat_leads" on public.chat_leads;
create policy "public insert chat_leads" on public.chat_leads for insert with check (true);
create policy "admin read chat_leads" on public.chat_leads for select using (public.is_admin());
create policy "admin write chat_leads" on public.chat_leads for update using (public.is_admin());

drop policy if exists "public insert bookings" on public.bookings;
drop policy if exists "admin read bookings" on public.bookings;
drop policy if exists "admin write bookings" on public.bookings;
create policy "public insert bookings" on public.bookings for insert with check (true);
create policy "admin read bookings" on public.bookings for select using (public.is_admin());
create policy "admin write bookings" on public.bookings for update using (public.is_admin());

drop policy if exists "public read featured testimonials" on public.testimonials;
drop policy if exists "admin write testimonials" on public.testimonials;
create policy "public read featured testimonials" on public.testimonials for select using (is_featured = true or public.is_admin());
create policy "admin write testimonials" on public.testimonials for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read published posts" on public.blog_posts;
drop policy if exists "admin write posts" on public.blog_posts;
create policy "public read published posts" on public.blog_posts for select using (published_at is not null or public.is_admin());
create policy "admin write posts" on public.blog_posts for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read faqs" on public.faqs;
drop policy if exists "admin write faqs" on public.faqs;
create policy "public read faqs" on public.faqs for select using (true);
create policy "admin write faqs" on public.faqs for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read partners" on public.partners;
drop policy if exists "admin write partners" on public.partners;
create policy "public read partners" on public.partners for select using (true);
create policy "admin write partners" on public.partners for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read settings" on public.site_settings;
drop policy if exists "admin write settings" on public.site_settings;
create policy "public read settings" on public.site_settings for select using (key <> 'secrets');
create policy "admin write settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read cms" on public.cms_pages;
drop policy if exists "admin write cms" on public.cms_pages;
create policy "public read cms" on public.cms_pages for select using (true);
create policy "admin write cms" on public.cms_pages for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin read analytics_events" on public.analytics_events;
drop policy if exists "admin write analytics_events" on public.analytics_events;
create policy "admin read analytics_events" on public.analytics_events for select using (public.is_admin());
create policy "admin write analytics_events" on public.analytics_events for all using (public.is_admin()) with check (public.is_admin());

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

drop policy if exists "admin read admin_users" on public.admin_users;
drop policy if exists "admin write admin_users" on public.admin_users;
create policy "admin read admin_users" on public.admin_users for select using (public.is_admin());
create policy "admin write admin_users" on public.admin_users for all using (public.is_admin()) with check (public.is_admin());

insert into public.site_settings (key, value)
values ('secrets', '{}'::jsonb)
on conflict (key) do nothing;

update public.site_settings
set value = coalesce(value, '{}'::jsonb)
  || jsonb_build_object(
    'gtm_id', coalesce(value->>'gtm_id', ''),
    'meta_pixel_id', coalesce(value->>'meta_pixel_id', ''),
    'instagram_pixel_id', coalesce(value->>'instagram_pixel_id', ''),
    'tiktok_pixel_id', coalesce(value->>'tiktok_pixel_id', ''),
    'site_url', coalesce(value->>'site_url', '')
  )
where key = 'general';

update public.site_settings
set value = coalesce(value, '{}'::jsonb)
  || jsonb_build_object(
    'marquee', coalesce(value->'marquee', jsonb_build_array(
      'Free Doorstep Visit',
      'Instant Estimate Calculator',
      '1–3 Day Express Installation',
      'Blackout & Sheer Curtains',
      'Smart Motorized Tracks',
      'Downtown Dubai',
      'Palm Jumeirah',
      'Dubai Marina',
      'Business Bay'
    )),
    'how_it_works', coalesce(value->'how_it_works', jsonb_build_object(
      'eyebrow', 'How it works',
      'title', 'Elegant curtains, delivered in four effortless steps.',
      'subtitle', 'From the first click to perfectly hung curtains — every step is taken care of by the Reef Deco team. No showroom visit required.',
      'steps', jsonb_build_array(
        jsonb_build_object('number','01','title','Book a free site visit','body','Pick a time slot — our specialist comes to your home, office or hotel at zero cost.'),
        jsonb_build_object('number','02','title','Samples & exact measurement','body','We bring fabric swatches to your doorstep and measure each window precisely.'),
        jsonb_build_object('number','03','title','Select your curtain type','body','Choose between blackout, sheer, motorized or roller blinds — or let our experts advise.'),
        jsonb_build_object('number','04','title','Installation in 1–3 days','body','Our team produces and installs your custom curtains within 1 to 3 working days.')
      )
    ))
  )
where key = 'homepage'
  and (
    value ? 'hero'
    or value ? 'features'
  );

update public.site_settings
set value = jsonb_set(
  coalesce(value, '{}'::jsonb),
  '{hero,express_label}',
  to_jsonb(coalesce(value #>> '{hero,express_label}', 'Express')),
  true
)
where key = 'homepage';

update public.site_settings
set value = jsonb_set(
  coalesce(value, '{}'::jsonb),
  '{hero,express_detail}',
  to_jsonb(coalesce(value #>> '{hero,express_detail}', '1–3 day installation')),
  true
)
where key = 'homepage';

insert into public.cms_pages (slug, title, content, seo_title, seo_description)
values
  (
    'about-us',
    'An atelier for Gulf light',
    '<p>Maison Drape started as a curtain workroom and grew into a full window-treatment studio: drapes, blinds, motors and trade supply.</p>
<p>We measure in villas from Palm Jumeirah to Saadiyat, and in apartments where a 3cm reveal decides whether a cassette will sit cleanly. That is the work: not selling a catalogue SKU, but specifying fabric, lining and hardware against real glass, real HVAC and real stack-back.</p>
<p>Installers are in-house. Consultants carry blackout, sunscreen and linen in the same bag. Motors are documented for your systems integrator. The 12-month workmanship warranty is written on every job sheet.</p>',
    'About Maison Drape',
    'Atelier making custom curtains, blinds and motorised tracks for Dubai and Abu Dhabi homes, hotels and designers.'
  )
on conflict (slug) do nothing;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true),
       ('blog-images', 'blog-images', true),
       ('partner-logos', 'partner-logos', true)
on conflict (id) do nothing;

drop policy if exists "public read media" on storage.objects;
drop policy if exists "admin insert media" on storage.objects;
drop policy if exists "admin update media" on storage.objects;
drop policy if exists "admin delete media" on storage.objects;

create policy "public read media"
  on storage.objects for select
  using (bucket_id in ('product-images', 'blog-images', 'partner-logos'));

create policy "admin insert media"
  on storage.objects for insert
  with check (
    bucket_id in ('product-images', 'blog-images', 'partner-logos')
    and public.is_admin()
  );

create policy "admin update media"
  on storage.objects for update
  using (
    bucket_id in ('product-images', 'blog-images', 'partner-logos')
    and public.is_admin()
  );

create policy "admin delete media"
  on storage.objects for delete
  using (
    bucket_id in ('product-images', 'blog-images', 'partner-logos')
    and public.is_admin()
  );

drop policy if exists "authenticated insert media" on storage.objects;
drop policy if exists "authenticated update media" on storage.objects;

create policy "authenticated insert media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id in ('product-images', 'blog-images', 'partner-logos'));

create policy "authenticated update media"
  on storage.objects for update
  to authenticated
  using (bucket_id in ('product-images', 'blog-images', 'partner-logos'));
