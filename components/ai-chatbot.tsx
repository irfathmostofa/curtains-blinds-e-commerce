"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, Minus, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitChatLead } from "@/app/actions";
import { trackClientEvent } from "@/lib/analytics/client";
import { formatAed } from "@/lib/utils";
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

const STEPS: Step[] = ["name", "phone", "email", "product", "rooms", "location", "estimate", "booking", "done"];

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

const WELCOME = "Hello — I can suggest an estimate and book a free visit. What is your name?";

function progressFor(step: Step) {
  const index = Math.max(0, STEPS.indexOf(step));
  return Math.round(((index + 1) / STEPS.length) * 100);
}

export function AiChatbot() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("welcome");
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "bot", text: WELCOME }]);
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const prompt = useMemo(() => {
    if (step === "name") return t("Your full name");
    if (step === "phone") return t("Mobile number");
    if (step === "email") return t("Email address");
    return t("Type a reply");
  }, [step, t]);

  useEffect(() => {
    const node = scroller.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [messages, step, typing, open]);

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
      setError(result.error || t("Could not save. Please try again."));
      return;
    }
    trackClientEvent({
      name: next.booking_date ? "Schedule" : "Lead",
      eventId: "eventId" in result ? result.eventId : undefined,
      contentName: next.product_interest,
      contentType: "chat_lead",
      value: next.estimate_max,
      currency: "AED",
      extra: { source: "ai-chatbot", location: next.location, rooms: next.rooms },
    });
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
      setTyping(true);
      window.setTimeout(() => {
        setTyping(false);
        push("bot", t("Nice to meet you, {name}. What is the best mobile number?").replace("{name}", value));
        setStep("phone");
      }, 420);
      return;
    }
    if (step === "phone") {
      const next = { ...draft, phone: value };
      setDraft(next);
      push("user", value);
      setTyping(true);
      window.setTimeout(() => {
        setTyping(false);
        push("bot", t("And your email, so we can send the written estimate?"));
        setStep("email");
      }, 420);
      return;
    }
    if (step === "email") {
      const next = { ...draft, email: value };
      setDraft(next);
      push("user", value);
      setTyping(true);
      window.setTimeout(() => {
        setTyping(false);
        push("bot", t("What are you considering?"));
        setStep("product");
      }, 420);
    }
  }

  function chooseProduct(item: (typeof PRODUCTS)[number]) {
    const next = { ...draft, product_interest: item.id };
    setDraft(next);
    push("user", t(item.label));
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      push("bot", t("How many rooms should we include?"));
      setStep("rooms");
    }, 360);
  }

  function chooseRooms(rooms: string) {
    const next = { ...draft, rooms };
    setDraft(next);
    push("user", t(rooms));
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      push("bot", t("Which area should we visit?"));
      setStep("location");
    }, 360);
  }

  function chooseLocation(location: string) {
    const range = calcEstimate(draft.product_interest, draft.rooms);
    const next = { ...draft, location, estimate_min: range.min, estimate_max: range.max };
    setDraft(next);
    push("user", t(location));
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      push(
        "bot",
        t("Suggested estimate for {location}: {range}. Would you like to book a free doorstep visit?")
          .replace("{location}", t(location))
          .replace("{range}", `${formatAed(range.min)}–${formatAed(range.max)}`)
      );
      setStep("estimate");
    }, 480);
  }

  async function skipBooking() {
    const extra: ChatMessage[] = [
      ...messages,
      { role: "user", text: t("Just send the estimate for now") },
      { role: "bot", text: t("Saved. A consultant will follow up on WhatsApp or email.") },
    ];
    push("user", t("Just send the estimate for now"));
    push("bot", t("Saved. A consultant will follow up on WhatsApp or email."));
    await finish(draft, extra);
  }

  function startBooking() {
    push("user", t("Yes, book a visit"));
    push("bot", t("Pick a preferred date and time slot."));
    setStep("booking");
  }

  async function confirmBooking() {
    if (!draft.booking_date || !draft.booking_time) {
      setError(t("Choose a date and time slot."));
      return;
    }
    const extra: ChatMessage[] = [
      ...messages,
      { role: "user", text: `${draft.booking_date} ${draft.booking_time}` },
      {
        role: "bot",
        text: t("Booked for {date}, {time}. We will confirm shortly.")
          .replace("{date}", draft.booking_date)
          .replace("{time}", draft.booking_time),
      },
    ];
    push("user", `${draft.booking_date} ${draft.booking_time}`);
    push(
      "bot",
      t("Booked for {date}, {time}. We will confirm shortly.")
        .replace("{date}", draft.booking_date)
        .replace("{time}", draft.booking_time)
    );
    await finish(draft, extra);
  }

  function reset() {
    setDraft(emptyDraft);
    setMessages([{ role: "bot", text: WELCOME }]);
    setInput("");
    setError(null);
    setStep("name");
  }

  const showComposer = step === "name" || step === "phone" || step === "email";
  const progress = progressFor(step);

  return (
    <>
      <AnimatePresence>
        {!open ? (
          <motion.button
            type="button"
            aria-label={t("AI assistant")}
            className="group fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] left-4 z-30 flex items-center gap-0 rounded-full bg-primary p-0 text-primary-foreground shadow-[0_12px_40px_rgba(28,25,22,0.28)] transition-shadow hover:shadow-[0_16px_48px_rgba(28,25,22,0.34)] sm:bottom-5 sm:left-5 sm:gap-3 sm:py-2 sm:pl-2 sm:pr-4 rtl:left-auto rtl:right-4 rtl:sm:pl-4 rtl:sm:pr-2"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.94 }}
            transition={{ delay: 1.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setOpen(true);
              if (step === "welcome") setStep("name");
            }}
          >
            {/* Icon bubble — pulsing halo replaces the old ring-dot badge */}
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-accent sm:h-11 sm:w-11 sm:bg-accent sm:text-accent-foreground">
              {/* Soft pulse ring behind the icon to signal "online / live" */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-emerald-400/25 [animation-duration:2.4s]"
              />
              {/* Subtle emerald glow */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-emerald-400/40"
              />
              <Sparkles className="relative h-5 w-5 sm:h-4 sm:w-4" />
            </span>

            <span className="hidden text-left sm:block">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">
                {t("Studio concierge")}
              </span>
              <span className="block text-sm font-medium leading-tight">{t("Need an estimate?")}</span>
            </span>
          </motion.button>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="dialog"
            aria-label={t("AI assistant")}
            className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] left-4 z-40 flex h-[min(38rem,70dvh)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-[1.6rem] border border-primary/10 bg-card shadow-[0_24px_80px_rgba(28,25,22,0.22)] sm:bottom-1 sm:left-5 sm:h-[min(38rem,78dvh)] rtl:left-auto rtl:right-4"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="relative overflow-hidden bg-primary px-4 py-3.5 text-primary-foreground">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--accent)/0.35),transparent_55%)]" />
              <div className="relative flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/90 text-accent-foreground shadow-inner">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif text-lg leading-tight">{t("Maison Drape concierge")}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-primary-foreground/75">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {t("Online · typically replies instantly")}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
                  aria-label={t("Close chat")}
                  onClick={() => setOpen(false)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative mt-3 h-1 overflow-hidden rounded-full bg-white/15">
                <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </header>

            <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto bg-[linear-gradient(180deg,hsl(var(--secondary)/0.55),transparent_140px)] p-4">
              {messages.map((m, i) => (
                <div key={`${m.role}-${i}`} className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
                  {m.role === "bot" ? (
                    <div className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                      MD
                    </div>
                  ) : null}
                  <div
                    className={
                      m.role === "bot"
                        ? "max-w-[82%] rounded-2xl rounded-bl-md border border-border/70 bg-card px-3.5 py-2.5 text-sm leading-relaxed text-foreground shadow-sm"
                        : "max-w-[82%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2.5 text-sm leading-relaxed text-primary-foreground shadow-sm"
                    }
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {typing ? (
                <div className="flex items-end gap-2">
                  <div className="mb-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                    MD
                  </div>
                  <div className="flex gap-1 rounded-2xl rounded-bl-md border bg-card px-3 py-3">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/70 [animation-delay:-0.2s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/70 [animation-delay:-0.1s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/70" />
                  </div>
                </div>
              ) : null}

              {step === "product" ? (
                <QuickReplies>
                  {PRODUCTS.map((p) => (
                    <Chip key={p.id} onClick={() => chooseProduct(p)}>
                      {t(p.label)}
                    </Chip>
                  ))}
                </QuickReplies>
              ) : null}

              {step === "rooms" ? (
                <QuickReplies>
                  {ROOMS.map((r) => (
                    <Chip key={r} onClick={() => chooseRooms(r)}>
                      {t(r)}
                    </Chip>
                  ))}
                </QuickReplies>
              ) : null}

              {step === "location" ? (
                <QuickReplies>
                  {LOCATIONS.map((l) => (
                    <Chip key={l} onClick={() => chooseLocation(l)}>
                      {t(l)}
                    </Chip>
                  ))}
                </QuickReplies>
              ) : null}

              {step === "estimate" ? (
                <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                  <div className="border-b bg-secondary/70 px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">{t("Suggested range")}</p>
                    <p className="mt-1 font-serif text-xl">
                      {formatAed(draft.estimate_min)}–{formatAed(draft.estimate_max)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t(draft.location)} · {t(draft.rooms)}
                    </p>
                  </div>
                  <div className="grid gap-2 p-3">
                    <Button type="button" size="sm" className="justify-between" onClick={startBooking}>
                      {t("Book a free visit")}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="outline" size="sm" disabled={saving} onClick={() => void skipBooking()}>
                      {saving ? t("Saving…") : t("Save estimate only")}
                    </Button>
                  </div>
                </div>
              ) : null}

              {step === "booking" ? (
                <div className="space-y-3 rounded-2xl border bg-card p-3 shadow-sm">
                  <p className="text-xs font-medium text-muted-foreground">{t("Preferred visit")}</p>
                  <DatePicker value={draft.booking_date} onChange={(v) => setDraft((d) => ({ ...d, booking_date: v }))} />
                  <div className="grid gap-2">
                    {SLOTS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setDraft((d) => ({ ...d, booking_time: s }))}
                        className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                          draft.booking_time === s
                            ? "border-accent bg-accent/10 text-foreground"
                            : "border-border hover:border-accent/40 hover:bg-secondary/60"
                        }`}
                      >
                        <span>{s}</span>
                        {draft.booking_time === s ? <Check className="h-4 w-4 text-accent" /> : null}
                      </button>
                    ))}
                  </div>
                  <Button type="button" size="sm" className="w-full" disabled={saving} onClick={() => void confirmBooking()}>
                    {saving ? t("Saving…") : t("Confirm booking")}
                  </Button>
                </div>
              ) : null}

              {step === "done" ? (
                <div className="space-y-3 rounded-2xl border bg-card p-4 text-center shadow-sm">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Check className="h-5 w-5" />
                  </div>
                  <p className="font-serif text-lg">{t("Request received")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("A consultant will confirm on WhatsApp or email, usually the same working day.")}
                  </p>
                  <Button type="button" variant="outline" size="sm" onClick={reset}>
                    {t("Start another enquiry")}
                  </Button>
                </div>
              ) : null}

              {error ? <p className="text-xs text-destructive">{error}</p> : null}
            </div>

            {showComposer ? (
              <form className="border-t bg-card p-3" onSubmit={onTextSubmit}>
                <div className="flex items-center gap-2 rounded-full border bg-secondary/50 p-1.5 pl-4">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={prompt}
                    className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                    autoComplete={step === "email" ? "email" : step === "phone" ? "tel" : "name"}
                    inputMode={step === "phone" ? "tel" : step === "email" ? "email" : "text"}
                  />
                  <Button type="submit" size="icon" className="h-9 w-9 shrink-0" aria-label={t("Send")} disabled={!input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            ) : (
              <p className="border-t bg-card px-4 py-2 text-center text-[11px] text-muted-foreground">
                {t("Estimates are indicative. Final quote after measuring.")}
              </p>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function QuickReplies({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2 pl-9">{children}</div>;
}

function Chip({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-primary/15 bg-card px-3.5 py-1.5 text-sm text-foreground shadow-sm transition hover:border-accent hover:bg-secondary"
    >
      {children}
    </button>
  );
}