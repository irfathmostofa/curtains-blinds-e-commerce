export type PixelConfig = {
  gtmId: string;
  metaPixelId: string;
  instagramPixelId: string;
  tiktokPixelId: string;
};

export function getPublicPixelConfig(overrides?: Partial<PixelConfig>): PixelConfig {
  return {
    gtmId: overrides?.gtmId || process.env.NEXT_PUBLIC_GTM_ID || "",
    metaPixelId: overrides?.metaPixelId || process.env.NEXT_PUBLIC_META_PIXEL_ID || "",
    instagramPixelId: overrides?.instagramPixelId || process.env.NEXT_PUBLIC_INSTAGRAM_PIXEL_ID || "",
    tiktokPixelId: overrides?.tiktokPixelId || process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "",
  };
}

export function getServerPixelSecrets() {
  return {
    meta: {
      pixelId: process.env.META_CAPI_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID || "",
      accessToken: process.env.META_CAPI_ACCESS_TOKEN || "",
      testEventCode: process.env.META_CAPI_TEST_EVENT_CODE || "",
    },
    instagram: {
      pixelId: process.env.INSTAGRAM_CAPI_PIXEL_ID || process.env.NEXT_PUBLIC_INSTAGRAM_PIXEL_ID || "",
      accessToken: process.env.INSTAGRAM_CAPI_ACCESS_TOKEN || process.env.META_CAPI_ACCESS_TOKEN || "",
      testEventCode: process.env.META_CAPI_TEST_EVENT_CODE || "",
    },
    tiktok: {
      pixelId: process.env.TIKTOK_PIXEL_ID || process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "",
      accessToken: process.env.TIKTOK_ACCESS_TOKEN || "",
      testEventCode: process.env.TIKTOK_TEST_EVENT_CODE || "",
    },
  };
}

export const META_PIXEL_IDS = (config: PixelConfig) =>
  Array.from(new Set([config.metaPixelId, config.instagramPixelId].filter(Boolean)));
