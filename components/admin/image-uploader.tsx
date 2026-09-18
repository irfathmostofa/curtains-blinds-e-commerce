"use client";

import { useRef, useState } from "react";
import { uploadProcessedImage } from "@/app/admin/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Asset = { url: string; alt: string; thumbnailUrl?: string };

export function ImageUploader({
  folder = "product-images",
  suggestedAlt,
  nameHint,
  onUploaded,
  multiple = true,
}: {
  folder?: string;
  suggestedAlt?: string;
  nameHint?: string;
  onUploaded: (asset: Asset) => void;
  multiple?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [alt, setAlt] = useState(suggestedAlt || "");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [meta, setMeta] = useState<string | null>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Keep uploads under 8MB. The server still compresses to WebP.");
      return;
    }
    const localAlt = alt.trim() || suggestedAlt || file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
    setAlt(localAlt);
    setBusy(true);
    setError(null);
    setProgress(20);
    setPreview(URL.createObjectURL(file));
    setMeta(`${file.name} · ${(file.size / 1024).toFixed(0)} KB`);

    const fd = new FormData();
    fd.set("file", file);
    fd.set("alt", localAlt);
    fd.set("folder", folder);
    fd.set("name", nameHint || file.name.replace(/\.[^.]+$/, ""));
    const result = await uploadProcessedImage(fd);
    setProgress(100);
    setBusy(false);
    if ("error" in result && result.error) {
      setError(result.error);
      return;
    }
    onUploaded({ ...(result as Asset), alt: localAlt });
    setTimeout(() => setProgress(0), 600);
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="image-alt">Alt text (required for SEO)</Label>
        <Input
          id="image-alt"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder={suggestedAlt || "Describe the image"}
        />
      </div>
      <div
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-8 text-center transition",
          dragging ? "border-accent bg-secondary" : "border-border hover:border-accent/50",
          busy && "pointer-events-none opacity-70"
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void handleFile(file);
        }}
      >
        <p className="text-sm font-medium">Drop an image or click to browse</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Converted to WebP, max 1600px, quality 80, EXIF stripped. Thumbnail at 400px.
        </p>
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Upload preview" className="mt-4 h-28 w-auto rounded-xl object-cover" />
        ) : null}
        {meta ? <p className="mt-2 text-xs text-muted-foreground">{meta}</p> : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple={multiple}
        className="hidden"
        disabled={busy}
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          files.forEach((file) => void handleFile(file));
          e.target.value = "";
        }}
      />
      {progress > 0 ? (
        <div className="h-2 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuenow={progress}>
          <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
        </div>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
