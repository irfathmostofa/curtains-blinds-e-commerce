"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NavLink, SiteSettings } from "@/lib/types";

export function Navbar({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const links: NavLink[] = settings.nav_links;

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="font-serif text-xl tracking-tight">
          {settings.company_name}
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Button asChild variant="outline" size="sm">
            <Link href="/get-estimate">Get estimate</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/book">Book a free visit</Link>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      <MobileMenu open={open} links={links} onClose={() => setOpen(false)} />
    </header>
  );
}

export function MobileMenu({
  open,
  links,
  onClose,
}: {
  open: boolean;
  links: NavLink[];
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="lg:hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <nav aria-label="Mobile navigation" className="container flex flex-col gap-2 pb-6">
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block rounded-xl px-3 py-2 text-sm hover:bg-secondary"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <Button asChild className="mt-2">
              <Link href="/book" onClick={onClose}>
                Book a free visit
              </Link>
            </Button>
          </nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
