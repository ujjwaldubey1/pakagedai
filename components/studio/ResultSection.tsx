import type { RefObject } from "react";
import { LoadingOverlay } from "./LoadingOverlay";

interface ResultSectionProps {
  visible: boolean;
  resultError: string | null;
  isGenerating: boolean;
  loadingText: string;
  loadingStep: 1 | 2 | 3;
  refinedPrompt: string | null;
  showRefinedBox: boolean;
  imageUrl: string | null;
  showRegenBtn: boolean;
  showDlBtn: boolean;
  downloadBtnRef: RefObject<HTMLButtonElement | null>;
  onBackToDesign: () => void;
  onRegen: () => void;
  onDownload: () => void;
}

export function ResultSection({
  visible,
  resultError,
  isGenerating,
  loadingText,
  loadingStep,
  refinedPrompt,
  showRefinedBox,
  imageUrl,
  showRegenBtn,
  showDlBtn,
  downloadBtnRef,
  onBackToDesign,
  onRegen,
  onDownload,
}: ResultSectionProps) {
  return (
    <div
      className={`result-section ${visible ? "visible" : ""}`}
      id="result-section"
      role="region"
      aria-live="polite"
      aria-label="Generation results"
    >
      <div className="divider">Your AI Packaging Concept</div>

      {resultError && (
        <div className="error-msg visible" id="error-result" role="alert" aria-live="assertive">
          {resultError}
        </div>
      )}

      <div className="image-frame" id="image-frame">
        {isGenerating && <LoadingOverlay loadingText={loadingText} loadingStep={loadingStep} />}
        {imageUrl && !isGenerating && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="Generated packaging design" />
        )}
      </div>

      {showRefinedBox && refinedPrompt && (
        <div className="refined-box visible" id="refined-box" role="region" aria-label="AI-enhanced prompt details">
          <strong>✨ AI-Enhanced Prompt</strong>
          <span id="refined-text">{refinedPrompt}</span>
        </div>
      )}

      <div className="action-row">
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={onBackToDesign}
          aria-label="Create a new design"
        >
          ← New Design
        </button>
        {showRegenBtn && (
          <button
            type="button"
            className="btn btn-outline btn-sm"
            id="regen-btn"
            onClick={onRegen}
            aria-label="Regenerate the image with the same parameters"
          >
            ↺ Regenerate
          </button>
        )}
        {showDlBtn && (
          <button
            ref={downloadBtnRef}
            type="button"
            className="btn btn-primary btn-sm"
            id="dl-btn"
            onClick={onDownload}
            style={{ flex: 1 }}
            aria-label="Download the generated packaging image"
          >
            ↓ Download
          </button>
        )}
      </div>
    </div>
  );
}
