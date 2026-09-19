"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HtmlContent } from "@/components/html-content";
import { useLocale } from "@/components/locale-provider";
import type { Faq } from "@/lib/types";

export function FAQAccordion({ items }: { items: Pick<Faq, "id" | "question" | "answer">[] }) {
  const { t } = useLocale();
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger>{t(item.question)}</AccordionTrigger>
          <AccordionContent>
            <HtmlContent html={t(item.answer)} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
