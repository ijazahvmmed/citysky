import blurMap from "./data/blur.json";

export interface ImageRef {
  /** Unsplash photo id (placeholder library) */
  id: string;
  alt: string;
}

type BlurEntry = { blur: string; w: number; h: number };
const blur = blurMap as Record<string, BlurEntry>;

/** Remote placeholder source. Swap for local /images when real photography lands. */
export function imageSrc(ref: ImageRef | string, width = 2000, quality = 80) {
  const id = typeof ref === "string" ? ref : ref.id;
  return `https://images.unsplash.com/photo-${id}?w=${width}&q=${quality}&auto=format&fit=crop`;
}

export function imageBlur(ref: ImageRef | string) {
  const id = typeof ref === "string" ? ref : ref.id;
  return blur[id]?.blur;
}

export function imageAspect(ref: ImageRef | string) {
  const id = typeof ref === "string" ? ref : ref.id;
  const e = blur[id];
  return e ? e.w / e.h : 3 / 2;
}

export const img = (id: string, alt: string): ImageRef => ({ id, alt });
