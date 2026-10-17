import { LoginForm } from "./login-form";
import { getSiteSettings } from "@/lib/data/catalog";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadata(
    {
      title: "Admin login",
      description: `${settings.company_name} administration`,
      path: "/admin/login",
      noIndex: true,
    },
    settings
  );
}

export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex min-h-[70dvh] w-full max-w-md flex-col justify-center">
      <h1 className="font-serif text-3xl">Admin sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Demo credentials: admin@maisondrape.ae / admin123 (when Supabase is not configured).
      </p>
      <LoginForm />
    </main>
  );
}
