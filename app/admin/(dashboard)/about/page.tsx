import { getAdminSiteSettings } from "@/lib/data/catalog";
import { AboutForm } from "./about-form";

export const dynamic = "force-dynamic";

export default async function AboutAdminPage() {
  const settings = await getAdminSiteSettings();
  return <AboutForm initial={settings} />;
}
