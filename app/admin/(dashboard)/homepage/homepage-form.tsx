"use client";

import { useCallback, useEffect, useId, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { saveSettings } from "@/app/admin/actions";
import { ImageUploader } from "@/components/admin/image-uploader";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const TABS = [
  { id: "layout", label: "Layout" },
  { id: "hero", label: "Hero" },
  { id: "carousel", label: "Carousel" },
  { id: "marquee", label: "Marquee" },
  { id: "intro", label: "Introduction" },
  { id: "how_it_works", label: "How it works" },
  { id: "features", label: "Features" },
  { id: "collections", label: "Collections" },
  { id: "bestsellers", label: "Bestsellers" },
  { id: "reviews", label: "Reviews" },
  { id: "partners", label: "Partners" },
  { id: "faqs", label: "FAQs" },
  { id: "filtered_products", label: "Products" },
  { id: "cta", label: "CTA" },
  { id: "story", label: "Story" },
] as const;

export function HomepageForm({ initial }: { initial: SiteSettings }) {
  const [home, setHome] = useState<HomepageContent>(initial.homepage);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("layout");
  const [query, setQuery] = useState("");
  const hero = home.hero;

  function patchHero(partial: Partial<HomepageContent["hero"]>) {
    setHome((h) => ({ ...h, hero: { ...h.hero, ...partial } }));
  }

  function patchIntro(partial: Partial<HomepageContent["intro"]>) {
    setHome((h) => ({ ...h, intro: { ...h.intro, ...partial } }));
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

  function setSectionPosition(index: number, position: number) {
    setHome((h) => {
      const next = [...h.section_order];
      const item = next.splice(index, 1)[0];
      const clamped = Math.max(1, Math.min(next.length + 1, Math.round(position))) - 1;
      next.splice(clamped, 0, item);
      return { ...h, section_order: next };
    });
  }

  function toggleSection(index: number, enabled: boolean) {
    setHome((h) => ({
      ...h,
      section_order: h.section_order.map((s, i) => (i === index ? { ...s, enabled } : s)),
    }));
  }

  const persist = useCallback(async () => {
    setSaving(true);
    await saveSettings({ ...initial, homepage: home });
    setSaving(false);
    setMessage("Homepage saved. Refresh the public site to see changes.");
  }, [home, initial]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await persist();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (!saving) void persist();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [persist, saving]);

  const filteredTabs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TABS;
    return TABS.filter((s) => s.label.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    if (!filteredTabs.some((s) => s.id === tab) && filteredTabs[0]) {
      setTab(filteredTabs[0].id);
    }
  }, [filteredTabs, tab]);

  return (
    <main className="mx-auto max-w-3xl space-y-6 pb-24">
      <div>
        <h1 className="font-serif text-3xl">Homepage</h1>
        <p className="text-sm text-muted-foreground">
          Open a tab, type to filter tabs, then press Ctrl/Cmd+S to save.
        </p>
      </div>

      <form className="space-y-6" onSubmit={onSubmit}>
        <Tabs value={tab} onValueChange={setTab}>
          <div className="sticky top-0 z-20 -mx-1 space-y-3 rounded-2xl border bg-card/95 p-3 backdrop-blur sm:p-4">
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-[12rem] flex-1 space-y-1">
                <Label htmlFor="hp-search">Find a tab</Label>
                <Input
                  id="hp-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && filteredTabs[0]) {
                      e.preventDefault();
                      setTab(filteredTabs[0].id);
                    }
                  }}
                  placeholder="Type intro, hero, reviews…"
                />
              </div>
              <Button type="button" disabled={saving} onClick={() => void persist()}>
                {saving ? "Saving…" : "Save"}
              </Button>
            </div>
            <TabsList>
              {filteredTabs.map((s) => (
                <TabsTrigger key={s.id} value={s.id}>
                  {s.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {message ? <p className="text-sm">{message}</p> : null}
          </div>

          <TabsContent value="layout">
            <Panel title="Section layout" hint="Type a position number, or Tab to the arrows. Uncheck to hide a section.">
          <div className="space-y-2">
            {home.section_order.map((section, index) => (
              <SectionRow
                key={section.id}
                section={section}
                index={index}
                total={home.section_order.length}
                onToggle={(enabled) => toggleSection(index, enabled)}
                onMove={(dir) => moveSection(index, dir)}
                onPosition={(pos) => setSectionPosition(index, pos)}
              />
            ))}
          </div>
            </Panel>
          </TabsContent>

          <TabsContent value="hero">
            <Panel title="Hero" hint="Classic uses the fields below. Carousel uses the slides list.">
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
          <HeroFields value={hero} onChange={patchHero} />
            </Panel>
          </TabsContent>

          <TabsContent value="carousel">
            <Panel title="Carousel slides" hint="Shown when layout is set to Carousel.">
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setHome((h) => ({ ...h, hero_slides: [...h.hero_slides, { ...EMPTY_SLIDE }] }))}
            >
              Add slide
            </Button>
          </div>
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
            </Panel>
          </TabsContent>

          <TabsContent value="marquee">
            <Panel title="Marquee" hint="One phrase per line. Shown as a scrolling strip below the hero.">
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
            </Panel>
          </TabsContent>

          <TabsContent value="intro">
            <Panel title="Introduction" hint="Copy on the left, image on the right of the homepage intro.">
          <div className="space-y-2">
            <Label htmlFor="intro-eyebrow">Eyebrow</Label>
            <Input
              id="intro-eyebrow"
              value={home.intro.eyebrow}
              onChange={(e) => patchIntro({ eyebrow: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="intro-title">Title</Label>
            <Input id="intro-title" value={home.intro.title} onChange={(e) => patchIntro({ title: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <RichTextEditor
              value={home.intro.subtitle}
              onChange={(html) => patchIntro({ subtitle: html })}
              minHeight="120px"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="intro-primary-label">Primary button label</Label>
              <Input
                id="intro-primary-label"
                value={home.intro.primary_cta_label}
                onChange={(e) => patchIntro({ primary_cta_label: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="intro-primary-href">Primary button link</Label>
              <Input
                id="intro-primary-href"
                value={home.intro.primary_cta_href}
                onChange={(e) => patchIntro({ primary_cta_href: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="intro-secondary-label">Secondary button label</Label>
              <Input
                id="intro-secondary-label"
                value={home.intro.secondary_cta_label}
                onChange={(e) => patchIntro({ secondary_cta_label: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="intro-secondary-href">Secondary button link</Label>
              <Input
                id="intro-secondary-href"
                value={home.intro.secondary_cta_href}
                onChange={(e) => patchIntro({ secondary_cta_href: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="intro-image-alt">Image alt text</Label>
            <Input
              id="intro-image-alt"
              value={home.intro.image_alt || ""}
              onChange={(e) => patchIntro({ image_alt: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="intro-image-url">Image URL</Label>
            <Input
              id="intro-image-url"
              value={home.intro.image_url || ""}
              onChange={(e) => patchIntro({ image_url: e.target.value })}
              placeholder="Paste a URL or upload below"
            />
          </div>
          <div className="space-y-2">
            <Label>Upload intro image</Label>
            <ImageUploader
              folder="blog-images"
              suggestedAlt={home.intro.image_alt || "Maison Drape introduction"}
              nameHint="homepage-intro"
              multiple={false}
              onUploaded={(asset) => patchIntro({ image_url: asset.url, image_alt: asset.alt || home.intro.image_alt })}
            />
            {home.intro.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={home.intro.image_url} alt={home.intro.image_alt} className="mt-2 max-h-56 w-full rounded-xl object-cover" />
            ) : null}
          </div>
            </Panel>
          </TabsContent>

          <TabsContent value="how_it_works">
            <Panel title="How it works">
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
            </Panel>
          </TabsContent>

          <TabsContent value="features">
            <Panel title="Feature cards">
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
            </Panel>
          </TabsContent>

        {(
          [
            ["collections", "Collections"],
            ["bestsellers", "Bestsellers"],
            ["reviews", "Reviews"],
            ["partners", "Partners"],
            ["faqs", "FAQs"],
          ] as const
        ).map(([key, label]) => (
          <TabsContent key={key} value={key}>
            <Panel title={`${label} heading`}>
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
            </Panel>
          </TabsContent>
        ))}

          <TabsContent value="filtered_products">
            <Panel title="Filter products" hint="Homepage tabs filter live products by All, Bestsellers, and each category.">
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
            </Panel>
          </TabsContent>

          <TabsContent value="cta">
            <Panel title="Estimate CTA">
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
            </Panel>
          </TabsContent>

          <TabsContent value="story">
            <Panel title="Story / SEO copy">
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
            </Panel>
          </TabsContent>
        </Tabs>

        {message ? <p className="text-sm">{message}</p> : null}
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save homepage"}
        </Button>
      </form>
    </main>
  );
}

function Panel({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="space-y-4 rounded-2xl border bg-card p-4 sm:p-6">
      <div>
        <h2 className="font-serif text-xl">{title}</h2>
        {hint ? <p className="mt-1 text-sm text-muted-foreground">{hint}</p> : null}
      </div>
      {children}
    </section>
  );
}

function SectionRow({
  section,
  index,
  total,
  onToggle,
  onMove,
  onPosition,
}: {
  section: HomepageSectionLayout;
  index: number;
  total: number;
  onToggle: (enabled: boolean) => void;
  onMove: (direction: -1 | 1) => void;
  onPosition: (position: number) => void;
}) {
  const posId = useId();
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border px-3 py-2">
      <label className="flex min-w-0 flex-1 items-center gap-3 text-sm">
        <input
          type="checkbox"
          className="h-4 w-4 accent-[hsl(var(--accent))]"
          checked={section.enabled}
          onChange={(e) => onToggle(e.target.checked)}
        />
        <span className="truncate font-medium">{HOMEPAGE_SECTION_LABELS[section.id]}</span>
      </label>
      <div className="flex shrink-0 items-center gap-2">
        <Label htmlFor={posId} className="sr-only">
          Position for {HOMEPAGE_SECTION_LABELS[section.id]}
        </Label>
        <Input
          id={posId}
          type="number"
          min={1}
          max={total}
          className="h-9 w-16 px-2 text-center"
          value={index + 1}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (Number.isFinite(n)) onPosition(n);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp" && (e.altKey || e.metaKey)) {
              e.preventDefault();
              onMove(-1);
            }
            if (e.key === "ArrowDown" && (e.altKey || e.metaKey)) {
              e.preventDefault();
              onMove(1);
            }
          }}
        />
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
        <Label>Hero image URL</Label>
        <Input
          value={value.image_url}
          onChange={(e) => onChange({ image_url: e.target.value })}
          placeholder="Paste a URL or upload below"
        />
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
