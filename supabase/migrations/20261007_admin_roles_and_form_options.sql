-- Super admin / admin / editor roles, plus form option settings.

alter table public.admin_users drop constraint if exists admin_users_role_check;
alter table public.admin_users
  add constraint admin_users_role_check check (role in ('superadmin', 'admin', 'editor'));

update public.admin_users set role = 'superadmin' where role = 'admin';

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

create or replace function public.admin_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select au.role from public.admin_users au where au.id = auth.uid()),
    ''
  );
$$;

create or replace function public.can_manage_catalogue()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.admin_role() in ('superadmin', 'admin', 'editor');
$$;

create or replace function public.can_manage_inbox()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.admin_role() in ('superadmin', 'admin');
$$;

create or replace function public.can_manage_content()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.admin_role() in ('superadmin', 'admin');
$$;

create or replace function public.can_manage_blog()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.admin_role() in ('superadmin', 'admin', 'editor');
$$;

create or replace function public.is_superadmin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.admin_role() = 'superadmin';
$$;

drop policy if exists "admin write categories" on public.categories;
create policy "admin write categories" on public.categories for all using (public.can_manage_catalogue()) with check (public.can_manage_catalogue());

drop policy if exists "admin write products" on public.products;
create policy "admin write products" on public.products for all using (public.can_manage_catalogue()) with check (public.can_manage_catalogue());

drop policy if exists "admin write variants" on public.product_variants;
create policy "admin write variants" on public.product_variants for all using (public.can_manage_catalogue()) with check (public.can_manage_catalogue());

drop policy if exists "admin read leads" on public.leads;
drop policy if exists "admin write leads" on public.leads;
create policy "admin read leads" on public.leads for select using (public.can_manage_inbox());
create policy "admin write leads" on public.leads for update using (public.can_manage_inbox());

drop policy if exists "admin read chat_leads" on public.chat_leads;
drop policy if exists "admin write chat_leads" on public.chat_leads;
create policy "admin read chat_leads" on public.chat_leads for select using (public.can_manage_inbox());
create policy "admin write chat_leads" on public.chat_leads for update using (public.can_manage_inbox());

drop policy if exists "admin read bookings" on public.bookings;
drop policy if exists "admin write bookings" on public.bookings;
create policy "admin read bookings" on public.bookings for select using (public.can_manage_inbox());
create policy "admin write bookings" on public.bookings for update using (public.can_manage_inbox());

drop policy if exists "admin write testimonials" on public.testimonials;
create policy "admin write testimonials" on public.testimonials for all using (public.can_manage_content()) with check (public.can_manage_content());

drop policy if exists "admin write posts" on public.blog_posts;
create policy "admin write posts" on public.blog_posts for all using (public.can_manage_blog()) with check (public.can_manage_blog());

drop policy if exists "admin write faqs" on public.faqs;
create policy "admin write faqs" on public.faqs for all using (public.can_manage_content()) with check (public.can_manage_content());

drop policy if exists "admin write partners" on public.partners;
create policy "admin write partners" on public.partners for all using (public.can_manage_content()) with check (public.can_manage_content());

drop policy if exists "admin write settings" on public.site_settings;
create policy "admin write settings" on public.site_settings for all using (public.is_superadmin()) with check (public.is_superadmin());

drop policy if exists "admin write cms" on public.cms_pages;
create policy "admin write cms" on public.cms_pages for all using (public.is_superadmin()) with check (public.is_superadmin());

drop policy if exists "admin write admin_users" on public.admin_users;
create policy "admin write admin_users" on public.admin_users for all using (public.is_superadmin()) with check (public.is_superadmin());

insert into public.site_settings (key, value)
values
  ('form_cities', '[{"id":"dubai","label":"Dubai","hint":"Villas, apartments and hotels"},{"id":"abu-dhabi","label":"Abu Dhabi","hint":"Mussafah, islands and city homes"}]'::jsonb),
  ('form_considering', '[{"id":"curtains-and-drapes","label":"Curtains & drapes"},{"id":"blinds-and-shades","label":"Blinds & shades"},{"id":"motorized","label":"Motorized"},{"id":"mix","label":"A mix"}]'::jsonb),
  ('form_budgets', '[{"id":"under-5k","label":"Under AED 5,000"},{"id":"aed-5k-15k","label":"AED 5,000–15,000"},{"id":"aed-15k-plus","label":"AED 15,000+"}]'::jsonb),
  ('form_rooms', '[{"id":"1-2-rooms","label":"1–2 rooms"},{"id":"3-4-rooms","label":"3–4 rooms"},{"id":"whole-villa","label":"Whole villa / 5+"}]'::jsonb)
on conflict (key) do nothing;
