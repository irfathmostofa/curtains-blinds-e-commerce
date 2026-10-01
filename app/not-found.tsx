import Link from "next/link";
import { UnderConstruction } from "@/components/under-construction";
import { isAdminLoggedIn } from "@/lib/admin/session";
import { getSiteSettings } from "@/lib/data/catalog";

export default async function NotFound() {
  const settings = await getSiteSettings();
  if (settings.under_construction && !(await isAdminLoggedIn())) {
    return <UnderConstruction settings={settings} />;
  }
  return (
    <main className="container pt-10 pb-16 text-center">
      <h1 className="font-serif text-4xl">Page not found</h1>
      <p className="mt-3 text-muted-foreground">The page you requested is not in this collection.</p>
      <Link href="/" className="mt-6 inline-block underline">
        Back to home
      </Link>
    </main>
  );
}
