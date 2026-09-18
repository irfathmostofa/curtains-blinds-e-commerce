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
  seo_description text not null default ''
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

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  location text not null,
  address text not null,
  preferred_date date not null,
  preferred_time_slot text not null,
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
  seo_description text not null default ''
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

alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.leads enable row level security;
alter table public.bookings enable row level security;
alter table public.testimonials enable row level security;
alter table public.blog_posts enable row level security;
alter table public.faqs enable row level security;
alter table public.partners enable row level security;
alter table public.site_settings enable row level security;
alter table public.cms_pages enable row level security;

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

create policy "public read categories" on public.categories for select using (true);
create policy "admin write categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());

create policy "public read active products" on public.products for select using (is_active = true or public.is_admin());
create policy "admin write products" on public.products for all using (public.is_admin()) with check (public.is_admin());

create policy "public read variants" on public.product_variants for select using (true);
create policy "admin write variants" on public.product_variants for all using (public.is_admin()) with check (public.is_admin());

create policy "public insert leads" on public.leads for insert with check (true);
create policy "admin read leads" on public.leads for select using (public.is_admin());
create policy "admin write leads" on public.leads for update using (public.is_admin());

create policy "public insert bookings" on public.bookings for insert with check (true);
create policy "admin read bookings" on public.bookings for select using (public.is_admin());
create policy "admin write bookings" on public.bookings for update using (public.is_admin());

create policy "public read featured testimonials" on public.testimonials for select using (is_featured = true or public.is_admin());
create policy "admin write testimonials" on public.testimonials for all using (public.is_admin()) with check (public.is_admin());

create policy "public read published posts" on public.blog_posts for select using (published_at is not null or public.is_admin());
create policy "admin write posts" on public.blog_posts for all using (public.is_admin()) with check (public.is_admin());

create policy "public read faqs" on public.faqs for select using (true);
create policy "admin write faqs" on public.faqs for all using (public.is_admin()) with check (public.is_admin());

create policy "public read partners" on public.partners for select using (true);
create policy "admin write partners" on public.partners for all using (public.is_admin()) with check (public.is_admin());

create policy "public read settings" on public.site_settings for select using (true);
create policy "admin write settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

create policy "public read cms" on public.cms_pages for select using (true);
create policy "admin write cms" on public.cms_pages for all using (public.is_admin()) with check (public.is_admin());

create policy "admin read admin_users" on public.admin_users for select using (public.is_admin());
create policy "admin write admin_users" on public.admin_users for all using (public.is_admin()) with check (public.is_admin());

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
