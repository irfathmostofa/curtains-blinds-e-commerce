"use client";

import { useState, type FormEvent } from "react";
import { saveSettings } from "@/app/admin/actions";
import { ImageUploader } from "@/components/admin/image-uploader";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
            <Input id="hero-title" value={hero.title} onChange={(e) => patchHero({ title: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <RichTextEditor value={hero.subtitle} onChange={(html) => patchHero({ subtitle: html })} minHeight="120px" />
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="express-label">Express badge label</Label>
              <Input
                id="express-label"
                value={hero.express_label || ""}
                onChange={(e) => patchHero({ express_label: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="express-detail">Express badge detail</Label>
              <Input
                id="express-detail"
                value={hero.express_detail || ""}
                onChange={(e) => patchHero({ express_detail: e.target.value })}
              />
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
          <h2 className="font-serif text-xl">Marquee</h2>
          <p className="text-sm text-muted-foreground">One phrase per line. Shown as a scrolling strip below the hero.</p>
          <textarea
            className="min-h-36 w-full rounded-xl border bg-card px-3 py-2 text-sm"
            value={(home.marquee || []).join("\n")}
            onChange={(e) =>
              setHome((h) => ({
                ...h,
                marquee: e.target.value
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean),
              }))
            }
          />
        </section>

        <section className="space-y-4 rounded-2xl border bg-card p-4 sm:p-6">
          <h2 className="font-serif text-xl">How it works</h2>
          <div className="space-y-2">
            <Label htmlFor="hiw-eyebrow">Eyebrow</Label>
            <Input
              id="hiw-eyebrow"
              value={home.how_it_works.eyebrow}
              onChange={(e) =>
                setHome((h) => ({ ...h, how_it_works: { ...h.how_it_works, eyebrow: e.target.value } }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hiw-title">Title</Label>
            <Input
              id="hiw-title"
              value={home.how_it_works.title}
              onChange={(e) =>
                setHome((h) => ({ ...h, how_it_works: { ...h.how_it_works, title: e.target.value } }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <RichTextEditor
              value={home.how_it_works.subtitle}
              onChange={(html) =>
                setHome((h) => ({ ...h, how_it_works: { ...h.how_it_works, subtitle: html } }))
              }
              minHeight="110px"
            />
          </div>
          <div className="grid gap-4">
            {home.how_it_works.steps.map((step, index) => (
              <div key={index} className="space-y-3 rounded-xl border p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`hiw-num-${index}`}>Number</Label>
                    <Input
                      id={`hiw-num-${index}`}
                      value={step.number}
                      onChange={(e) =>
                        setHome((h) => ({
                          ...h,
                          how_it_works: {
                            ...h.how_it_works,
                            steps: h.how_it_works.steps.map((s, i) =>
                              i === index ? { ...s, number: e.target.value } : s
                            ),
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`hiw-step-${index}`}>Title</Label>
                    <Input
                      id={`hiw-step-${index}`}
                      value={step.title}
                      onChange={(e) =>
                        setHome((h) => ({
                          ...h,
                          how_it_works: {
                            ...h.how_it_works,
                            steps: h.how_it_works.steps.map((s, i) =>
                              i === index ? { ...s, title: e.target.value } : s
                            ),
                          },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Body</Label>
                  <RichTextEditor
                    value={step.body}
                    onChange={(html) =>
                      setHome((h) => ({
                        ...h,
                        how_it_works: {
                          ...h.how_it_works,
                          steps: h.how_it_works.steps.map((s, i) => (i === index ? { ...s, body: html } : s)),
                        },
                      }))
                    }
                    minHeight="110px"
                  />
                </div>
              </div>
            ))}
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
                  <Label>Body</Label>
                  <RichTextEditor
                    value={feature.body}
                    onChange={(html) => patchFeature(index, { body: html })}
                    minHeight="110px"
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
              <Label>Subtitle</Label>
              <RichTextEditor
                value={home[key].subtitle}
                onChange={(html) => patchSection(key, { subtitle: html })}
                minHeight="110px"
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
            <Label>Subtitle</Label>
            <RichTextEditor value={home.cta.subtitle} onChange={(html) => patchCta({ subtitle: html })} minHeight="110px" />
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
              <Label>Paragraph {i + 1}</Label>
              <RichTextEditor
                value={p}
                onChange={(html) =>
                  setHome((h) => ({
                    ...h,
                    story: {
                      ...h.story,
                      paragraphs: h.story.paragraphs.map((para, idx) => (idx === i ? html : para)),
                    },
                  }))
                }
                minHeight="140px"
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
