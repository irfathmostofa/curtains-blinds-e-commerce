"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { saveSettings } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SOCIAL_PLATFORMS, SocialIcon, socialPlatformByValue } from "@/components/social-icon";
import {
  WEEKDAY_LABELS,
  WEEKDAYS,
  normalizeBusinessHoursSchedule,
  normalizeLocations,
  normalizePaymentMethods,
} from "@/lib/site";
import type { DayHours, PaymentMethod, SiteSettings, Weekday } from "@/lib/types";

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
  const [settings, setSettings] = useState<SiteSettings>(() => ({
    ...initial,
    payment_methods: normalizePaymentMethods(initial.payment_methods),
    locations: normalizeLocations(initial.locations),
    business_hours_schedule: normalizeBusinessHoursSchedule(initial.business_hours_schedule),
  }));
  const [message, setMessage] = useState<string | null>(null);
  const [pendingNetwork, setPendingNetwork] = useState("");
  const [tab, setTab] = useState("access");
  const seo = settings.seo;
  const usedNetworks = new Set(settings.social_links.map((link) => link.label));
  const unusedNetworks = SOCIAL_PLATFORMS.filter((platform) => !usedNetworks.has(platform.value));

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
    const network = socialPlatformByValue(pendingNetwork);
    if (!network) return;
    setSettings((s) => {
      if (s.social_links.some((link) => link.label === network.value)) return s;
      return { ...s, social_links: [...s.social_links, { label: network.value, href: "" }] };
    });
    setPendingNetwork("");
  }

  function removeSocial(index: number) {
    setSettings((s) => ({ ...s, social_links: s.social_links.filter((_, i) => i !== index) }));
  }

  function patchPayment(index: number, partial: Partial<PaymentMethod>) {
    setSettings((s) => ({
      ...s,
      payment_methods: s.payment_methods.map((method, i) => (i === index ? { ...method, ...partial } : method)),
    }));
  }

  function addPayment(label = "") {
    setSettings((s) => {
      const nextLabel = label.trim();
      if (nextLabel && s.payment_methods.some((m) => m.label === nextLabel)) return s;
      return { ...s, payment_methods: [...s.payment_methods, { label: nextLabel || "Visa" }] };
    });
  }

  function removePayment(index: number) {
    setSettings((s) => ({ ...s, payment_methods: s.payment_methods.filter((_, i) => i !== index) }));
  }

  function patchLocation(index: number, partial: Partial<SiteSettings["locations"][number]>) {
    setSettings((s) => ({
      ...s,
      locations: s.locations.map((loc, i) => (i === index ? { ...loc, ...partial } : loc)),
    }));
  }

  function addLocation() {
    setSettings((s) => ({
      ...s,
      locations: [...s.locations, { city: "", address: "", phone: s.phone || "", mapEmbedUrl: "" }],
    }));
  }

  function removeLocation(index: number) {
    setSettings((s) => ({ ...s, locations: s.locations.filter((_, i) => i !== index) }));
  }

  function patchHoursDay(day: Weekday, partial: Partial<DayHours>) {
    setSettings((s) => ({
      ...s,
      business_hours_schedule: {
        ...s.business_hours_schedule,
        days: {
          ...s.business_hours_schedule.days,
          [day]: { ...s.business_hours_schedule.days[day], ...partial },
        },
      },
    }));
  }

  const unusedPayments = PAYMENT_SUGGESTIONS.filter(
    (name) => !settings.payment_methods.some((method) => method.label === name)
  );

  return (
    <main className="mx-auto max-w-3xl space-y-8 pb-24">
      <div>
        <h1 className="font-serif text-3xl">Site settings</h1>
        <p className="text-sm text-muted-foreground">Contact, visit hours, analytics and SEO in separate tabs.</p>
      </div>

      <form
        className="space-y-8"
        onSubmit={async (e) => {
          e.preventDefault();
          const result = await saveSettings(settings);
          if (result && "error" in result && result.error) {
            setMessage(result.error);
            return;
          }
          setMessage("Saved.");
        }}
      >
        <Tabs value={tab} onValueChange={setTab}>
          <div className="sticky top-16 z-20 -mx-1 space-y-3 rounded-2xl border bg-card/95 p-3 backdrop-blur sm:p-4 lg:top-0">
            <TabsList>
              <TabsTrigger value="access">Access</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="visit">Visit</TabsTrigger>
              <TabsTrigger value="hours">Hours</TabsTrigger>
              <TabsTrigger value="social">Social & payments</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>
            {message ? <p className="text-sm">{message}</p> : null}
          </div>

        <TabsContent value="access">
        <section className="space-y-4 rounded-2xl border bg-card p-4 sm:p-6">
          <div>
            <h2 className="font-serif text-xl">Site access</h2>
            <p className="text-xs text-muted-foreground">
              When under construction is on, visitors see a holding page. Logged-in admins can still browse the full site.
            </p>
          </div>
          <label className="flex items-center gap-3 rounded-xl border px-3 py-3 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[hsl(var(--accent))]"
              checked={Boolean(settings.under_construction)}
              onChange={(e) => patch({ under_construction: e.target.checked })}
            />
            Under construction mode
          </label>
        </section>
        </TabsContent>

        <TabsContent value="contact">
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
              <Label htmlFor="email">Inbox email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@gmail.com"
                value={settings.email}
                onChange={(e) => patch({ email: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Lead, booking and chatbot alerts are delivered here. A Gmail address works as the inbox.
              </p>
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
        </TabsContent>

        <TabsContent value="visit">
          <section className="space-y-4 rounded-2xl border bg-card p-4 sm:p-6">
            <div>
              <h2 className="font-serif text-xl">Visit locations</h2>
              <p className="text-xs text-muted-foreground">Shown in the footer Visit column and on the About page.</p>
            </div>
            {settings.locations.map((loc, index) => (
              <div key={index} className="space-y-3 rounded-xl border p-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`loc-city-${index}`}>City</Label>
                    <Input
                      id={`loc-city-${index}`}
                      value={loc.city}
                      placeholder="Dubai"
                      onChange={(e) => patchLocation(index, { city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`loc-phone-${index}`}>Phone</Label>
                    <Input
                      id={`loc-phone-${index}`}
                      value={loc.phone}
                      placeholder="+971 4 555 1200"
                      onChange={(e) => patchLocation(index, { phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`loc-address-${index}`}>Address</Label>
                  <Input
                    id={`loc-address-${index}`}
                    value={loc.address}
                    placeholder="Street, area, city"
                    onChange={(e) => patchLocation(index, { address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`loc-map-${index}`}>Map embed URL</Label>
                  <Input
                    id={`loc-map-${index}`}
                    value={loc.mapEmbedUrl}
                    placeholder="https://maps.google.com/maps?q=..."
                    onChange={(e) => patchLocation(index, { mapEmbedUrl: e.target.value })}
                  />
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => removeLocation(index)}>
                  Remove location
                </Button>
              </div>
            ))}
            {!settings.locations.length ? (
              <p className="text-sm text-muted-foreground">No visit locations yet. Add one below.</p>
            ) : null}
            <Button type="button" variant="outline" size="sm" onClick={addLocation}>
              Add location
            </Button>
          </section>
        </TabsContent>

        <TabsContent value="hours">
          <section className="space-y-4 rounded-2xl border bg-card p-4 sm:p-6">
            <div>
              <h2 className="font-serif text-xl">Available time</h2>
              <p className="text-xs text-muted-foreground">
                Weekly hours drive the live Open now / Closed now status in the footer.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours-tz">Timezone</Label>
              <Input
                id="hours-tz"
                value={settings.business_hours_schedule.timezone}
                placeholder="Asia/Dubai"
                onChange={(e) =>
                  patch({
                    business_hours_schedule: {
                      ...settings.business_hours_schedule,
                      timezone: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              {WEEKDAYS.map((day) => {
                const hours = settings.business_hours_schedule.days[day];
                return (
                  <div key={day} className="grid items-center gap-2 rounded-xl border px-3 py-2 sm:grid-cols-[7rem_auto_1fr_1fr]">
                    <p className="text-sm font-medium">{WEEKDAY_LABELS[day]}</p>
                    <label className="flex items-center gap-2 text-xs text-muted-foreground">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-[hsl(var(--accent))]"
                        checked={hours.closed}
                        onChange={(e) => patchHoursDay(day, { closed: e.target.checked })}
                      />
                      Closed
                    </label>
                    <Input
                      type="time"
                      aria-label={`${WEEKDAY_LABELS[day]} opens`}
                      value={hours.open}
                      disabled={hours.closed}
                      onChange={(e) => patchHoursDay(day, { open: e.target.value })}
                    />
                    <Input
                      type="time"
                      aria-label={`${WEEKDAY_LABELS[day]} closes`}
                      value={hours.close}
                      disabled={hours.closed}
                      onChange={(e) => patchHoursDay(day, { close: e.target.value })}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="social">
        <section className="space-y-4 rounded-2xl border bg-card p-4 sm:p-6">
          <div>
            <h2 className="font-serif text-xl">Social & payments</h2>
            <p className="text-xs text-muted-foreground">
              Social links render as icons in the footer. Payment methods show as accepted-payment badges.
            </p>
          </div>
          <div className="space-y-3">
            <Label>Social links</Label>
            <p className="text-xs text-muted-foreground">Select a network icon first, then add its profile URL.</p>
            {unusedNetworks.length ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <select
                  className="h-11 min-w-0 flex-1 rounded-xl border bg-card px-3 sm:max-w-xs"
                  value={pendingNetwork}
                  aria-label="Select social network"
                  onChange={(e) => setPendingNetwork(e.target.value)}
                >
                  <option value="">Select icon</option>
                  {unusedNetworks.map((platform) => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </select>
                <Button type="button" variant="outline" size="sm" onClick={addSocial} disabled={!pendingNetwork}>
                  Add
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">All available networks are already added.</p>
            )}
            {settings.social_links.map((link, index) => {
              const platform = socialPlatformByValue(link.label);
              return (
                <div key={`${link.label}-${index}`} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="inline-flex h-11 min-w-[10rem] items-center gap-2 rounded-xl border bg-secondary px-3 text-sm">
                    <SocialIcon label={link.label} href={link.href} className="h-4 w-4 text-foreground" />
                    {platform?.label || link.label}
                  </div>
                  <Input
                    value={link.href}
                    placeholder={platform?.placeholder || "https://"}
                    aria-label={`${link.label || "Social"} URL`}
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
              );
            })}
            {!settings.social_links.length ? (
              <p className="text-sm text-muted-foreground">No social links yet. Select an icon above to start.</p>
            ) : null}
          </div>
          <div className="space-y-3">
            <Label>Accepted payment methods</Label>
            {settings.payment_methods.map((method, index) => (
              <div key={index} className="space-y-3 rounded-xl border p-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Input
                    value={method.label}
                    placeholder="Visa"
                    aria-label={`Payment method ${index + 1} name`}
                    onChange={(e) => patchPayment(index, { label: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label={`Remove ${method.label || "payment method"}`}
                    onClick={() => removePayment(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Logo image</Label>
                  <ImageUploader
                    folder="payment-logos"
                    suggestedAlt={method.label || "Payment method"}
                    nameHint={`payment-${method.label || index}`}
                    multiple={false}
                    inputId={`payment-alt-${index}`}
                    onUploaded={(asset) => patchPayment(index, { image_url: asset.url })}
                  />
                  {method.image_url ? (
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={method.image_url} alt={method.label} className="h-8 w-auto max-w-24 object-contain" />
                      <button
                        type="button"
                        className="text-xs underline"
                        onClick={() => patchPayment(index, { image_url: "" })}
                      >
                        Remove image
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
            {!settings.payment_methods.length ? (
              <p className="text-sm text-muted-foreground">No payment methods yet. Add one below.</p>
            ) : null}
            {unusedPayments.length ? (
              <div className="flex flex-wrap gap-2">
                {unusedPayments.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className="rounded-full border border-dashed px-3 py-1 text-xs text-muted-foreground hover:border-accent hover:text-foreground"
                    onClick={() => addPayment(name)}
                  >
                    + {name}
                  </button>
                ))}
              </div>
            ) : null}
            <Button type="button" variant="outline" size="sm" onClick={() => addPayment("Custom")}>
              Add payment method
            </Button>
          </div>
        </section>
        </TabsContent>

        <TabsContent value="analytics">
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
        </TabsContent>

        <TabsContent value="email">
        <section className="space-y-4 rounded-2xl border bg-card p-4 sm:p-6">
          <div>
            <h2 className="font-serif text-xl">Email delivery</h2>
            <p className="text-xs text-muted-foreground">
              Resend sends admin notifications for estimates, bookings and chatbot leads to the inbox email on the Contact tab. Gmail works as the recipient. It cannot be used as the From address.
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
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="resend-from">From email</Label>
              <Input
                id="resend-from"
                placeholder="Maison Drape &lt;hello@yourdomain.com&gt;"
                value={settings.resend_from_email}
                onChange={(e) => patch({ resend_from_email: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Must be a domain you verified in Resend. Leave blank to send from onboarding@resend.dev while testing. Do not put a Gmail address here.
              </p>
            </div>
          </div>
        </section>
        </TabsContent>

        <TabsContent value="seo">
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
        </TabsContent>
        </Tabs>

        {message ? <p className="text-sm">{message}</p> : null}
        <Button type="submit" className="w-full sm:w-auto">Save settings</Button>
      </form>
    </main>
  );
}
