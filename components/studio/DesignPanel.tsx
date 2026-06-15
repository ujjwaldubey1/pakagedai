import type { RefObject } from "react";
import {
  BOX_TYPE_OPTIONS,
  COLOR_OPTIONS,
  MATERIAL_OPTIONS,
  VIBE_OPTIONS,
} from "@/lib/studio/types";
import { TagGroup } from "./TagGroup";

interface DesignPanelProps {
  hidden: boolean;
  product: string;
  extra: string;
  boxType: string | null;
  material: string | null;
  color: string | null;
  vibe: string | null;
  designError: string | null;
  isGenerating: boolean;
  productRef: RefObject<HTMLInputElement | null>;
  onProductChange: (value: string) => void;
  onExtraChange: (value: string) => void;
  onBoxTypeChange: (value: string) => void;
  onMaterialChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onVibeChange: (value: string) => void;
  onBackToSetup: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function DesignPanel({
  hidden,
  product,
  extra,
  boxType,
  material,
  color,
  vibe,
  designError,
  isGenerating,
  productRef,
  onProductChange,
  onExtraChange,
  onBoxTypeChange,
  onMaterialChange,
  onColorChange,
  onVibeChange,
  onBackToSetup,
  onSubmit,
}: DesignPanelProps) {
  return (
    <div className={`panel ${hidden ? "hidden" : ""}`} id="design-panel">
      <form id="design-form" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="product">What&apos;s inside the package?</label>
          <input
            ref={productRef}
            type="text"
            id="product"
            value={product}
            onChange={(e) => onProductChange(e.target.value)}
            placeholder="e.g. Organic skincare cream, Artisan chocolates, Electronics charger…"
            aria-describedby="product-help"
            maxLength={150}
          />
          <div id="product-help" style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
            Be specific about your product for better results
          </div>
        </div>

        <div className="form-row">
          <TagGroup
            id="box-tags"
            label="Package Type"
            options={BOX_TYPE_OPTIONS}
            selected={boxType}
            onSelect={onBoxTypeChange}
          />
          <TagGroup
            id="mat-tags"
            label="Material / Finish"
            options={MATERIAL_OPTIONS}
            selected={material}
            onSelect={onMaterialChange}
          />
        </div>

        <div className="form-row">
          <TagGroup
            id="color-tags"
            label="Color Palette"
            options={COLOR_OPTIONS}
            selected={color}
            onSelect={onColorChange}
          />
          <TagGroup
            id="vibe-tags"
            label="Style / Vibe"
            options={VIBE_OPTIONS}
            selected={vibe}
            onSelect={onVibeChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="extra">
            Extra details <span className="label-hint">optional</span>
          </label>
          <textarea
            id="extra"
            value={extra}
            onChange={(e) => onExtraChange(e.target.value)}
            maxLength={300}
            placeholder="e.g. Japanese minimalism, floral pattern, window cutout, Diwali festive theme…"
            aria-describedby="extra-help"
          />
          <div id="extra-help" style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
            Add any specific details to refine the design
          </div>
        </div>

        {designError && (
          <div className="error-msg visible" id="error-design" role="alert" aria-live="polite">
            {designError}
          </div>
        )}

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onBackToSetup}
            aria-label="Go back to choose a different provider"
          >
            ← Change Provider
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            id="gen-btn"
            disabled={isGenerating}
            aria-label="Generate a packaging image based on your design description"
            aria-busy={isGenerating}
          >
            {!isGenerating && (
              <svg
                id="btn-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
            {isGenerating && <div className="spinner visible" id="gen-spinner" aria-hidden="true" />}
            <span id="btn-label">
              {isGenerating ? "Generating…" : "Generate Packaging Image"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
