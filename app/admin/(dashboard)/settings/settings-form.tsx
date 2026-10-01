"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { saveSettings } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/admin/image-uploader";
import { TagInput } from "@/components/admin/tag-input";
import type { SiteSettings } from "@/lib/types";

const PAYMENT_SUGGESTIONS = [
  "Visa",
  "Mastercard",
  "American Express",
  "Apple Pay",
  "Google Pay",
  "PayPal",
  "Tabby",
  "Tamara",
  "Cash on Delivery",
  "Bank Transfer",
];

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

  function patchSocial(index: number, partial: Partial<SiteSettings["social_links"][number]>) {
    setSettings((s) => ({
      ...s,
      social_links: s.social_links.map((link, i) => (i === index ? { ...link, ...partial } : link)),
    }));
  }

  function addSocial() {
    setSettings((s) => ({ ...s, social_links: [...s.social_links, { label: "", href: "" }] }));
  }

  function removeSocial(index: number) {
    setSettings((s) => ({ ...s, social_links: s.social_links.filter((_, i) => i !== index) }));
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
              <Label htmlFor="site-url">Public site URL</Label>
              <Input
                id="site-url"
                placeholder="https://maisondrape.ae"
                value={settings.site_url}
                onChange={(e) => patch({ site_url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={settings.phone} onChange={(e) => patch({ phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={settings.email} onChange={(e) => patch({ email: e.target.value })} />
              <p className="text-xs text-muted-foreground">New estimate, booking and chatbot leads are emailed here.</p>
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
            <h2 className="font-serif text-xl">Social & payments</h2>
            <p className="text-xs text-muted-foreground">
              Social links render as icons in the footer. Payment methods show as accepted-payment badges.
            </p>
          </div>
          <div className="space-y-3">
            <Label>Social links</Label>
            {settings.social_links.map((link, index) => (
              <div key={index} className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={link.label}
                  placeholder="Instagram"
                  aria-label={`Social link ${index + 1} name`}
                  onChange={(e) => patchSocial(index, { label: e.target.value })}
                />
                <Input
                  value={link.href}
                  placeholder="https://instagram.com/yourbrand"
                  aria-label={`Social link ${index + 1} URL`}
                  onChange={(e) => patchSocial(index, { href: e.target.value })}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={`Remove ${link.label || "social link"}`}
                  onClick={() => removeSocial(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {!settings.social_links.length ? (
              <p className="text-sm text-muted-foreground">No social links yet.</p>
            ) : null}
            <Button type="button" variant="outline" size="sm" onClick={addSocial}>
              Add social link
            </Button>
          </div>
          <div className="space-y-2">
            <Label>Accepted payment methods</Label>
            <TagInput
              value={settings.payment_methods}
              onChange={(next) => patch({ payment_methods: next })}
              placeholder="Add a payment method and press Enter"
              suggestions={PAYMENT_SUGGESTIONS}
              emptyText="No payment methods yet. Add one below."
            />
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border bg-card p-4 sm:p-6">
          <div>
            <h2 className="font-serif text-xl">Analytics & pixels</h2>
            <p className="text-xs text-muted-foreground">
              Client-side tags load after cookie consent. Conversion API tokens stay admin-only and are not exposed on the public site.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="gtm">Google Tag Manager ID</Label>
              <Input id="gtm" placeholder="GTM-XXXXXXX" value={settings.gtm_id} onChange={(e) => patch({ gtm_id: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta-pixel">Facebook pixel ID</Label>
              <Input id="meta-pixel" placeholder="1234567890" value={settings.meta_pixel_id} onChange={(e) => patch({ meta_pixel_id: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ig-pixel">Instagram pixel ID</Label>
              <Input
                id="ig-pixel"
                placeholder="Same Meta dataset or dedicated IG pixel"
                value={settings.instagram_pixel_id}
                onChange={(e) => patch({ instagram_pixel_id: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tt-pixel">TikTok pixel ID</Label>
              <Input id="tt-pixel" placeholder="CXXXXXXXXXXXX" value={settings.tiktok_pixel_id} onChange={(e) => patch({ tiktok_pixel_id: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta-capi">Facebook CAPI access token</Label>
              <Input
                id="meta-capi"
                type="password"
                autoComplete="off"
                value={settings.meta_capi_access_token}
                onChange={(e) => patch({ meta_capi_access_token: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ig-capi">Instagram CAPI access token</Label>
              <Input
                id="ig-capi"
                type="password"
                autoComplete="off"
                value={settings.instagram_capi_access_token}
                onChange={(e) => patch({ instagram_capi_access_token: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tt-token">TikTok access token</Label>
              <Input
                id="tt-token"
                type="password"
                autoComplete="off"
                value={settings.tiktok_access_token}
                onChange={(e) => patch({ tiktok_access_token: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta-test">Meta test event code</Label>
              <Input
                id="meta-test"
                value={settings.meta_capi_test_event_code}
                onChange={(e) => patch({ meta_capi_test_event_code: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tt-test">TikTok test event code</Label>
              <Input
                id="tt-test"
                value={settings.tiktok_test_event_code}
                onChange={(e) => patch({ tiktok_test_event_code: e.target.value })}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border bg-card p-4 sm:p-6">
          <div>
            <h2 className="font-serif text-xl">Email delivery</h2>
            <p className="text-xs text-muted-foreground">
              Resend sends admin notifications for estimates, bookings and chatbot leads. The recipient is the contact email above.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="resend-key">Resend API key</Label>
              <Input
                id="resend-key"
                type="password"
                autoComplete="off"
                placeholder="re_xxxxxxxx"
                value={settings.resend_api_key}
                onChange={(e) => patch({ resend_api_key: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resend-from">From email</Label>
              <Input
                id="resend-from"
                placeholder="Maison Drape &lt;hello@maisondrape.ae&gt;"
                value={settings.resend_from_email}
                onChange={(e) => patch({ resend_from_email: e.target.value })}
              />
            </div>
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="gsc">Google Search Console verification</Label>
              <Input
                id="gsc"
                placeholder="Paste content value from google-site-verification"
                value={seo.google_site_verification}
                onChange={(e) => patchSeo({ google_site_verification: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Search Console HTML tag method: paste only the content value, not the full meta tag. After verify, submit /sitemap.xml.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bing">Bing Webmaster verification</Label>
              <Input
                id="bing"
                placeholder="msvalidate.01 content value"
                value={seo.bing_site_verification}
                onChange={(e) => patchSeo({ bing_site_verification: e.target.value })}
              />
            </div>
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
