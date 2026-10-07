"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  FolderTree,
  HelpCircle,
  Home,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Menu,
  MessageSquare,
  Newspaper,
  Package,
  Settings,
  Star,
  Users,
  X,
} from "lucide-react";
import { adminLogout } from "@/app/admin/actions";
import { navForRole, ROLE_LABELS, type AdminRole } from "@/lib/admin/roles";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ICONS: Record<string, typeof Home> = {
  "/admin": LayoutDashboard,
  "/admin/homepage": Home,
  "/admin/about": LayoutTemplate,
  "/admin/products": Package,
  "/admin/categories": FolderTree,
  "/admin/leads": Newspaper,
  "/admin/chat-leads": MessageSquare,
  "/admin/bookings": CalendarDays,
  "/admin/testimonials": Star,
  "/admin/blog": BookOpen,
  "/admin/faqs": HelpCircle,
  "/admin/partners": Users,
  "/admin/pages": LayoutTemplate,
  "/admin/settings": Settings,
  "/admin/users": Users,
};

function NavLinks({
  pathname,
  role,
  onNavigate,
}: {
  pathname: string;
  role: AdminRole;
  onNavigate?: () => void;
}) {
  const items = useMemo(() => navForRole(role), [role]);
  const groups = useMemo(() => {
    const map = new Map<string, ReturnType<typeof navForRole>>();
    items.forEach((item) => {
      const list = map.get(item.group) || [];
      list.push(item);
      map.set(item.group, list);
    });
    return Array.from(map.entries());
  }, [items]);

  return (
    <nav aria-label="Admin" className="flex flex-col gap-5">
      {groups.map(([group, items]) => (
        <div key={group}>
          <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {group}
          </p>
          <div className="flex flex-col gap-0.5">
            {items.map((item) => {
              const active =
                pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              const Icon = ICONS[item.href] || LayoutDashboard;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function AdminShell({
  children,
  role = "superadmin",
}: {
  children: ReactNode;
  role?: AdminRole;
}) {
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
    <div className="min-h-dvh overflow-x-hidden bg-ivory">
      <header className="sticky top-0 z-[70] flex items-center justify-between gap-3 border-b bg-card px-4 py-3 lg:hidden">
        <Link href="/admin" className="truncate font-serif text-lg">
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
          <aside className="absolute inset-y-0 left-0 flex w-[min(20rem,86vw)] max-w-full flex-col overflow-y-auto border-r bg-card p-5 pt-20 shadow-xl">
            <NavLinks pathname={pathname} role={role} onNavigate={() => setOpen(false)} />
            <SidebarFooter role={role} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="lg:grid lg:min-h-dvh lg:grid-cols-[16.5rem_minmax(0,1fr)]">
        <aside className="sticky top-0 hidden h-dvh flex-col overflow-y-auto border-r bg-card p-5 lg:flex">
          <Link href="/admin" className="font-serif text-xl">
            Maison Admin
          </Link>
          <div className="mt-6 flex-1">
            <NavLinks pathname={pathname} role={role} />
          </div>
          <SidebarFooter role={role} />
        </aside>
        <div className="min-w-0 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}

function SidebarFooter({ role, onNavigate }: { role: AdminRole; onNavigate?: () => void }) {
  return (
    <div className="mt-8 space-y-3 border-t border-border/70 pt-5">
      <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {ROLE_LABELS[role]}
      </p>
      <Link
        href="/"
        onClick={onNavigate}
        className="block px-3 text-xs text-muted-foreground hover:text-foreground"
      >
        View site
      </Link>
      <form action={adminLogout}>
        <Button type="submit" variant="outline" size="sm" className="w-full gap-2">
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </Button>
      </form>
    </div>
  );
}
