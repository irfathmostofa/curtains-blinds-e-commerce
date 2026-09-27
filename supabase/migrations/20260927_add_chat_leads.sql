-- Chatbot leads: customer details, suggested estimate, optional booking, transcript.
-- Safe to run on an existing Maison Drape database.

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

alter table public.chat_leads enable row level security;

drop policy if exists "public insert chat_leads" on public.chat_leads;
drop policy if exists "admin read chat_leads" on public.chat_leads;
drop policy if exists "admin write chat_leads" on public.chat_leads;

create policy "public insert chat_leads"
  on public.chat_leads for insert
  with check (true);

create policy "admin read chat_leads"
  on public.chat_leads for select
  using (public.is_admin());

create policy "admin write chat_leads"
  on public.chat_leads for update
  using (public.is_admin());

create index if not exists chat_leads_created_at_idx
  on public.chat_leads (created_at desc);

create index if not exists chat_leads_status_idx
  on public.chat_leads (status);

-- Homepage JSON: add marquee + how_it_works defaults without overwriting saved copy.
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
