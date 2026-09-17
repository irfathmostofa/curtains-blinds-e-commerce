"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

export type FormStep = {
  id: string;
  title: string;
  description?: string;
  content: ReactNode;
};

export function MultiStepForm({
  steps,
  onSubmit,
  submitting,
}: {
  steps: FormStep[];
  onSubmit: () => void;
  submitting?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const step = steps[index];
  const last = index === steps.length - 1;

  function move(next: number) {
    setDir(next > index ? 1 : -1);
    setIndex(next);
  }

  return (
    <div className="space-y-8">
      <ol className="flex gap-2" aria-label="Form progress">
        {steps.map((s, i) => (
          <li key={s.id} className="flex-1">
            <div className="h-1.5 overflow-hidden rounded-full bg-border">
              <motion.div
                className="h-full bg-accent"
                initial={false}
                animate={{ width: i <= index ? "100%" : "0%" }}
                transition={{ duration: 0.35 }}
              />
            </div>
            <p className="mt-2 hidden text-xs text-muted-foreground sm:block">{s.title}</p>
          </li>
        ))}
      </ol>
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={step.id}
          custom={dir}
          initial={{ opacity: 0, x: dir * 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -32 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
          <div>
            <h2 className="font-serif text-2xl">{step.title}</h2>
            {step.description ? <p className="mt-1 text-muted-foreground">{step.description}</p> : null}
          </div>
          <div>{step.content}</div>
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-between">
        <Button type="button" variant="ghost" disabled={index === 0} onClick={() => move(index - 1)}>
          Back
        </Button>
        {last ? (
          <Button type="button" onClick={onSubmit} disabled={submitting}>
            {submitting ? "Sending…" : "Submit"}
          </Button>
        ) : (
          <Button type="button" onClick={() => move(index + 1)}>
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
