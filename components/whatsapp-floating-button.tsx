"use client";

import { motion } from "framer-motion";

export function WhatsAppFloatingButton({ phone }: { phone: string }) {
  const href = `https://wa.me/${phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent("Hello, I would like a curtains and blinds estimate.")}`;
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 flex h-14 items-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-semibold text-white shadow-lg"
      aria-label="Chat on WhatsApp"
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
      <span className="relative">WhatsApp</span>
    </motion.a>
  );
}
