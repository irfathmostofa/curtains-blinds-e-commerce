"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MultiStepForm } from "@/components/multi-step-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { estimateSchema, type EstimateInput } from "@/lib/validations";
import { saveDraft, submitEstimate } from "@/app/actions";

const rooms = ["1–2 rooms", "3–4 rooms", "Whole villa / 5+"];
const types = [
  { id: "curtains-and-drapes", label: "Curtains & drapes" },
  { id: "blinds-and-shades", label: "Blinds & shades" },
  { id: "motorized", label: "Motorized" },
  { id: "mix", label: "A mix" },
];
const budgets = [
  { id: "under-5k", label: "Under AED 5,000" },
  { id: "aed-5k-15k", label: "AED 5,000–15,000" },
  { id: "aed-15k-plus", label: "AED 15,000+" },
];

export function EstimateForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<EstimateInput>({
    resolver: zodResolver(estimateSchema),
    defaultValues: {
      rooms: "",
      productType: "",
      budget: "",
      name: "",
      phone: "",
      email: "",
      message: "",
      company: "",
    },
  });

  const values = form.watch();

  useEffect(() => {
    const t = setTimeout(() => {
      void saveDraft(values as unknown as Record<string, string>);
    }, 400);
    return () => clearTimeout(t);
  }, [values]);

  async function onSubmit() {
    const valid = await form.trigger();
    if (!valid) {
      setError(form.formState.errors[Object.keys(form.formState.errors)[0] as keyof EstimateInput]?.message || "Please complete the form");
      return;
    }
    setSubmitting(true);
    setError(null);
    const result = await submitEstimate(form.getValues());
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error || "Something went wrong");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <p className="font-serif text-2xl">
        Thank you. A consultant will contact you on the number you provided, usually the same working day.
      </p>
    );
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...form.register("company")} />
      <MultiStepForm
        submitting={submitting}
        onSubmit={onSubmit}
        steps={[
          {
            id: "rooms",
            title: "How many rooms?",
            content: (
              <fieldset className="grid gap-3">
                {rooms.map((r) => (
                  <label key={r} className="flex items-center gap-3 rounded-xl border p-4">
                    <input type="radio" value={r} {...form.register("rooms")} />
                    {r}
                  </label>
                ))}
              </fieldset>
            ),
          },
          {
            id: "product",
            title: "What are you considering?",
            content: (
              <fieldset className="grid gap-3">
                {types.map((t) => (
                  <label key={t.id} className="flex items-center gap-3 rounded-xl border p-4">
                    <input type="radio" value={t.id} {...form.register("productType")} />
                    {t.label}
                  </label>
                ))}
              </fieldset>
            ),
          },
          {
            id: "budget",
            title: "Budget range",
            content: (
              <fieldset className="grid gap-3">
                {budgets.map((b) => (
                  <label key={b.id} className="flex items-center gap-3 rounded-xl border p-4">
                    <input type="radio" value={b.id} {...form.register("budget")} />
                    {b.label}
                  </label>
                ))}
              </fieldset>
            ),
          },
          {
            id: "contact",
            title: "How can we reach you?",
            content: (
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...form.register("name")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" {...form.register("phone")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...form.register("email")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Notes</Label>
                  <Textarea id="message" {...form.register("message")} />
                </div>
                {error ? <p className="text-sm text-destructive">{error}</p> : null}
              </div>
            ),
          },
        ]}
      />
    </form>
  );
}
