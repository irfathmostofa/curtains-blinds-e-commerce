import { getSiteSettings } from "@/lib/data/catalog";
import { SettingsForm } from "./settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSiteSettings();
  return <SettingsForm initial={settings} />;
}
