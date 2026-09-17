import { LoginForm } from "./login-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Admin login",
  description: "Maison Drape administration",
  path: "/admin/login",
  noIndex: true,
});

export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center">
      <h1 className="font-serif text-3xl">Admin sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Demo credentials: admin@maisondrape.ae / admin123 (when Supabase is not configured).
      </p>
      <LoginForm />
    </main>
  );
}
