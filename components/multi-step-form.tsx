"use client";

import { motion } from "framer-motion";
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
  onNext,
  error,
}: {
  steps: FormStep[];
  onSubmit: () => void;
  submitting?: boolean;
  onNext?: (index: number) => boolean | Promise<boolean>;
  error?: string | null;
}) {
  const [index, setIndex] = useState(0);
  const last = index === steps.length - 1;

  async function move(next: number) {
    if (next > index && onNext) {
      const ok = await onNext(index);
      if (!ok) return;
    }
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
            <p className={`mt-2 hidden text-xs sm:block ${i <= index ? "text-foreground" : "text-muted-foreground"}`}>
              {i + 1}. {s.title}
            </p>
          </li>
        ))}
      </ol>
      {steps.map((s, i) => (
        <div
          key={s.id}
          className={i === index ? "space-y-6" : "hidden"}
          aria-hidden={i !== index}
        >
          <div>
            <h2 className="font-serif text-2xl">{s.title}</h2>
            {s.description ? <p className="mt-1 text-muted-foreground">{s.description}</p> : null}
          </div>
          <div>{s.content}</div>
        </div>
      ))}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="flex justify-between">
        <Button type="button" variant="ghost" disabled={index === 0} onClick={() => void move(index - 1)}>
          Back
        </Button>
        {last ? (
          <Button type="button" onClick={onSubmit} disabled={submitting}>
            {submitting ? "Sending…" : "Submit"}
          </Button>
        ) : (
          <Button type="button" onClick={() => void move(index + 1)}>
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
