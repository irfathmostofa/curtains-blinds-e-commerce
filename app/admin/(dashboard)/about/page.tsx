import { requireAdminPage } from "@/lib/admin/guard";
import { getAdminSiteSettings } from "@/lib/data/catalog";
import { AboutForm } from "./about-form";

export const dynamic = "force-dynamic";

export default async function AboutAdminPage() {
  await requireAdminPage("/admin/about");
  const settings = await getAdminSiteSettings();
  return <AboutForm initial={settings} />;
}
