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
import { trackClientEvent } from "@/lib/analytics/client";
import { DatePicker } from "@/components/date-picker";

const slots = ["09:00–11:00", "10:00–12:00", "12:00–14:00", "16:00–18:00", "18:00–20:00"];

const stepFields: (keyof BookingInput)[][] = [
  ["location"],
  ["preferredDate", "preferredTime"],
  ["address"],
  ["name", "phone", "email"],
];

function firstError(errors: Record<string, { message?: string } | undefined>) {
  const entry = Object.values(errors).find((err) => err?.message);
  return entry?.message || "Please complete every required field.";
}

export function BookingForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    shouldUnregister: false,
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

  async function onNext(index: number) {
    const valid = await form.trigger(stepFields[index], { shouldFocus: true });
    if (!valid) {
      setError(firstError(form.formState.errors as Record<string, { message?: string } | undefined>));
      return false;
    }
    setError(null);
    return true;
  }

  async function onSubmit() {
    const valid = await form.trigger();
    if (!valid) {
      setError(firstError(form.formState.errors as Record<string, { message?: string } | undefined>));
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
    const submitted = form.getValues();
    if (result.eventId) {
      trackClientEvent({
        name: "Schedule",
        eventId: result.eventId,
        contentName: "Free measuring visit",
        contentType: "booking",
        extra: { location: submitted.location, preferred_date: submitted.preferredDate },
      });
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
        onNext={onNext}
        error={error}
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
                  <DatePicker
                    id="date"
                    value={form.watch("preferredDate")}
                    onChange={(value) =>
                      form.setValue("preferredDate", value, { shouldValidate: true, shouldDirty: true })
                    }
                  />
                  {form.formState.errors.preferredDate ? (
                    <p className="text-sm text-destructive">{form.formState.errors.preferredDate.message}</p>
                  ) : null}
                </div>
                <fieldset className="grid gap-2">
                  <legend className="mb-2 text-sm font-medium">Time slot</legend>
                  {slots.map((s) => (
                    <label key={s} className="flex items-center gap-3 rounded-xl border p-3">
                      <input type="radio" value={s} {...form.register("preferredTime")} />
                      {s}
                    </label>
                  ))}
                  {form.formState.errors.preferredTime ? (
                    <p className="text-sm text-destructive">{form.formState.errors.preferredTime.message}</p>
                  ) : null}
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
                {form.formState.errors.address ? (
                  <p className="text-sm text-destructive">{form.formState.errors.address.message}</p>
                ) : null}
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
                  {form.formState.errors.name ? (
                    <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bphone">Phone</Label>
                  <Input id="bphone" {...form.register("phone")} />
                  {form.formState.errors.phone ? (
                    <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bemail">Email (optional)</Label>
                  <Input id="bemail" type="email" {...form.register("email")} />
                  {form.formState.errors.email ? (
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes for the consultant</Label>
                  <Textarea id="notes" {...form.register("notes")} />
                </div>
              </div>
            ),
          },
        ]}
      />
    </form>
  );
}
