"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { bookingSchema } from "@/lib/validations";
import { submitBooking } from "@/app/actions";
import { trackClientEvent } from "@/lib/analytics/client";

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

function minDate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function BookingForm() {
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [values, setValues] = useState(empty);
  const today = useMemo(minDate, []);

  function setField<K extends FieldName>(key: K, value: (typeof empty)[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setFormError(null);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = bookingSchema.safeParse({
      ...values,
      email: values.email.trim(),
      notes: values.notes.trim(),
      company: "",
    });
    if (!parsed.success) {
      const next: Partial<Record<FieldName, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] || "") as FieldName;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      setFormError(parsed.error.issues[0]?.message || "Please complete the required fields.");
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
    <form className="space-y-8" onSubmit={onSubmit} noValidate>
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        value={values.company}
        onChange={(e) => setField("company", e.target.value)}
      />

      <fieldset className="space-y-3">
        <legend className="font-serif text-2xl">City</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {cities.map((city) => (
            <label key={city} className="flex items-center gap-3 rounded-xl border p-4">
              <input
                type="radio"
                name="location"
                value={city}
                checked={values.location === city}
                onChange={() => setField("location", city)}
              />
              {city}
            </label>
          ))}
        </div>
        {errors.location ? <p className="text-sm text-destructive">{errors.location}</p> : null}
      </fieldset>

      <div className="space-y-4">
        <h2 className="font-serif text-2xl">Date and time</h2>
        <div className="space-y-2">
          <Label htmlFor="date">Preferred date</Label>
          <Input
            id="date"
            type="date"
            min={today}
            value={values.preferredDate}
            onChange={(e) => setField("preferredDate", e.target.value)}
          />
          {errors.preferredDate ? <p className="text-sm text-destructive">{errors.preferredDate}</p> : null}
        </div>
        <fieldset className="grid gap-2">
          <legend className="mb-2 text-sm font-medium">Time slot</legend>
          {slots.map((slot) => (
            <label key={slot} className="flex items-center gap-3 rounded-xl border p-3">
              <input
                type="radio"
                name="preferredTime"
                value={slot}
                checked={values.preferredTime === slot}
                onChange={() => setField("preferredTime", slot)}
              />
              {slot}
            </label>
          ))}
          {errors.preferredTime ? <p className="text-sm text-destructive">{errors.preferredTime}</p> : null}
        </fieldset>
      </div>

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

      <div className="grid gap-4">
        <h2 className="font-serif text-2xl">Your details</h2>
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

      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
      <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? "Sending…" : "Submit booking"}
      </Button>
    </form>
  );
}
