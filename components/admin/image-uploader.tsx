"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Images, Trash2, Upload } from "lucide-react";
import {
  deleteUploadedImages,
  listUploadedImages,
  uploadProcessedImage,
  type UploadedImageItem,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Asset = { url: string; alt: string; thumbnailUrl?: string; name?: string; bucket?: string };

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
  const modalInputRef = useRef<HTMLInputElement>(null);
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
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!open || loaded) return;
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
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [open, loaded, folder]);

  useEffect(() => {
    setLoaded(false);
    setLibrary([]);
    setSelected([]);
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

  const allVisibleSelected =
    filteredLibrary.length > 0 && filteredLibrary.every((item) => selected.includes(item.url));

  function rememberAsset(asset: Asset & { name?: string }) {
    setLibrary((items) => {
      if (items.some((item) => item.url === asset.url)) return items;
      return [
        {
          url: asset.url,
          thumbnailUrl: asset.thumbnailUrl || asset.url,
          name: asset.name || asset.url.split("/").pop() || "image",
          alt: asset.alt,
          bucket: asset.bucket,
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
    setOpen(false);
  }

  function toggleSelected(url: string) {
    setSelected((urls) => (urls.includes(url) ? urls.filter((item) => item !== url) : [...urls, url]));
  }

  function toggleSelectAll() {
    if (allVisibleSelected) {
      const visible = new Set(filteredLibrary.map((item) => item.url));
      setSelected((urls) => urls.filter((url) => !visible.has(url)));
      return;
    }
    setSelected((urls) => Array.from(new Set([...urls, ...filteredLibrary.map((item) => item.url)])));
  }

  async function removeItems(targets: UploadedImageItem[]) {
    if (!targets.length) return;
    setDeleting(true);
    setLibraryError(null);
    const result = await deleteUploadedImages(
      targets.map((item) => ({ url: item.url, name: item.name, bucket: item.bucket }))
    );
    setDeleting(false);
    if ("error" in result && result.error && !result.deleted?.length) {
      setLibraryError(result.error);
      return;
    }
    const removed = new Set(result.deleted || []);
    setLibrary((items) => items.filter((item) => !removed.has(item.url)));
    setSelected((urls) => urls.filter((url) => !removed.has(url)));
    if (pickedUrl && removed.has(pickedUrl)) {
      setPickedUrl(null);
      setPreview(null);
      setMeta(null);
    }
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
    rememberAsset({ ...asset, alt: localAlt, name: asset.name || file.name });
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

      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Images className="mr-2 h-4 w-4" />
        Media library
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-h-[92dvh] w-[min(96vw,56rem)] max-w-4xl min-h-0 flex-col gap-0 overflow-hidden p-0">
          <div className="shrink-0 space-y-3 border-b px-4 py-4 pr-12 sm:px-6">
            <DialogTitle className="font-serif text-2xl">Media library</DialogTitle>
            <p className="text-xs text-muted-foreground">
              Pick an image to use it, or delete unused files from storage.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search media"
                className="h-9 max-w-xs"
                aria-label="Search media library"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => modalInputRef.current?.click()}
                disabled={busy || deleting}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={toggleSelectAll}
                disabled={!filteredLibrary.length || deleting}
              >
                {allVisibleSelected ? "Clear selection" : "Select all"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-destructive"
                onClick={() => void removeItems(library.filter((item) => selected.includes(item.url)))}
                disabled={!selected.length || deleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete selected ({selected.length})
              </Button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
            {libraryBusy ? (
              <p className="text-sm text-muted-foreground">Loading media…</p>
            ) : libraryError ? (
              <p className="text-sm text-destructive">{libraryError}</p>
            ) : filteredLibrary.length ? (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {filteredLibrary.map((item) => {
                  const isPicked = pickedUrl === item.url;
                  const isChecked = selected.includes(item.url);
                  return (
                    <li key={item.url} className="group relative overflow-hidden rounded-xl border">
                      <label className="absolute left-2 top-2 z-10">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelected(item.url)}
                          className="h-4 w-4 accent-accent"
                          aria-label={`Select ${item.alt || item.name}`}
                        />
                      </label>
                      <button
                        type="button"
                        className="absolute right-2 top-2 z-10 rounded-full bg-card/90 p-1.5 text-destructive opacity-0 shadow-sm transition group-hover:opacity-100 focus:opacity-100"
                        onClick={() => void removeItems([item])}
                        disabled={deleting}
                        aria-label={`Delete ${item.alt || item.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => pickExisting(item)}
                        className={cn(
                          "block w-full overflow-hidden text-left transition hover:opacity-95",
                          isPicked && "ring-2 ring-accent"
                        )}
                        title={item.alt || item.name}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.thumbnailUrl || item.url}
                          alt={item.alt || item.name}
                          className="h-28 w-full object-cover"
                        />
                        <span className="block truncate px-2 py-1.5 text-xs text-muted-foreground">
                          {item.alt || item.name}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                {query.trim() ? "No matching media." : "No media yet. Upload an image to start the library."}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <input
        ref={modalInputRef}
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
    </div>
  );
}
