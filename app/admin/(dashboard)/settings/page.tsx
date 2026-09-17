"use client";

import { useState } from "react";
import { DEFAULT_SETTINGS } from "@/lib/site";
import { saveSettings } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
  const [json, setJson] = useState(JSON.stringify(DEFAULT_SETTINGS, null, 2));
  const [message, setMessage] = useState<string | null>(null);

  return (
    <main className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-serif text-3xl">Site settings</h1>
      <p className="text-sm text-muted-foreground">
        Nav links, footer contact, WhatsApp, hours and locations are stored as structured JSON. No code change required.
      </p>
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const parsed = JSON.parse(json);
            await saveSettings(parsed);
            setMessage("Saved.");
          } catch {
            setMessage("Invalid JSON.");
          }
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="settings">settings JSON</Label>
          <Textarea id="settings" className="min-h-[420px] font-mono text-xs" value={json} onChange={(e) => setJson(e.target.value)} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">Quick edit: phone</Label>
            <Input
              id="phone"
              defaultValue={DEFAULT_SETTINGS.phone}
              onChange={(e) => {
                const next = JSON.parse(json);
                next.phone = e.target.value;
                setJson(JSON.stringify(next, null, 2));
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wa">WhatsApp number</Label>
            <Input
              id="wa"
              defaultValue={DEFAULT_SETTINGS.whatsapp}
              onChange={(e) => {
                const next = JSON.parse(json);
                next.whatsapp = e.target.value;
                setJson(JSON.stringify(next, null, 2));
              }}
            />
          </div>
        </div>
        {message ? <p className="text-sm">{message}</p> : null}
        <Button type="submit">Save settings</Button>
      </form>
    </main>
  );
}
