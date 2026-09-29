import { getSiteSettings } from "@/lib/data/catalog";
import { getPublicPixelConfig, META_PIXEL_IDS } from "@/lib/analytics/config";
import { AnalyticsLoader } from "@/components/analytics-loader";

export async function AnalyticsScripts() {
  const settings = await getSiteSettings();
  const config = getPublicPixelConfig({
    gtmId: settings.gtm_id,
    metaPixelId: settings.meta_pixel_id,
    instagramPixelId: settings.instagram_pixel_id,
    tiktokPixelId: settings.tiktok_pixel_id,
  });
  const metaIds = META_PIXEL_IDS(config);
  if (!config.gtmId && !metaIds.length && !config.tiktokPixelId) return null;
  return <AnalyticsLoader config={config} metaIds={metaIds} />;
}
