export type Provider = "pollinations" | "wavespeed";

export interface DesignFormData {
  product: string;
  boxType: string | null;
  material: string | null;
  color: string | null;
  vibe: string | null;
  extra: string;
}

export const BOX_TYPE_OPTIONS = [
  "Monocarton",
  "Rigid Box",
  "Corrugated",
  "Pouch",
  "Blister Tray",
  "Tube",
] as const;

export const MATERIAL_OPTIONS = [
  "Kraft / Eco",
  "Glossy",
  "Matte",
  "Luxury Rigid",
  "Transparent",
] as const;

export const COLOR_OPTIONS = [
  "Earthy Natural",
  "Black & Gold",
  "Pastel",
  "Bold Vibrant",
  "Monochrome",
  "White & Clean",
] as const;

export const VIBE_OPTIONS = [
  "Minimalist",
  "Luxury Premium",
  "Playful",
  "Organic",
  "Bold Modern",
  "Festive",
] as const;
