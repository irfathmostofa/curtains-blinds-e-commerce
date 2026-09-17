import sharp from "sharp";
import { slugify } from "@/lib/utils";

export async function processImage(file: File, basename: string) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const safe = slugify(basename) || "image";

  const full = await sharp(buffer)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  const thumb = await sharp(buffer)
    .rotate()
    .resize({ width: 400, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  return {
    full,
    thumb,
    fullName: `${safe}.webp`,
    thumbName: `${safe}-thumb.webp`,
  };
}
