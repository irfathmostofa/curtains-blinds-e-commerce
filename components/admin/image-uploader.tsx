"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { listUploadedImages, uploadProcessedImage, type UploadedImageItem } from "@/app/admin/actions";
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
  inputId = "image-alt",
}: {
  folder?: string;
  suggestedAlt?: string;
  nameHint?: string;
  onUploaded: (asset: Asset) => void;
  multiple?: boolean;
  inputId?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [alt, setAlt] = useState(suggestedAlt || "");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [meta, setMeta] = useState<string | null>(null);
  const [library, setLibrary] = useState<UploadedImageItem[]>([]);
  const [libraryBusy, setLibraryBusy] = useState(false);
  const [libraryError, setLibraryError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [pickedUrl, setPickedUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLibraryBusy(true);
    setLibraryError(null);
    void listUploadedImages(folder).then((result) => {
      if (cancelled) return;
      setLibraryBusy(false);
      if ("error" in result && result.error) {
        setLibraryError(result.error);
        return;
      }
      setLibrary(result.items || []);
    });
    return () => {
      cancelled = true;
    };
  }, [folder]);

  const filteredLibrary = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return library;
    return library.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.alt.toLowerCase().includes(q) ||
        item.url.toLowerCase().includes(q)
    );
  }, [library, query]);

  function rememberAsset(asset: Asset & { name?: string }) {
    setLibrary((items) => {
      if (items.some((item) => item.url === asset.url)) return items;
      return [
        {
          url: asset.url,
          thumbnailUrl: asset.thumbnailUrl || asset.url,
          name: asset.name || asset.url.split("/").pop() || "image",
          alt: asset.alt,
        },
        ...items,
      ];
    });
  }

  function pickExisting(item: UploadedImageItem) {
    const localAlt = alt.trim() || suggestedAlt || item.alt;
    setAlt(localAlt);
    setError(null);
    setPreview(item.thumbnailUrl || item.url);
    setMeta(item.name);
    setPickedUrl(item.url);
    onUploaded({ url: item.url, thumbnailUrl: item.thumbnailUrl, alt: localAlt });
  }

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
    const asset = result as Asset;
    setPickedUrl(asset.url);
    rememberAsset({ ...asset, alt: localAlt, name: file.name });
    onUploaded({ ...asset, alt: localAlt });
    setTimeout(() => setProgress(0), 600);
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor={inputId}>Alt text (required for SEO)</Label>
        <Input
          id={inputId}
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
          Converted to WebP, max 1600px, high quality, EXIF stripped. Thumbnail at 400px.
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

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium">Previously uploaded</p>
          {library.length > 6 ? (
            <Input
              id={`${inputId}-library`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search uploads"
              className="h-8 max-w-[12rem]"
              aria-label="Search previous uploads"
            />
          ) : null}
        </div>
        {libraryBusy ? (
          <p className="text-xs text-muted-foreground">Loading previous uploads…</p>
        ) : libraryError ? (
          <p className="text-sm text-destructive">{libraryError}</p>
        ) : filteredLibrary.length ? (
          <ul className="grid max-h-52 grid-cols-4 gap-2 overflow-y-auto sm:grid-cols-6">
            {filteredLibrary.map((item) => {
              const selected = pickedUrl === item.url;
              return (
                <li key={item.url}>
                  <button
                    type="button"
                    onClick={() => pickExisting(item)}
                    className={cn(
                      "block w-full overflow-hidden rounded-lg border transition hover:border-accent",
                      selected && "border-accent ring-2 ring-accent"
                    )}
                    title={item.alt || item.name}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.thumbnailUrl || item.url}
                      alt={item.alt || item.name}
                      className="h-16 w-full object-cover"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-xs text-muted-foreground">
            {query.trim() ? "No matching uploads." : "No previous uploads yet. New uploads will appear here."}
          </p>
        )}
        <p className="text-xs text-muted-foreground">Pick an existing image to reuse it without uploading again.</p>
      </div>
    </div>
  );
}
