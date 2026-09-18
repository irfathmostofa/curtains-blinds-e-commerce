"use client";

import { useState } from "react";
import { saveSettings } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/admin/image-uploader";
import type { SiteSettings } from "@/lib/types";

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [settings, setSettings] = useState<SiteSettings>(initial);
  const [message, setMessage] = useState<string | null>(null);
  const seo = settings.seo;

  function patch(partial: Partial<SiteSettings>) {
    setSettings((s) => ({ ...s, ...partial }));
  }

  function patchSeo(partial: Partial<SiteSettings["seo"]>) {
    setSettings((s) => ({ ...s, seo: { ...s.seo, ...partial } }));
  }

  return (
    <main className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl">Site settings</h1>
        <p className="text-sm text-muted-foreground">Contact, navigation and global SEO metadata without extra pages.</p>
      </div>

      <form
        className="space-y-8"
        onSubmit={async (e) => {
          e.preventDefault();
          await saveSettings(settings);
          setMessage("Saved.");
        }}
      >
        <section className="space-y-4 rounded-2xl border bg-card p-4 sm:p-6">
          <h2 className="font-serif text-xl">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">Company name</Label>
              <Input id="company" value={settings.company_name} onChange={(e) => patch({ company_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={settings.phone} onChange={(e) => patch({ phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={settings.email} onChange={(e) => patch({ email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wa">WhatsApp number</Label>
              <Input id="wa" value={settings.whatsapp} onChange={(e) => patch({ whatsapp: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Textarea id="tagline" value={settings.tagline} onChange={(e) => patch({ tagline: e.target.value })} />
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border bg-card p-4 sm:p-6">
          <div>
            <h2 className="font-serif text-xl">SEO metadata</h2>
            <p className="text-xs text-muted-foreground">Default title, description, keywords and social share image for the public site.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo-title">Default meta title</Label>
            <Input id="seo-title" value={seo.default_title} onChange={(e) => patchSeo({ default_title: e.target.value })} />
            <p className="text-xs text-muted-foreground">{seo.default_title.length}/60 characters</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo-desc">Default meta description</Label>
            <Textarea id="seo-desc" value={seo.default_description} onChange={(e) => patchSeo({ default_description: e.target.value })} />
            <p className="text-xs text-muted-foreground">{seo.default_description.length}/160 characters</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo-keys">Keywords</Label>
            <Input id="seo-keys" value={seo.keywords} onChange={(e) => patchSeo({ keywords: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo-tw">Twitter handle</Label>
            <Input id="seo-tw" value={seo.twitter_handle} onChange={(e) => patchSeo({ twitter_handle: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Open Graph image</Label>
            <ImageUploader
              folder="blog-images"
              suggestedAlt={`${settings.company_name} social share image`}
              nameHint="og-image"
              multiple={false}
              onUploaded={(asset) => patchSeo({ og_image: asset.url })}
            />
            {seo.og_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={seo.og_image} alt="Open Graph preview" className="mt-2 max-h-40 rounded-xl object-cover" />
            ) : null}
          </div>
          <div className="rounded-xl bg-secondary p-3">
            <p className="text-xs text-muted-foreground">Search preview</p>
            <p className="mt-1 truncate text-sm text-blue-800">{seo.default_title}</p>
            <p className="line-clamp-2 text-xs text-muted-foreground">{seo.default_description}</p>
          </div>
        </section>

        {message ? <p className="text-sm">{message}</p> : null}
        <Button type="submit">Save settings</Button>
      </form>
    </main>
  );
}
