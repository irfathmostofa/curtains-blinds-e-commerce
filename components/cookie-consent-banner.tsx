"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

function setConsent(value: "accepted" | "rejected") {
  document.cookie = `cookie_consent=${value};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const match = document.cookie.split("; ").find((c) => c.startsWith("cookie_consent="));
    if (!match) setVisible(true);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 p-4 backdrop-blur md:p-6"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="max-w-2xl text-sm text-muted-foreground">
              We use essential cookies to run this site and optional analytics after you accept. Read our{" "}
              <a className="underline" href="/privacy-policy">
                privacy policy
              </a>
              .
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setConsent("rejected");
                  setVisible(false);
                }}
              >
                Reject
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setConsent("accepted");
                  setVisible(false);
                }}
              >
                Accept
              </Button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
