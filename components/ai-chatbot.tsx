"use client";

import { useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { submitChatLead } from "@/app/actions";
import type { ChatMessage } from "@/lib/types";
import { DatePicker } from "./date-picker";
import { useLocale } from "./locale-provider";

type Step =
  | "welcome"
  | "name"
  | "phone"
  | "email"
  | "product"
  | "rooms"
  | "location"
  | "estimate"
  | "booking"
  | "done";

type Draft = {
  name: string;
  phone: string;
  email: string;
  product_interest: string;
  rooms: string;
  location: string;
  estimate_min: number;
  estimate_max: number;
  booking_date: string;
  booking_time: string;
};

const PRODUCTS = [
  { id: "curtains-and-drapes", label: "Curtains & drapes" },
  { id: "blinds-and-shades", label: "Blinds & shades" },
  { id: "motorized", label: "Motorized tracks" },
  { id: "mix", label: "A mix" },
];

const ROOMS = ["1–2 rooms", "3–4 rooms", "Whole villa / 5+"];
const LOCATIONS = ["Downtown Dubai", "Palm Jumeirah", "Dubai Marina", "Business Bay", "Abu Dhabi", "Other Dubai"];
const SLOTS = ["09:00–11:00", "10:00–12:00", "12:00–14:00", "16:00–18:00", "18:00–20:00"];

function calcEstimate(product: string, rooms: string) {
  const roomFactor = rooms.startsWith("Whole") ? 5.2 : rooms.startsWith("3") ? 3.4 : 1.6;
  const base =
    product === "motorized" ? 2200 : product === "blinds-and-shades" ? 900 : product === "mix" ? 1600 : 1200;
  const mid = Math.round(base * roomFactor);
  return { min: Math.round(mid * 0.82), max: Math.round(mid * 1.28) };
}

const emptyDraft: Draft = {
  name: "",
  phone: "",
  email: "",
  product_interest: "",
  rooms: "",
  location: "",
  estimate_min: 0,
  estimate_max: 0,
  booking_date: "",
  booking_time: "",
};

export function AiChatbot() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("welcome");
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "bot", text: "Hello — I can suggest an estimate and book a free visit. What is your name?" },
  ]);
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prompt = useMemo(() => {
    if (step === "name") return "Your name";
    if (step === "phone") return "Mobile number";
    if (step === "email") return "Email address";
    return "Type a reply";
  }, [step]);

  function push(role: ChatMessage["role"], text: string) {
    setMessages((m) => [...m, { role, text }]);
  }

  async function finish(next: Draft, extra: ChatMessage[]) {
    setSaving(true);
    setError(null);
    const result = await submitChatLead({
      ...next,
      transcript: extra,
    });
    setSaving(false);
    if (!result.ok) {
      setError(result.error || "Could not save. Please try again.");
      return;
    }
    setStep("done");
  }

  async function onTextSubmit(e: FormEvent) {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;
    setInput("");
    if (step === "name") {
      const next = { ...draft, name: value };
      setDraft(next);
      push("user", value);
      push("bot", `Nice to meet you, ${value}. What is the best mobile number?`);
      setStep("phone");
      return;
    }
    if (step === "phone") {
      const next = { ...draft, phone: value };
      setDraft(next);
      push("user", value);
      push("bot", "And your email, so we can send the written estimate?");
      setStep("email");
      return;
    }
    if (step === "email") {
      const next = { ...draft, email: value };
      setDraft(next);
      push("user", value);
      push("bot", "What are you considering?");
      setStep("product");
    }
  }

  function chooseProduct(item: (typeof PRODUCTS)[number]) {
    const next = { ...draft, product_interest: item.id };
    setDraft(next);
    push("user", item.label);
    push("bot", "How many rooms should we include?");
    setStep("rooms");
  }

  function chooseRooms(rooms: string) {
    const next = { ...draft, rooms };
    setDraft(next);
    push("user", rooms);
    push("bot", "Which area should we visit?");
    setStep("location");
  }

  function chooseLocation(location: string) {
    const range = calcEstimate(draft.product_interest, draft.rooms);
    const next = { ...draft, location, estimate_min: range.min, estimate_max: range.max };
    setDraft(next);
    push("user", location);
    push(
      "bot",
      `Suggested estimate for ${location}: AED ${range.min.toLocaleString()}–${range.max.toLocaleString()}. Would you like to book a free doorstep visit?`
    );
    setStep("estimate");
  }

  async function skipBooking() {
    const extra: ChatMessage[] = [
      ...messages,
      { role: "user", text: "Just send the estimate for now" },
      { role: "bot", text: "Saved. A consultant will follow up on WhatsApp or email." },
    ];
    push("user", "Just send the estimate for now");
    push("bot", "Saved. A consultant will follow up on WhatsApp or email.");
    await finish(draft, extra);
  }

  function startBooking() {
    push("user", "Yes, book a visit");
    push("bot", "Pick a preferred date and time slot.");
    setStep("booking");
  }

  async function confirmBooking() {
    if (!draft.booking_date || !draft.booking_time) {
      setError("Choose a date and time slot.");
      return;
    }
    const extra: ChatMessage[] = [
      ...messages,
      { role: "user", text: `${draft.booking_date} ${draft.booking_time}` },
      {
        role: "bot",
        text: `Booked for ${draft.booking_date}, ${draft.booking_time}. We will confirm shortly.`,
      },
    ];
    push("user", `${draft.booking_date} ${draft.booking_time}`);
    push("bot", `Booked for ${draft.booking_date}, ${draft.booking_time}. We will confirm shortly.`);
    await finish(draft, extra);
  }

  function reset() {
    setDraft(emptyDraft);
    setMessages([{ role: "bot", text: "Hello — I can suggest an estimate and book a free visit. What is your name?" }]);
    setInput("");
    setError(null);
    setStep("name");
  }

  return (
    <>
      <motion.button
        type="button"
        aria-label={t("AI assistant")}
        className="fixed bottom-[5.5rem] left-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg sm:bottom-5 sm:left-5 rtl:left-auto rtl:right-4"
        initial={{ opacity: 0, y: 24, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => {
          setOpen(true);
          if (step === "welcome") setStep("name");
        }}
      >
        <MessageCircle className="h-5 w-5" />
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed bottom-[9.5rem] left-4 z-40 flex h-[min(34rem,70dvh)] w-[min(22.5rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border bg-card shadow-2xl sm:bottom-24 sm:left-5 rtl:left-auto rtl:right-4"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
          >
            <header className="flex items-center justify-between border-b px-4 py-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{t("AI assistant")}</p>
                <p className="font-serif text-lg">{t("Estimate & booking")}</p>
              </div>
              <Button type="button" variant="ghost" size="icon" aria-label={t("Close chat")} onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <div
                  key={`${m.role}-${i}`}
                  className={
                    m.role === "bot"
                      ? "max-w-[90%] rounded-2xl bg-secondary px-3 py-2 text-sm"
                      : "ml-auto max-w-[90%] rounded-2xl bg-primary px-3 py-2 text-sm text-primary-foreground"
                  }
                >
                  {m.text}
                </div>
              ))}

              {step === "product" ? (
                <div className="grid gap-2">
                  {PRODUCTS.map((p) => (
                    <Button key={p.id} type="button" variant="outline" size="sm" onClick={() => chooseProduct(p)}>
                      {p.label}
                    </Button>
                  ))}
                </div>
              ) : null}

              {step === "rooms" ? (
                <div className="grid gap-2">
                  {ROOMS.map((r) => (
                    <Button key={r} type="button" variant="outline" size="sm" onClick={() => chooseRooms(r)}>
                      {r}
                    </Button>
                  ))}
                </div>
              ) : null}

              {step === "location" ? (
                <div className="grid gap-2">
                  {LOCATIONS.map((l) => (
                    <Button key={l} type="button" variant="outline" size="sm" onClick={() => chooseLocation(l)}>
                      {l}
                    </Button>
                  ))}
                </div>
              ) : null}

              {step === "estimate" ? (
                <div className="grid gap-2">
                  <Button type="button" size="sm" onClick={startBooking}>
                    Book a free visit
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => void skipBooking()}>
                    Save estimate only
                  </Button>
                </div>
              ) : null}

              {step === "booking" ? (
                <div className="space-y-3 rounded-2xl border p-3">
                  <DatePicker value={draft.booking_date} onChange={(v) => setDraft((d) => ({ ...d, booking_date: v }))} />
                  <div className="grid gap-2">
                    {SLOTS.map((s) => (
                      <label key={s} className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm">
                        <input
                          type="radio"
                          name="chat-slot"
                          checked={draft.booking_time === s}
                          onChange={() => setDraft((d) => ({ ...d, booking_time: s }))}
                        />
                        {s}
                      </label>
                    ))}
                  </div>
                  <Button type="button" size="sm" className="w-full" disabled={saving} onClick={() => void confirmBooking()}>
                    {saving ? "Saving…" : "Confirm booking"}
                  </Button>
                </div>
              ) : null}

              {step === "done" ? (
                <Button type="button" variant="outline" size="sm" onClick={reset}>
                  Start another enquiry
                </Button>
              ) : null}

              {error ? <p className="text-xs text-destructive">{error}</p> : null}
            </div>

            {step === "name" || step === "phone" || step === "email" ? (
              <form className="flex gap-2 border-t p-3" onSubmit={onTextSubmit}>
                <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={prompt} />
                <Button type="submit" size="icon" aria-label="Send">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
