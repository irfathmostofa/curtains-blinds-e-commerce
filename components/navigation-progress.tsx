"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import { useLocale } from "@/components/locale-provider";

export function startNavigationProgress() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("md:nav-start"));
}

function isInternalNav(anchor: HTMLAnchorElement, event: MouseEvent) {
  if (event.defaultPrevented) return false;
  if (event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    if (url.pathname === window.location.pathname && url.search === window.location.search) return false;
    return true;
  } catch {
    return false;
  }
}

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t, dir } = useLocale();
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [progress, setProgress] = useState(0);
  const active = useRef(false);
  const routeKey = `${pathname}?${searchParams.toString()}`;
  const ready = useRef(false);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const finish = useCallback(() => {
    if (!active.current) return;
    active.current = false;
    clearTimers();
    setProgress(100);
    setOverlay(false);
    timers.current.push(
      window.setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 280)
    );
  }, [clearTimers]);

  const start = useCallback(() => {
    if (active.current) {
      setProgress((p) => Math.min(p, 32));
    } else {
      active.current = true;
      setVisible(true);
      setOverlay(false);
      setProgress(12);
    }
    clearTimers();
    timers.current.push(window.setTimeout(() => setOverlay(true), 320));
    const bump = (delay: number, to: number) => {
      timers.current.push(
        window.setTimeout(() => {
          if (active.current) setProgress((p) => (p < to ? to : p));
        }, delay)
      );
    };
    bump(180, 38);
    bump(480, 58);
    bump(980, 72);
    bump(1800, 84);
    bump(3200, 91);
    timers.current.push(window.setTimeout(finish, 12000));
  }, [clearTimers, finish]);

  useEffect(() => {
    if (!ready.current) {
      ready.current = true;
      return;
    }
    finish();
  }, [routeKey, finish]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (!isInternalNav(anchor, event)) return;
      start();
    }

    function onPopState() {
      start();
    }

    function onCustomStart() {
      start();
    }

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    window.addEventListener("md:nav-start", onCustomStart);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("md:nav-start", onCustomStart);
    };
  }, [start]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const rtl = dir === "rtl";

  return (
    <>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {visible ? t("Loading") : ""}
      </div>
      <AnimatePresence>
        {visible ? (
          <motion.div
            className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-[3px] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
          >
            <motion.div
              className="nav-progress-bar relative h-full origin-left bg-accent"
              style={{ marginLeft: rtl ? "auto" : undefined, transformOrigin: rtl ? "right center" : "left center" }}
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={reduced ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {overlay ? (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[80] flex items-center justify-center bg-background/55 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.22 }}
          >
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/80 bg-card/90 px-8 py-7 shadow-xl">
              <span className="nav-spinner relative h-11 w-11" aria-hidden="true" />
              <p className="font-serif text-sm tracking-[0.18em] text-foreground">{t("Loading")}</p>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{t("Preparing page")}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
