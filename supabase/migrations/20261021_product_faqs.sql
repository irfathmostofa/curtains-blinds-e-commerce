alter table public.products
  add column if not exists faqs jsonb not null default '[]'::jsonb;
