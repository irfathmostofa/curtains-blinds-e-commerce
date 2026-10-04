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
import { ABOUT_SECTION_LABELS } from "@/lib/site";
import type { AboutContent, AboutSectionLayout, AboutTeamMember, SiteSettings } from "@/lib/types";

const EMPTY_MEMBER: AboutTeamMember = {
  name: "",
  role: "",
  bio: "",
  image_url: "",
  image_alt: "",
};

const TABS = [
  { id: "layout", label: "Layout" },
  { id: "intro", label: "Image and content" },
  { id: "mission_vision", label: "Mission and vision" },
  { id: "team", label: "Team" },
  { id: "cta", label: "CTA" },
  { id: "seo", label: "SEO" },
] as const;

export function AboutForm({ initial }: { initial: SiteSettings }) {
  const [about, setAbout] = useState<AboutContent>(initial.about);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("layout");
  const [query, setQuery] = useState("");

  function patchIntro(partial: Partial<AboutContent["intro"]>) {
    setAbout((a) => ({ ...a, intro: { ...a.intro, ...partial } }));
  }

  function patchMission(partial: Partial<AboutContent["mission_vision"]>) {
    setAbout((a) => ({ ...a, mission_vision: { ...a.mission_vision, ...partial } }));
  }

  function patchTeamMeta(partial: Partial<Omit<AboutContent["team"], "members">>) {
    setAbout((a) => ({ ...a, team: { ...a.team, ...partial } }));
  }

  function patchMember(index: number, partial: Partial<AboutTeamMember>) {
    setAbout((a) => ({
      ...a,
      team: {
        ...a.team,
        members: a.team.members.map((m, i) => (i === index ? { ...m, ...partial } : m)),
      },
    }));
  }

  function addMember() {
    setAbout((a) => ({ ...a, team: { ...a.team, members: [...a.team.members, { ...EMPTY_MEMBER }] } }));
  }

  function removeMember(index: number) {
    setAbout((a) => ({
      ...a,
      team: { ...a.team, members: a.team.members.filter((_, i) => i !== index) },
    }));
  }

  function patchCta(partial: Partial<AboutContent["cta"]>) {
    setAbout((a) => ({ ...a, cta: { ...a.cta, ...partial } }));
  }

  function moveSection(index: number, direction: -1 | 1) {
    setAbout((a) => {
      const next = [...a.section_order];
      const target = index + direction;
      if (target < 0 || target >= next.length) return a;
      const current = next[index];
      next[index] = next[target];
      next[target] = current;
      return { ...a, section_order: next };
    });
  }

  function setSectionPosition(index: number, position: number) {
    setAbout((a) => {
      const next = [...a.section_order];
      const item = next.splice(index, 1)[0];
      const clamped = Math.max(1, Math.min(next.length + 1, Math.round(position))) - 1;
      next.splice(clamped, 0, item);
      return { ...a, section_order: next };
    });
  }

  function toggleSection(index: number, enabled: boolean) {
    setAbout((a) => ({
      ...a,
      section_order: a.section_order.map((s, i) => (i === index ? { ...s, enabled } : s)),
    }));
  }

  const persist = useCallback(async () => {
    setSaving(true);
    const result = await saveSettings({ ...initial, about });
    setSaving(false);
    if (result && "error" in result && result.error) {
      setMessage(result.error);
      return;
    }
    setMessage("About page saved. Refresh the public site to see changes.");
  }, [about, initial]);

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
        <h1 className="font-serif text-3xl">About</h1>
        <p className="text-sm text-muted-foreground">
          Open a tab, type to filter tabs, then press Ctrl/Cmd+S to save.
        </p>
      </div>

      <form className="space-y-6" onSubmit={onSubmit}>
        <Tabs value={tab} onValueChange={setTab}>
          <div className="sticky top-16 z-20 -mx-1 space-y-3 rounded-2xl border bg-card/95 p-3 backdrop-blur sm:p-4 lg:top-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
              <div className="min-w-0 flex-1 space-y-1">
                <Label htmlFor="about-search">Find a tab</Label>
                <Input
                  id="about-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && filteredTabs[0]) {
                      e.preventDefault();
                      setTab(filteredTabs[0].id);
                    }
                  }}
                  placeholder="Type intro, team, mission…"
                />
              </div>
              <Button type="button" disabled={saving} className="w-full sm:w-auto" onClick={() => void persist()}>
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
                {about.section_order.map((section, index) => (
                  <SectionRow
                    key={section.id}
                    section={section}
                    index={index}
                    total={about.section_order.length}
                    onToggle={(enabled) => toggleSection(index, enabled)}
                    onMove={(dir) => moveSection(index, dir)}
                    onPosition={(pos) => setSectionPosition(index, pos)}
                  />
                ))}
              </div>
            </Panel>
          </TabsContent>

          <TabsContent value="intro">
            <Panel title="Image and content" hint="Copy on the left, image on the right.">
              <div className="space-y-2">
                <Label htmlFor="about-intro-eyebrow">Eyebrow</Label>
                <Input
                  id="about-intro-eyebrow"
                  value={about.intro.eyebrow}
                  onChange={(e) => patchIntro({ eyebrow: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-intro-title">Title</Label>
                <Input
                  id="about-intro-title"
                  value={about.intro.title}
                  onChange={(e) => patchIntro({ title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <RichTextEditor
                  value={about.intro.subtitle}
                  onChange={(html) => patchIntro({ subtitle: html })}
                  minHeight="160px"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="about-intro-primary-label">Primary button label</Label>
                  <Input
                    id="about-intro-primary-label"
                    value={about.intro.primary_cta_label}
                    onChange={(e) => patchIntro({ primary_cta_label: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about-intro-primary-href">Primary button link</Label>
                  <Input
                    id="about-intro-primary-href"
                    value={about.intro.primary_cta_href}
                    onChange={(e) => patchIntro({ primary_cta_href: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about-intro-secondary-label">Secondary button label</Label>
                  <Input
                    id="about-intro-secondary-label"
                    value={about.intro.secondary_cta_label}
                    onChange={(e) => patchIntro({ secondary_cta_label: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about-intro-secondary-href">Secondary button link</Label>
                  <Input
                    id="about-intro-secondary-href"
                    value={about.intro.secondary_cta_href}
                    onChange={(e) => patchIntro({ secondary_cta_href: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-intro-image-alt">Image alt text</Label>
                <Input
                  id="about-intro-image-alt"
                  value={about.intro.image_alt || ""}
                  onChange={(e) => patchIntro({ image_alt: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-intro-image-url">Image URL</Label>
                <Input
                  id="about-intro-image-url"
                  value={about.intro.image_url || ""}
                  onChange={(e) => patchIntro({ image_url: e.target.value })}
                  placeholder="Paste a URL or upload below"
                />
              </div>
              <div className="space-y-2">
                <Label>Upload image</Label>
                <ImageUploader
                  folder="blog-images"
                  suggestedAlt={about.intro.image_alt || "Maison Drape about"}
                  nameHint="about-intro"
                  multiple={false}
                  onUploaded={(asset) =>
                    patchIntro({ image_url: asset.url, image_alt: asset.alt || about.intro.image_alt })
                  }
                />
                {about.intro.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={about.intro.image_url}
                    alt={about.intro.image_alt}
                    className="mt-2 max-h-56 w-full rounded-xl object-cover"
                  />
                ) : null}
              </div>
            </Panel>
          </TabsContent>

          <TabsContent value="mission_vision">
            <Panel title="Mission and vision">
              <div className="space-y-2">
                <Label htmlFor="mv-eyebrow">Eyebrow</Label>
                <Input
                  id="mv-eyebrow"
                  value={about.mission_vision.eyebrow}
                  onChange={(e) => patchMission({ eyebrow: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mv-title">Section title</Label>
                <Input
                  id="mv-title"
                  value={about.mission_vision.title}
                  onChange={(e) => patchMission({ title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Section subtitle</Label>
                <RichTextEditor
                  value={about.mission_vision.subtitle}
                  onChange={(html) => patchMission({ subtitle: html })}
                  minHeight="100px"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="mv-mission-title">Mission title</Label>
                  <Input
                    id="mv-mission-title"
                    value={about.mission_vision.mission_title}
                    onChange={(e) => patchMission({ mission_title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mv-vision-title">Vision title</Label>
                  <Input
                    id="mv-vision-title"
                    value={about.mission_vision.vision_title}
                    onChange={(e) => patchMission({ vision_title: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Mission</Label>
                <RichTextEditor
                  value={about.mission_vision.mission_body}
                  onChange={(html) => patchMission({ mission_body: html })}
                  minHeight="140px"
                />
              </div>
              <div className="space-y-2">
                <Label>Vision</Label>
                <RichTextEditor
                  value={about.mission_vision.vision_body}
                  onChange={(html) => patchMission({ vision_body: html })}
                  minHeight="140px"
                />
              </div>
            </Panel>
          </TabsContent>

          <TabsContent value="team">
            <Panel title="Team" hint="Add people shown on the About page.">
              <div className="space-y-2">
                <Label htmlFor="team-eyebrow">Eyebrow</Label>
                <Input
                  id="team-eyebrow"
                  value={about.team.eyebrow}
                  onChange={(e) => patchTeamMeta({ eyebrow: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-title">Title</Label>
                <Input
                  id="team-title"
                  value={about.team.title}
                  onChange={(e) => patchTeamMeta({ title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <RichTextEditor
                  value={about.team.subtitle}
                  onChange={(html) => patchTeamMeta({ subtitle: html })}
                  minHeight="100px"
                />
              </div>
              {(about.team.members.length ? about.team.members : [{ ...EMPTY_MEMBER }]).map((member, i) => (
                <div key={i} className="space-y-4 rounded-xl border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">Member {i + 1}</p>
                    {about.team.members.length > 1 ? (
                      <Button type="button" variant="outline" size="sm" onClick={() => removeMember(i)}>
                        Remove
                      </Button>
                    ) : null}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input value={member.name} onChange={(e) => patchMember(i, { name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input value={member.role} onChange={(e) => patchMember(i, { role: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <RichTextEditor
                      value={member.bio}
                      onChange={(html) => patchMember(i, { bio: html })}
                      minHeight="100px"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Photo alt text</Label>
                    <Input
                      value={member.image_alt}
                      onChange={(e) => patchMember(i, { image_alt: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Photo URL</Label>
                    <Input
                      value={member.image_url}
                      onChange={(e) => patchMember(i, { image_url: e.target.value })}
                      placeholder="Paste a URL or upload below"
                    />
                  </div>
                  <ImageUploader
                    folder="blog-images"
                    suggestedAlt={member.image_alt || member.name || "Team member"}
                    nameHint={`about-team-${i}`}
                    multiple={false}
                    onUploaded={(asset) =>
                      patchMember(i, { image_url: asset.url, image_alt: asset.alt || member.image_alt })
                    }
                  />
                  {member.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.image_url}
                      alt={member.image_alt || member.name}
                      className="mt-2 max-h-40 w-full rounded-xl object-cover"
                    />
                  ) : null}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addMember}>
                Add team member
              </Button>
            </Panel>
          </TabsContent>

          <TabsContent value="cta">
            <Panel title="Estimate CTA">
              <div className="space-y-2">
                <Label htmlFor="about-cta-title">Title</Label>
                <Input
                  id="about-cta-title"
                  value={about.cta.title}
                  onChange={(e) => patchCta({ title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <RichTextEditor
                  value={about.cta.subtitle}
                  onChange={(html) => patchCta({ subtitle: html })}
                  minHeight="100px"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="about-cta-label">Button label</Label>
                  <Input
                    id="about-cta-label"
                    value={about.cta.button_label}
                    onChange={(e) => patchCta({ button_label: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about-cta-href">Button link</Label>
                  <Input
                    id="about-cta-href"
                    value={about.cta.button_href}
                    onChange={(e) => patchCta({ button_href: e.target.value })}
                  />
                </div>
              </div>
            </Panel>
          </TabsContent>

          <TabsContent value="seo">
            <Panel title="SEO" hint="Used for the About page title and description.">
              <div className="space-y-2">
                <Label htmlFor="about-seo-title">SEO title</Label>
                <Input
                  id="about-seo-title"
                  value={about.seo_title}
                  onChange={(e) => setAbout((a) => ({ ...a, seo_title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-seo-description">SEO description</Label>
                <Input
                  id="about-seo-description"
                  value={about.seo_description}
                  onChange={(e) => setAbout((a) => ({ ...a, seo_description: e.target.value }))}
                />
              </div>
            </Panel>
          </TabsContent>
        </Tabs>

        {message ? <p className="text-sm">{message}</p> : null}
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save about page"}
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
  section: AboutSectionLayout;
  index: number;
  total: number;
  onToggle: (enabled: boolean) => void;
  onMove: (direction: -1 | 1) => void;
  onPosition: (position: number) => void;
}) {
  const posId = useId();
  return (
    <div className="flex flex-col gap-3 rounded-xl border px-3 py-2 sm:flex-row sm:flex-wrap sm:items-center">
      <label className="flex min-w-0 flex-1 items-center gap-3 text-sm">
        <input
          type="checkbox"
          className="h-4 w-4 accent-[hsl(var(--accent))]"
          checked={section.enabled}
          onChange={(e) => onToggle(e.target.checked)}
        />
        <span className="truncate font-medium">{ABOUT_SECTION_LABELS[section.id]}</span>
      </label>
      <div className="flex shrink-0 items-center gap-2">
        <Label htmlFor={posId} className="sr-only">
          Position for {ABOUT_SECTION_LABELS[section.id]}
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
