"use client";

import { useState, type FormEvent } from "react";
import { saveSettings } from "@/app/admin/actions";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { HomepageContent, HomepageFeature, SiteSettings } from "@/lib/types";

const ICONS: HomepageFeature["icon"][] = ["ruler", "shield", "sparkles", "clock"];

export function HomepageForm({ initial }: { initial: SiteSettings }) {
  const [home, setHome] = useState<HomepageContent>(initial.homepage);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const hero = home.hero;

  function patchHero(partial: Partial<HomepageContent["hero"]>) {
    setHome((h) => ({ ...h, hero: { ...h.hero, ...partial } }));
  }

  function patchSection(
    key: "collections" | "bestsellers" | "reviews" | "partners" | "faqs",
    partial: Partial<HomepageContent["collections"]>
  ) {
    setHome((h) => ({ ...h, [key]: { ...h[key], ...partial } }));
  }

  function patchFeature(index: number, partial: Partial<HomepageFeature>) {
    setHome((h) => ({
      ...h,
      features: h.features.map((f, i) => (i === index ? { ...f, ...partial } : f)),
    }));
  }

  function patchCta(partial: Partial<HomepageContent["cta"]>) {
    setHome((h) => ({ ...h, cta: { ...h.cta, ...partial } }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    await saveSettings({ ...initial, homepage: home });
    setSaving(false);
    setMessage("Homepage saved. Refresh the public site to see changes.");
  }

  return (
    <main className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl">Homepage</h1>
        <p className="text-sm text-muted-foreground">
          Edit hero copy and image, feature cards, section headings, CTA and story without extra pages.
        </p>
      </div>

      <form className="space-y-8" onSubmit={onSubmit}>
        <section className="space-y-4 rounded-2xl border bg-card p-4 sm:p-6">
          <h2 className="font-serif text-xl">Hero</h2>
          <div className="space-y-2">
            <Label htmlFor="badge">Badge</Label>
            <Input id="badge" value={hero.badge} onChange={(e) => patchHero({ badge: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-title">Headline</Label>
            <Textarea id="hero-title" value={hero.title} onChange={(e) => patchHero({ title: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-sub">Subtitle</Label>
            <Textarea id="hero-sub" value={hero.subtitle} onChange={(e) => patchHero({ subtitle: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cta1">Primary button label</Label>
              <Input id="cta1" value={hero.primary_cta_label} onChange={(e) => patchHero({ primary_cta_label: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta1h">Primary button link</Label>
              <Input id="cta1h" value={hero.primary_cta_href} onChange={(e) => patchHero({ primary_cta_href: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta2">Secondary button label</Label>
              <Input id="cta2" value={hero.secondary_cta_label} onChange={(e) => patchHero({ secondary_cta_label: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta2h">Secondary button link</Label>
              <Input id="cta2h" value={hero.secondary_cta_href} onChange={(e) => patchHero({ secondary_cta_href: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-alt">Hero image alt text</Label>
            <Input id="hero-alt" value={hero.image_alt} onChange={(e) => patchHero({ image_alt: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Hero image</Label>
            <ImageUploader
              folder="blog-images"
              suggestedAlt={hero.image_alt || "Maison Drape hero"}
              nameHint="homepage-hero"
              multiple={false}
              onUploaded={(asset) => patchHero({ image_url: asset.url, image_alt: asset.alt || hero.image_alt })}
            />
            {hero.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={hero.image_url} alt={hero.image_alt} className="mt-2 max-h-56 w-full rounded-xl object-cover" />
            ) : null}
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border bg-card p-4 sm:p-6">
          <h2 className="font-serif text-xl">Feature cards</h2>
          <div className="grid gap-4">
            {home.features.map((feature, index) => (
              <div key={index} className="space-y-3 rounded-xl border p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`f-icon-${index}`}>Icon</Label>
                    <select
                      id={`f-icon-${index}`}
                      className="h-11 w-full rounded-xl border bg-card px-3"
                      value={feature.icon}
                      onChange={(e) => patchFeature(index, { icon: e.target.value as HomepageFeature["icon"] })}
                    >
                      {ICONS.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`f-title-${index}`}>Title</Label>
                    <Input
                      id={`f-title-${index}`}
                      value={feature.title}
                      onChange={(e) => patchFeature(index, { title: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`f-body-${index}`}>Body</Label>
                  <Textarea
                    id={`f-body-${index}`}
                    value={feature.body}
                    onChange={(e) => patchFeature(index, { body: e.target.value })}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {(
          [
            ["collections", "Collections"],
            ["bestsellers", "Bestsellers"],
            ["reviews", "Reviews"],
            ["partners", "Partners"],
            ["faqs", "FAQs"],
          ] as const
        ).map(([key, label]) => (
          <section key={key} className="space-y-4 rounded-2xl border bg-card p-4 sm:p-6">
            <h2 className="font-serif text-xl">{label} heading</h2>
            <div className="space-y-2">
              <Label htmlFor={`${key}-eyebrow`}>Eyebrow</Label>
              <Input
                id={`${key}-eyebrow`}
                value={home[key].eyebrow}
                onChange={(e) => patchSection(key, { eyebrow: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${key}-title`}>Title</Label>
              <Input id={`${key}-title`} value={home[key].title} onChange={(e) => patchSection(key, { title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${key}-sub`}>Subtitle</Label>
              <Textarea
                id={`${key}-sub`}
                value={home[key].subtitle}
                onChange={(e) => patchSection(key, { subtitle: e.target.value })}
              />
            </div>
          </section>
        ))}

        <section className="space-y-4 rounded-2xl border bg-card p-4 sm:p-6">
          <h2 className="font-serif text-xl">Estimate CTA</h2>
          <div className="space-y-2">
            <Label htmlFor="cta-title">Title</Label>
            <Input id="cta-title" value={home.cta.title} onChange={(e) => patchCta({ title: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cta-sub">Subtitle</Label>
            <Textarea id="cta-sub" value={home.cta.subtitle} onChange={(e) => patchCta({ subtitle: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cta-btn">Button label</Label>
              <Input id="cta-btn" value={home.cta.button_label} onChange={(e) => patchCta({ button_label: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta-href">Button link</Label>
              <Input id="cta-href" value={home.cta.button_href} onChange={(e) => patchCta({ button_href: e.target.value })} />
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border bg-card p-4 sm:p-6">
          <h2 className="font-serif text-xl">Story / SEO copy</h2>
          <div className="space-y-2">
            <Label htmlFor="story-title">Title</Label>
            <Input
              id="story-title"
              value={home.story.title}
              onChange={(e) => setHome((h) => ({ ...h, story: { ...h.story, title: e.target.value } }))}
            />
          </div>
          {home.story.paragraphs.map((p, i) => (
            <div key={i} className="space-y-2">
              <Label htmlFor={`story-p-${i}`}>Paragraph {i + 1}</Label>
              <Textarea
                id={`story-p-${i}`}
                value={p}
                onChange={(e) =>
                  setHome((h) => ({
                    ...h,
                    story: {
                      ...h.story,
                      paragraphs: h.story.paragraphs.map((para, idx) => (idx === i ? e.target.value : para)),
                    },
                  }))
                }
              />
            </div>
          ))}
        </section>

        {message ? <p className="text-sm">{message}</p> : null}
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save homepage"}
        </Button>
      </form>
    </main>
  );
}
