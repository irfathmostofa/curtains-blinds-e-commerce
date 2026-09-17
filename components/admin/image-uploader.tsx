"use client";

import { useState } from "react";
import { uploadProcessedImage } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ImageUploader({
  folder = "product-images",
  suggestedAlt,
  nameHint,
  onUploaded,
}: {
  folder?: string;
  suggestedAlt?: string;
  nameHint?: string;
  onUploaded: (asset: { url: string; alt: string; thumbnailUrl?: string }) => void;
}) {
  const [alt, setAlt] = useState(suggestedAlt || "");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    setProgress(30);
    const fd = new FormData();
    fd.set("file", file);
    fd.set("alt", alt || suggestedAlt || file.name);
    fd.set("folder", folder);
    fd.set("name", nameHint || file.name.replace(/\.[^.]+$/, ""));
    const result = await uploadProcessedImage(fd);
    setProgress(100);
    setBusy(false);
    if ("error" in result && result.error) {
      setError(result.error);
      return;
    }
    onUploaded(result as { url: string; alt: string; thumbnailUrl?: string });
  }

  return (
    <div className="space-y-3 rounded-2xl border border-dashed p-4">
      <Label htmlFor="alt">Image alt text (required)</Label>
      <Input
        id="alt"
        value={alt}
        onChange={(e) => setAlt(e.target.value)}
        placeholder={suggestedAlt || "Describe the image"}
      />
      <input
        type="file"
        accept="image/*"
        disabled={busy}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
      {progress > 0 ? (
        <div className="h-2 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuenow={progress}>
          <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
        </div>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <p className="text-xs text-muted-foreground">
        Files are resized, converted to WebP (quality 80) and stripped of EXIF on the server.
      </p>
      <Button type="button" variant="ghost" size="sm" disabled>
        Drag and drop supported via file picker
      </Button>
    </div>
  );
}
