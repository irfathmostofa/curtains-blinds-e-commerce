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
