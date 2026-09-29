import { SiteShell } from "@/components/site-shell";
import { getSiteSettings } from "@/lib/data/catalog";

export const revalidate = 60;

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return <SiteShell settings={settings}>{children}</SiteShell>;
}
