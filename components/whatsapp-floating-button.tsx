"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/components/locale-provider";

export function WhatsAppFloatingButton({ phone }: { phone: string }) {
  const { t, locale } = useLocale();
  const href = `https://wa.me/${phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
    locale === "ar" ? "مرحبا، أرغب في عرض سعر للستائر والبلاندز." : "Hello, I would like a curtains and blinds estimate."
  )}`;
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[5.5rem] right-4 z-30 flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-white shadow-lg sm:bottom-5 sm:right-5 sm:h-14 sm:px-5 rtl:left-4 rtl:right-auto"
      aria-label={t("Chat on WhatsApp")}
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
    >
      <motion.span
        className="absolute inset-0 rounded-full bg-[#25D366]"
        animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0, 0.35] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
        aria-hidden="true"
      />
      <span className="relative">{t("WhatsApp")}</span>
    </motion.a>
  );
}
