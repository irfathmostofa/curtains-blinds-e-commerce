"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useLocale } from "./locale-provider";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { t } = useLocale();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          aria-label={t("Back to top")}
          className="fixed bottom-[calc(13.5rem+env(safe-area-inset-bottom,0px))] right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg sm:bottom-[5.5rem] sm:right-5 rtl:left-4 rtl:right-auto"
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
