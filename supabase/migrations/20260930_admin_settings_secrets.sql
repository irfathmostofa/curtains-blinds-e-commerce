-- Keep Resend and CAPI tokens in site_settings.secrets, readable only by admins.

drop policy if exists "public read settings" on public.site_settings;

create policy "public read settings"
  on public.site_settings
  for select
  using (key <> 'secrets');

insert into public.site_settings (key, value)
values ('secrets', '{}'::jsonb)
on conflict (key) do nothing;

update public.site_settings
set value = coalesce(value, '{}'::jsonb)
  || jsonb_build_object('site_url', coalesce(value->>'site_url', ''))
where key = 'general';
