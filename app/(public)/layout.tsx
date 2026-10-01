import { ConstructionBanner } from "@/components/admin/construction-banner";
import { SiteShell } from "@/components/site-shell";
import { UnderConstruction } from "@/components/under-construction";
import { isAdminLoggedIn } from "@/lib/admin/session";
import { getSiteSettings } from "@/lib/data/catalog";

export const revalidate = 60;
export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  if (settings.under_construction) {
    const admin = await isAdminLoggedIn();
    if (!admin) return <UnderConstruction settings={settings} />;
    return (
      <>
        <ConstructionBanner />
        <SiteShell settings={settings}>{children}</SiteShell>
      </>
    );
  }
  return <SiteShell settings={settings}>{children}</SiteShell>;
}
