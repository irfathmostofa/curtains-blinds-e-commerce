"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/language-toggle";
import { useLocale } from "@/components/locale-provider";
import type { NavLink, SiteSettings } from "@/lib/types";

export function Navbar({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const { t } = useLocale();
  const links: NavLink[] = settings.nav_links;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 1024) setOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="sticky top-0 z-[70] border-b border-border/80 bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-3 sm:h-[4.25rem]">
        <Link href="/" className="min-w-0 font-serif text-lg tracking-tight sm:text-xl" onClick={() => setOpen(false)}>
          {settings.company_name}
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
              {t(link.label)}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <LanguageToggle />
          <Button asChild variant="outline" size="sm">
            <Link href="/get-estimate">{t("Get estimate")}</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/book">{t("Book a free visit")}</Link>
          </Button>
        </div>
        <div className="relative z-50 flex items-center gap-2 lg:hidden">
          <LanguageToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t("Close menu") : t("Open menu")}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
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
  const { t } = useLocale();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          id="mobile-nav"
          className="fixed inset-0 z-[60] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            className="absolute inset-x-0 bottom-0 top-16 bg-ink/40 sm:top-[4.25rem]"
            aria-label={t("Close menu")}
            onClick={onClose}
          />
          <motion.nav
            aria-label="Mobile navigation"
            className="absolute inset-x-0 top-16 flex max-h-[calc(100dvh-4rem)] flex-col overflow-y-auto border-b border-border bg-background px-5 py-4 shadow-xl sm:top-[4.25rem]"
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
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
                  className="block rounded-xl px-3 py-3 text-sm hover:bg-secondary"
                >
                  {t(link.label)}
                </Link>
              </motion.div>
            ))}
            <Button asChild className="mt-2 w-full">
              <Link href="/book" onClick={onClose}>
                {t("Book a free visit")}
              </Link>
            </Button>
          </motion.nav>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
