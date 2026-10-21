import sharp from "sharp";
import { slugify } from "@/lib/utils";

export async function processImage(file: File, basename: string) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const safe = slugify(basename) || "image";

  const full = await sharp(buffer)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true, kernel: sharp.kernel.lanczos3 })
    .webp({ quality: 92, effort: 4, smartSubsample: true })
    .toBuffer();

  const thumb = await sharp(buffer)
    .rotate()
    .resize({ width: 400, withoutEnlargement: true, kernel: sharp.kernel.lanczos3 })
    .webp({ quality: 88, effort: 4, smartSubsample: true })
    .toBuffer();

  return {
    full,
    thumb,
    fullName: `${safe}.webp`,
    thumbName: `${safe}-thumb.webp`,
  };
}
