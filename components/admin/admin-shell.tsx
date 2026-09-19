"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { adminLogout } from "@/app/admin/actions";
import { adminNav } from "@/lib/admin/entities";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Admin" className="flex flex-col gap-1">
      {adminNav.map((item) => {
        const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "rounded-lg px-3 py-2.5 text-sm hover:bg-secondary",
              active && "bg-secondary font-medium"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-ivory">
      <header className="sticky top-0 z-[70] flex items-center justify-between border-b bg-card px-4 py-3 lg:hidden">
        <Link href="/admin" className="font-serif text-lg">
          Maison Admin
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-expanded={open}
          aria-label={open ? "Close admin menu" : "Open admin menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      {open ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Close admin menu"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 top-0 flex w-[min(20rem,86vw)] flex-col overflow-y-auto border-r bg-card p-5 pt-[4.25rem] shadow-xl">
            <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
            <form action={adminLogout} className="mt-8">
              <Button type="submit" variant="outline" size="sm">
                Sign out
              </Button>
            </form>
            <p className="mt-6 text-xs text-muted-foreground">
              <Link href="/" onClick={() => setOpen(false)}>
                View site
              </Link>
            </p>
          </aside>
        </div>
      ) : null}

      <div className="lg:grid lg:min-h-screen lg:grid-cols-[240px_1fr]">
        <aside className="hidden border-r bg-card p-5 lg:block">
          <Link href="/admin" className="font-serif text-xl">
            Maison Admin
          </Link>
          <div className="mt-8">
            <NavLinks pathname={pathname} />
          </div>
          <form action={adminLogout} className="mt-8">
            <Button type="submit" variant="outline" size="sm">
              Sign out
            </Button>
          </form>
          <p className="mt-6 text-xs text-muted-foreground">
            <Link href="/">View site</Link>
          </p>
        </aside>
        <div className="p-4 sm:p-6 lg:p-10">{children}</div>
      </div>
    </div>
  );
}
