import Link from "next/link";
import { adminLogout } from "@/app/admin/actions";
import { adminNav } from "@/lib/admin/entities";
import { Button } from "@/components/ui/button";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory">
      <div className="grid min-h-screen lg:grid-cols-[240px_1fr]">
        <aside className="border-r bg-card p-5">
          <Link href="/admin" className="font-serif text-xl">
            Maison Admin
          </Link>
          <nav aria-label="Admin" className="mt-8 flex flex-col gap-1">
            {adminNav.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-sm hover:bg-secondary">
                {item.label}
              </Link>
            ))}
          </nav>
          <form action={adminLogout} className="mt-8">
            <Button type="submit" variant="outline" size="sm">
              Sign out
            </Button>
          </form>
          <p className="mt-6 text-xs text-muted-foreground">
            <Link href="/">View site</Link>
          </p>
        </aside>
        <div className="p-6 lg:p-10">{children}</div>
      </div>
    </div>
  );
}
