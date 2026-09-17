"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MultiStepForm } from "@/components/multi-step-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { bookingSchema, type BookingInput } from "@/lib/validations";
import { saveDraft, submitBooking } from "@/app/actions";

const slots = ["09:00–11:00", "10:00–12:00", "12:00–14:00", "16:00–18:00", "18:00–20:00"];

export function BookingForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      location: "Dubai",
      preferredDate: "",
      preferredTime: "",
      address: "",
      name: "",
      phone: "",
      email: "",
      notes: "",
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
      setError("Please complete every required field.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const result = await submitBooking(form.getValues());
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
        Your visit request is in. We will confirm the slot by phone or WhatsApp.
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
            id: "location",
            title: "City",
            content: (
              <fieldset className="grid gap-3 sm:grid-cols-2">
                {(["Dubai", "Abu Dhabi"] as const).map((city) => (
                  <label key={city} className="flex items-center gap-3 rounded-xl border p-4">
                    <input type="radio" value={city} {...form.register("location")} />
                    {city}
                  </label>
                ))}
              </fieldset>
            ),
          },
          {
            id: "slot",
            title: "Date and time",
            content: (
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Preferred date</Label>
                  <Input id="date" type="date" {...form.register("preferredDate")} />
                </div>
                <fieldset className="grid gap-2">
                  <legend className="mb-2 text-sm font-medium">Time slot</legend>
                  {slots.map((s) => (
                    <label key={s} className="flex items-center gap-3 rounded-xl border p-3">
                      <input type="radio" value={s} {...form.register("preferredTime")} />
                      {s}
                    </label>
                  ))}
                </fieldset>
              </div>
            ),
          },
          {
            id: "address",
            title: "Address",
            content: (
              <div className="space-y-2">
                <Label htmlFor="address">Villa / apartment address</Label>
                <Textarea id="address" {...form.register("address")} />
              </div>
            ),
          },
          {
            id: "contact",
            title: "Your details",
            content: (
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bname">Name</Label>
                  <Input id="bname" {...form.register("name")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bphone">Phone</Label>
                  <Input id="bphone" {...form.register("phone")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bemail">Email</Label>
                  <Input id="bemail" type="email" {...form.register("email")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes for the consultant</Label>
                  <Textarea id="notes" {...form.register("notes")} />
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
