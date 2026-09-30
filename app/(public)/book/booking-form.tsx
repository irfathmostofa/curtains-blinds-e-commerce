"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/date-picker";
import { MultiStepForm } from "@/components/multi-step-form";
import { bookingSchema } from "@/lib/validations";
import { submitBooking } from "@/app/actions";
import { trackClientEvent } from "@/lib/analytics/client";
import { cn } from "@/lib/utils";

const slots = ["09:00–11:00", "10:00–12:00", "12:00–14:00", "16:00–18:00", "18:00–20:00"];
const cities = ["Dubai", "Abu Dhabi"] as const;

const empty = {
  location: "Dubai" as (typeof cities)[number],
  preferredDate: "",
  preferredTime: "",
  address: "",
  name: "",
  phone: "",
  email: "",
  notes: "",
  company: "",
};

type FieldName = keyof typeof empty;

const stepFields: FieldName[][] = [
  ["location"],
  ["preferredDate", "preferredTime"],
  ["address"],
  ["name", "phone", "email"],
];

export function BookingForm() {
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [values, setValues] = useState(empty);

  function setField<K extends FieldName>(key: K, value: (typeof empty)[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setFormError(null);
  }

  function validate(fields?: FieldName[]) {
    const parsed = bookingSchema.safeParse({
      ...values,
      email: values.email.trim(),
      notes: values.notes.trim(),
      company: "",
    });
    if (parsed.success) {
      setErrors({});
      setFormError(null);
      return true;
    }
    const next: Partial<Record<FieldName, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] || "") as FieldName;
      if (key && !next[key]) next[key] = issue.message;
    }
    const scoped = fields ? Object.fromEntries(Object.entries(next).filter(([key]) => fields.includes(key as FieldName))) : next;
    setErrors(scoped);
    const first = (fields || Object.keys(next) as FieldName[]).map((key) => next[key]).find(Boolean);
    setFormError(first || null);
    if (!fields) return parsed.success;
    return fields.every((key) => !next[key]);
  }

  async function onNext(index: number) {
    return validate(stepFields[index]);
  }

  async function onSubmit() {
    const parsed = bookingSchema.safeParse({
      ...values,
      email: values.email.trim(),
      notes: values.notes.trim(),
      company: "",
    });
    if (!parsed.success) {
      validate();
      return;
    }
    setSubmitting(true);
    setFormError(null);
    const result = await submitBooking(parsed.data);
    setSubmitting(false);
    if (!result.ok) {
      setFormError(result.error || "Something went wrong. Please try again.");
      return;
    }
    if (result.eventId) {
      trackClientEvent({
        name: "Schedule",
        eventId: result.eventId,
        contentName: "Free measuring visit",
        contentType: "booking",
        extra: { location: parsed.data.location, preferred_date: parsed.data.preferredDate },
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
    <form onSubmit={(e) => e.preventDefault()} noValidate>
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        value={values.company}
        onChange={(e) => setField("company", e.target.value)}
      />
      <MultiStepForm
        submitting={submitting}
        onSubmit={onSubmit}
        onNext={onNext}
        error={formError}
        steps={[
          {
            id: "location",
            title: "City",
            description: "Where should we visit?",
            content: (
              <div className="grid gap-3 sm:grid-cols-2">
                {cities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setField("location", city)}
                    className={cn(
                      "rounded-2xl border px-4 py-5 text-left transition",
                      values.location === city
                        ? "border-accent bg-accent/10 shadow-sm"
                        : "hover:border-accent/40 hover:bg-secondary/60"
                    )}
                  >
                    <span className="block font-medium">{city}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {city === "Dubai" ? "Villas, apartments and hotels" : "Mussafah, islands and city homes"}
                    </span>
                  </button>
                ))}
              </div>
            ),
          },
          {
            id: "slot",
            title: "Date and time",
            description: "Pick a day, then a two-hour window.",
            content: (
              <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
                <div className="space-y-2">
                  <Label>Preferred date</Label>
                  <DatePicker
                    inline
                    value={values.preferredDate}
                    onChange={(value) => setField("preferredDate", value)}
                  />
                  {values.preferredDate ? (
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(`${values.preferredDate}T00:00:00`), "EEEE d MMMM yyyy")}
                    </p>
                  ) : null}
                  {errors.preferredDate ? <p className="text-sm text-destructive">{errors.preferredDate}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label>Time slot</Label>
                  <div className="grid gap-2">
                    {slots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setField("preferredTime", slot)}
                        className={cn(
                          "rounded-xl border px-4 py-3 text-left text-sm transition",
                          values.preferredTime === slot
                            ? "border-accent bg-accent/10"
                            : "hover:border-accent/40 hover:bg-secondary/60"
                        )}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  {errors.preferredTime ? <p className="text-sm text-destructive">{errors.preferredTime}</p> : null}
                </div>
              </div>
            ),
          },
          {
            id: "address",
            title: "Address",
            description: "So the consultant can find the right entrance.",
            content: (
              <div className="space-y-2">
                <Label htmlFor="address">Villa / apartment address</Label>
                <Textarea
                  id="address"
                  value={values.address}
                  onChange={(e) => setField("address", e.target.value)}
                  placeholder="Building, community, city"
                />
                {errors.address ? <p className="text-sm text-destructive">{errors.address}</p> : null}
              </div>
            ),
          },
          {
            id: "contact",
            title: "Your details",
            description: "We confirm the slot by phone or WhatsApp.",
            content: (
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bname">Name</Label>
                  <Input id="bname" value={values.name} onChange={(e) => setField("name", e.target.value)} />
                  {errors.name ? <p className="text-sm text-destructive">{errors.name}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bphone">Phone</Label>
                  <Input id="bphone" type="tel" value={values.phone} onChange={(e) => setField("phone", e.target.value)} />
                  {errors.phone ? <p className="text-sm text-destructive">{errors.phone}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bemail">Email (optional)</Label>
                  <Input id="bemail" type="email" value={values.email} onChange={(e) => setField("email", e.target.value)} />
                  {errors.email ? <p className="text-sm text-destructive">{errors.email}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes for the consultant (optional)</Label>
                  <Textarea id="notes" value={values.notes} onChange={(e) => setField("notes", e.target.value)} />
                </div>
              </div>
            ),
          },
        ]}
      />
    </form>
  );
}
