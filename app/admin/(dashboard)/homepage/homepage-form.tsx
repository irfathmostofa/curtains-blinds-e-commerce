"use client";

import { useState, type FormEvent } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { saveSettings } from "@/app/admin/actions";
import { ImageUploader } from "@/components/admin/image-uploader";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HOMEPAGE_SECTION_LABELS } from "@/lib/site";
import type { HeroSlide, HeroVariant, HomepageContent, HomepageFeature, HomepageSectionLayout, SiteSettings } from "@/lib/types";

const ICONS: HomepageFeature["icon"][] = ["ruler", "shield", "sparkles", "clock"];

const EMPTY_SLIDE: HeroSlide = {
  badge: "",
  title: "",
  subtitle: "",
  primary_cta_label: "Book a free visit",
  primary_cta_href: "/book",
  secondary_cta_label: "Browse collections",
  secondary_cta_href: "/products",
  image_url: "",
  image_alt: "",
  express_label: "Express",
  express_detail: "1–3 day installation",
};

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

  function patchSlide(index: number, partial: Partial<HeroSlide>) {
    setHome((h) => ({
      ...h,
      hero_slides: h.hero_slides.map((s, i) => (i === index ? { ...s, ...partial } : s)),
    }));
  }

  function moveSection(index: number, direction: -1 | 1) {
    setHome((h) => {
      const next = [...h.section_order];
      const target = index + direction;
      if (target < 0 || target >= next.length) return h;
      const current = next[index];
      next[index] = next[target];
      next[target] = current;
      return { ...h, section_order: next };
    });
  }

  function toggleSection(index: number, enabled: boolean) {
    setHome((h) => ({
      ...h,
      section_order: h.section_order.map((s, i) => (i === index ? { ...s, enabled } : s)),
    }));
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
          Choose the hero layout, turn sections on or off, reorder them, and edit copy without extra pages.
        </p>
      </div>

      <form className="space-y-8" onSubmit={onSubmit}>
        <section className="space-y-4 rounded-2xl border bg-card p-4 sm:p-6">
          <h2 className="font-serif text-xl">Section layout</h2>
          <p className="text-sm text-muted-foreground">
            Toggle visibility and move sections up or down. The live homepage follows this order.
          </p>
          <div className="space-y-2">
            {home.section_order.map((section, index) => (
              <SectionRow
                key={section.id}
                section={section}
                index={index}
                total={home.section_order.length}
                onToggle={(enabled) => toggleSection(index, enabled)}
                onMove={(dir) => moveSection(index, dir)}
              />
            ))}
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border bg-card p-4 sm:p-6">
          <h2 className="font-serif text-xl">Hero</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hero-variant">Layout</Label>
              <select
                id="hero-variant"
                className="h-11 w-full rounded-xl border bg-card px-3"
                value={hero.variant}
                onChange={(e) => patchHero({ variant: e.target.value as HeroVariant })}
              >
                <option value="classic">Current version (split layout)</option>
                <option value="carousel">Carousel</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-autoplay">Carousel autoplay (ms)</Label>
              <Input
                id="hero-autoplay"
                type="number"
                min={2500}
                step={500}
                value={hero.autoplay_ms}
                onChange={(e) => patchHero({ autoplay_ms: Number(e.target.value) || 6500 })}
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Classic uses the fields below. Carousel uses the slides list — classic fields stay as a fallback.
          </p>

          <HeroFields value={hero} onChange={patchHero} />
        </section>

        <section className="space-y-4 rounded-2xl border bg-card p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-serif text-xl">Carousel slides</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setHome((h) => ({ ...h, hero_slides: [...h.hero_slides, { ...EMPTY_SLIDE }] }))}
            >
              Add slide
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Shown when layout is set to Carousel. At least one slide is recommended.</p>
          <div className="space-y-6">
            {home.hero_slides.map((slide, index) => (
              <div key={index} className="space-y-4 rounded-xl border p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-medium">Slide {index + 1}</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={home.hero_slides.length <= 1}
                    onClick={() =>
                      setHome((h) => ({
                        ...h,
                        hero_slides: h.hero_slides.filter((_, i) => i !== index),
                      }))
                    }
                  >
                    Remove
                  </Button>
                </div>
                <HeroFields value={slide} onChange={(partial) => patchSlide(index, partial)} />
              </div>
            ))}
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
          <h2 className="font-serif text-xl">Introduction</h2>
          <p className="text-sm text-muted-foreground">
            Shown after the marquee. Use this when the hero is a carousel so the page still has opening copy and CTAs.
          </p>
          <div className="space-y-2">
            <Label htmlFor="intro-eyebrow">Eyebrow</Label>
            <Input
              id="intro-eyebrow"
              value={home.intro.eyebrow}
              onChange={(e) => setHome((h) => ({ ...h, intro: { ...h.intro, eyebrow: e.target.value } }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="intro-title">Title</Label>
            <Input
              id="intro-title"
              value={home.intro.title}
              onChange={(e) => setHome((h) => ({ ...h, intro: { ...h.intro, title: e.target.value } }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <RichTextEditor
              value={home.intro.subtitle}
              onChange={(html) => setHome((h) => ({ ...h, intro: { ...h.intro, subtitle: html } }))}
              minHeight="120px"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="intro-primary-label">Primary button label</Label>
              <Input
                id="intro-primary-label"
                value={home.intro.primary_cta_label}
                onChange={(e) =>
                  setHome((h) => ({ ...h, intro: { ...h.intro, primary_cta_label: e.target.value } }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="intro-primary-href">Primary button link</Label>
              <Input
                id="intro-primary-href"
                value={home.intro.primary_cta_href}
                onChange={(e) =>
                  setHome((h) => ({ ...h, intro: { ...h.intro, primary_cta_href: e.target.value } }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="intro-secondary-label">Secondary button label</Label>
              <Input
                id="intro-secondary-label"
                value={home.intro.secondary_cta_label}
                onChange={(e) =>
                  setHome((h) => ({ ...h, intro: { ...h.intro, secondary_cta_label: e.target.value } }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="intro-secondary-href">Secondary button link</Label>
              <Input
                id="intro-secondary-href"
                value={home.intro.secondary_cta_href}
                onChange={(e) =>
                  setHome((h) => ({ ...h, intro: { ...h.intro, secondary_cta_href: e.target.value } }))
                }
              />
            </div>
          </div>
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
          <h2 className="font-serif text-xl">Filter products</h2>
          <p className="text-sm text-muted-foreground">
            Homepage tabs filter live products by All, Bestsellers, and each category.
          </p>
          <div className="space-y-2">
            <Label htmlFor="fp-eyebrow">Eyebrow</Label>
            <Input
              id="fp-eyebrow"
              value={home.filtered_products.eyebrow}
              onChange={(e) =>
                setHome((h) => ({ ...h, filtered_products: { ...h.filtered_products, eyebrow: e.target.value } }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fp-title">Title</Label>
            <Input
              id="fp-title"
              value={home.filtered_products.title}
              onChange={(e) =>
                setHome((h) => ({ ...h, filtered_products: { ...h.filtered_products, title: e.target.value } }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <RichTextEditor
              value={home.filtered_products.subtitle}
              onChange={(html) =>
                setHome((h) => ({ ...h, filtered_products: { ...h.filtered_products, subtitle: html } }))
              }
              minHeight="110px"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="fp-limit">Products shown</Label>
              <Input
                id="fp-limit"
                type="number"
                min={1}
                max={24}
                value={home.filtered_products.limit}
                onChange={(e) =>
                  setHome((h) => ({
                    ...h,
                    filtered_products: { ...h.filtered_products, limit: Number(e.target.value) || 8 },
                  }))
                }
              />
            </div>
            <label className="flex items-center gap-3 rounded-xl border px-3 py-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[hsl(var(--accent))]"
                checked={home.filtered_products.show_all_tab}
                onChange={(e) =>
                  setHome((h) => ({
                    ...h,
                    filtered_products: { ...h.filtered_products, show_all_tab: e.target.checked },
                  }))
                }
              />
              Show All tab
            </label>
            <label className="flex items-center gap-3 rounded-xl border px-3 py-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[hsl(var(--accent))]"
                checked={home.filtered_products.show_bestsellers_tab}
                onChange={(e) =>
                  setHome((h) => ({
                    ...h,
                    filtered_products: { ...h.filtered_products, show_bestsellers_tab: e.target.checked },
                  }))
                }
              />
              Show Bestsellers tab
            </label>
          </div>
        </section>

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

function SectionRow({
  section,
  index,
  total,
  onToggle,
  onMove,
}: {
  section: HomepageSectionLayout;
  index: number;
  total: number;
  onToggle: (enabled: boolean) => void;
  onMove: (direction: -1 | 1) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border px-3 py-2">
      <label className="flex min-w-0 flex-1 items-center gap-3 text-sm">
        <input
          type="checkbox"
          className="h-4 w-4 accent-[hsl(var(--accent))]"
          checked={section.enabled}
          onChange={(e) => onToggle(e.target.checked)}
        />
        <span className="truncate font-medium">{HOMEPAGE_SECTION_LABELS[section.id]}</span>
      </label>
      <div className="flex shrink-0 gap-1">
        <Button type="button" variant="outline" size="icon" aria-label="Move section up" disabled={index === 0} onClick={() => onMove(-1)}>
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Move section down"
          disabled={index === total - 1}
          onClick={() => onMove(1)}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function HeroFields({
  value,
  onChange,
}: {
  value: HeroSlide;
  onChange: (partial: Partial<HeroSlide>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Badge</Label>
        <Input value={value.badge} onChange={(e) => onChange({ badge: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Headline</Label>
        <Input value={value.title} onChange={(e) => onChange({ title: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Subtitle</Label>
        <RichTextEditor value={value.subtitle} onChange={(html) => onChange({ subtitle: html })} minHeight="120px" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Primary button label</Label>
          <Input value={value.primary_cta_label} onChange={(e) => onChange({ primary_cta_label: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Primary button link</Label>
          <Input value={value.primary_cta_href} onChange={(e) => onChange({ primary_cta_href: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Secondary button label</Label>
          <Input value={value.secondary_cta_label} onChange={(e) => onChange({ secondary_cta_label: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Secondary button link</Label>
          <Input value={value.secondary_cta_href} onChange={(e) => onChange({ secondary_cta_href: e.target.value })} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Express badge label</Label>
          <Input value={value.express_label || ""} onChange={(e) => onChange({ express_label: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Express badge detail</Label>
          <Input value={value.express_detail || ""} onChange={(e) => onChange({ express_detail: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Hero image alt text</Label>
        <Input value={value.image_alt} onChange={(e) => onChange({ image_alt: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Hero image</Label>
        <ImageUploader
          folder="blog-images"
          suggestedAlt={value.image_alt || "Maison Drape hero"}
          nameHint="homepage-hero"
          multiple={false}
          onUploaded={(asset) => onChange({ image_url: asset.url, image_alt: asset.alt || value.image_alt })}
        />
        {value.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value.image_url} alt={value.image_alt} className="mt-2 max-h-56 w-full rounded-xl object-cover" />
        ) : null}
      </div>
    </div>
  );
}
