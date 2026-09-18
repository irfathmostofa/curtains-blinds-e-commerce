"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { adminLogout } from "@/app/admin/actions";
import { adminNav } from "@/lib/admin/entities";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-ivory">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-card px-4 py-3 lg:hidden">
        <Link href="/admin" className="font-serif text-lg">
          Maison Admin
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={open ? "Close admin menu" : "Open admin menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[240px_1fr]">
        <aside
          className={cn(
            "border-b bg-card p-5 lg:border-b-0 lg:border-r",
            open ? "block" : "hidden lg:block"
          )}
        >
          <Link href="/admin" className="hidden font-serif text-xl lg:block">
            Maison Admin
          </Link>
          <nav aria-label="Admin" className="mt-2 flex flex-col gap-1 lg:mt-8">
            {adminNav.map((item) => {
              const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm hover:bg-secondary",
                    active && "bg-secondary font-medium"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
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
        <div className="p-4 sm:p-6 lg:p-10">{children}</div>
      </div>
    </div>
  );
}
