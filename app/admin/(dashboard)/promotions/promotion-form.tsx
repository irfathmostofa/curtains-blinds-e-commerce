"use client";

import { useMemo, useState, type ClipboardEvent, type FormEvent } from "react";
import { sendPromotion } from "@/app/admin/actions";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PromoContact } from "@/lib/data/catalog";
import { cn } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

function parsePastedEmails(value: string) {
  const unique: string[] = [];
  for (const part of value.split(/[\s,;]+/)) {
    const email = part.replace(/^<|>$/g, "").trim().toLowerCase();
    if (!EMAIL_RE.test(email) || unique.includes(email)) continue;
    unique.push(email);
  }
  return unique;
}

export function PromotionForm({ contacts }: { contacts: PromoContact[] }) {
  const [query, setQuery] = useState("");
  const [pasteValue, setPasteValue] = useState("");
  const [pasted, setPasted] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const allContacts = useMemo(() => {
    const map = new Map<string, PromoContact>();
    contacts.forEach((contact) => map.set(contact.email, { ...contact, sources: [...contact.sources] }));
    pasted.forEach((email) => {
      const existing = map.get(email);
      if (existing) {
        if (!existing.sources.includes("Pasted")) existing.sources.push("Pasted");
        return;
      }
      map.set(email, { email, name: "", sources: ["Pasted"] });
    });
    return Array.from(map.values()).sort((a, b) => a.email.localeCompare(b.email));
  }, [contacts, pasted]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allContacts;
    return allContacts.filter(
      (contact) =>
        contact.email.includes(q) ||
        contact.name.toLowerCase().includes(q) ||
        contact.sources.some((source) => source.toLowerCase().includes(q))
    );
  }, [allContacts, query]);

  const visibleEmails = filtered.map((contact) => contact.email);
  const allVisibleSelected = visibleEmails.length > 0 && visibleEmails.every((email) => selected.includes(email));

  function toggle(email: string) {
    setSelected((current) =>
      current.includes(email) ? current.filter((item) => item !== email) : [...current, email]
    );
  }

  function toggleVisible() {
    setSelected((current) => {
      if (allVisibleSelected) return current.filter((email) => !visibleEmails.includes(email));
      return Array.from(new Set([...current, ...visibleEmails]));
    });
  }

  function addPastedEmails(raw: string) {
    const emails = parsePastedEmails(raw);
    if (!emails.length) {
      setMessage("Paste valid emails separated by commas.");
      return 0;
    }
    setPasted((current) => Array.from(new Set([...current, ...emails])));
    setSelected((current) => Array.from(new Set([...current, ...emails])));
    setPasteValue("");
    setMessage(null);
    return emails.length;
  }

  function onPasteEmails(e: ClipboardEvent<HTMLTextAreaElement>) {
    const text = e.clipboardData.getData("text");
    if (!text.includes(",") && !text.includes(";") && !/\s/.test(text.trim())) return;
    e.preventDefault();
    addPastedEmails(`${pasteValue} ${text}`);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setMessage(null);
    try {
      const result = await sendPromotion({ emails: selected, subject, html });
      if (result.error && !result.sent) {
        setMessage(result.error);
        return;
      }
      if (result.failed) {
        setMessage(`Sent to ${result.sent} of ${result.sent + result.failed}. ${result.error || ""}`.trim());
        return;
      }
      setMessage(`Sent to ${result.sent} ${result.sent === 1 ? "address" : "addresses"}.`);
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8 pb-24">
      <div>
        <h1 className="font-serif text-3xl">Promotions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Unique emails from leads, chat and bookings. Paste extra addresses to add them to the list.
        </p>
      </div>

      <form className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]" onSubmit={onSubmit}>
        <section className="space-y-4 rounded-2xl border bg-card p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl">Recipients</h2>
              <p className="text-sm text-muted-foreground">
                {allContacts.length} unique {allContacts.length === 1 ? "email" : "emails"}
                {selected.length ? ` · ${selected.length} selected` : ""}
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={toggleVisible} disabled={!filtered.length}>
              {allVisibleSelected ? "Clear visible" : "Select visible"}
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="promo-paste">Paste emails</Label>
            <Textarea
              id="promo-paste"
              value={pasteValue}
              onChange={(e) => setPasteValue(e.target.value)}
              onPaste={onPasteEmails}
              placeholder="name@email.com, second@email.com"
              className="min-h-[88px]"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addPastedEmails(pasteValue)}
              disabled={!pasteValue.trim()}
            >
              Add to list
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="promo-search">Search</Label>
            <Input
              id="promo-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name, email or source"
            />
          </div>

          <ul className="max-h-[28rem] space-y-2 overflow-y-auto pr-1">
            {filtered.map((contact) => {
              const checked = selected.includes(contact.email);
              return (
                <li key={contact.email}>
                  <label
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 text-sm",
                      checked ? "border-primary/40 bg-secondary" : "bg-card hover:bg-secondary/60"
                    )}
                  >
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 accent-[hsl(var(--accent))]"
                      checked={checked}
                      onChange={() => toggle(contact.email)}
                    />
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{contact.email}</span>
                      <span className="mt-0.5 block truncate text-muted-foreground">
                        {contact.name || "No name"} · {contact.sources.join(", ")}
                      </span>
                    </span>
                  </label>
                </li>
              );
            })}
            {!filtered.length ? (
              <li className="rounded-xl border px-4 py-8 text-center text-sm text-muted-foreground">
                {allContacts.length ? "No emails match that search." : "No unique emails yet."}
              </li>
            ) : null}
          </ul>
        </section>

        <section className="space-y-5 rounded-2xl border bg-card p-5">
          <div>
            <h2 className="font-serif text-xl">Message</h2>
            <p className="text-sm text-muted-foreground">Subject and body are sent to every selected address.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="promo-subject">Subject</Label>
            <Input
              id="promo-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Autumn drapery offer"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Email body</Label>
            <RichTextEditor
              value={html}
              onChange={setHtml}
              placeholder="Write the promotional email…"
              minHeight="240px"
            />
          </div>

          {selected.length ? (
            <p className="text-xs text-muted-foreground">
              Sending to {selected.length} unique {selected.length === 1 ? "address" : "addresses"}.
            </p>
          ) : null}

          {message ? <p className="text-sm">{message}</p> : null}

          <Button type="submit" disabled={sending || !selected.length}>
            {sending ? "Sending…" : "Send promotion"}
          </Button>
        </section>
      </form>
    </main>
  );
}
