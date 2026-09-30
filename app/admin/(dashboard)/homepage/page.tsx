import { getAdminSiteSettings } from "@/lib/data/catalog";
import { HomepageForm } from "./homepage-form";

export const dynamic = "force-dynamic";

export default async function HomepageAdminPage() {
  const settings = await getAdminSiteSettings();
  return <HomepageForm initial={settings} />;
}
