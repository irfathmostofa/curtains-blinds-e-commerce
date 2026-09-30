import type { SiteSettings } from "@/lib/types";

export type PixelConfig = {
  gtmId: string;
  metaPixelId: string;
  instagramPixelId: string;
  tiktokPixelId: string;
};

export function getPublicPixelConfig(settings?: Partial<SiteSettings> | Partial<PixelConfig>): PixelConfig {
  const s = settings as Partial<SiteSettings> | undefined;
  const p = settings as Partial<PixelConfig> | undefined;
  return {
    gtmId: s?.gtm_id || p?.gtmId || "",
    metaPixelId: s?.meta_pixel_id || p?.metaPixelId || "",
    instagramPixelId: s?.instagram_pixel_id || p?.instagramPixelId || "",
    tiktokPixelId: s?.tiktok_pixel_id || p?.tiktokPixelId || "",
  };
}

export function getServerPixelSecrets(settings?: Partial<SiteSettings>) {
  return {
    meta: {
      pixelId: settings?.meta_pixel_id || "",
      accessToken: settings?.meta_capi_access_token || "",
      testEventCode: settings?.meta_capi_test_event_code || "",
    },
    instagram: {
      pixelId: settings?.instagram_pixel_id || "",
      accessToken: settings?.instagram_capi_access_token || settings?.meta_capi_access_token || "",
      testEventCode: settings?.meta_capi_test_event_code || "",
    },
    tiktok: {
      pixelId: settings?.tiktok_pixel_id || "",
      accessToken: settings?.tiktok_access_token || "",
      testEventCode: settings?.tiktok_test_event_code || "",
    },
  };
}

export const META_PIXEL_IDS = (config: PixelConfig) =>
  Array.from(new Set([config.metaPixelId, config.instagramPixelId].filter(Boolean)));
