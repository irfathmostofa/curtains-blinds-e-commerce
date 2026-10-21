import { normalizeRichText } from "@/lib/html";
import type { Faq, Product, ProductFaq } from "@/lib/types";

export function asProductFaqs(value: unknown): ProductFaq[] {
  let source = value;
  if (typeof source === "string") {
    const raw = source.trim();
    if (!raw) return [];
    try {
      source = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(source)) return [];
  return source
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as { question?: unknown; answer?: unknown };
      const question = String(row.question || "").trim();
      const answer = normalizeRichText(row.answer);
      if (!question || !answer) return null;
      return { question, answer };
    })
    .filter(Boolean) as ProductFaq[];
}

export function defaultProductFaqs(name: string): ProductFaq[] {
  return [
    {
      question: `Is ${name} made to measure?`,
      answer: `Yes. Every ${name} is cut and finished to your window after a complimentary measuring visit in Dubai or Abu Dhabi.`,
    },
    {
      question: "How long does installation take?",
      answer: "Standard lead time is 7–12 working days after fabric confirmation. Express 1–3 day installation is available on selected fabrics.",
    },
    {
      question: "Can I see samples before ordering?",
      answer: "Yes. Your consultant brings fabric books, lining options and hardware samples to the free in-home visit, then leaves a written estimate.",
    },
  ];
}

export function resolveProductFaqs(product: Product, catalogFaqs: Faq[]): Faq[] {
  const own = asProductFaqs(product.faqs).map((item, index) => ({
    id: `${product.id}-faq-${index}`,
    question: item.question,
    answer: item.answer,
    category: product.slug,
    sort_order: index + 1,
  }));
  if (own.length) return own;

  const bySlug = catalogFaqs.filter((item) => item.category === product.slug);
  if (bySlug.length) return bySlug;

  return defaultProductFaqs(product.name).map((item, index) => ({
    id: `${product.id}-default-faq-${index}`,
    question: item.question,
    answer: item.answer,
    category: product.slug,
    sort_order: index + 1,
  }));
}
