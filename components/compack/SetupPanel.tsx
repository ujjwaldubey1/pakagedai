import type { Provider } from "@/lib/compack/types";
import { ProviderCard } from "./ProviderCard";

interface SetupPanelProps {
  hidden: boolean;
  provider: Provider;
  setupError: string | null;
  onProviderChange: (provider: Provider) => void;
  onConfirm: () => void;
}

export function SetupPanel({
  hidden,
  provider,
  setupError,
  onProviderChange,
  onConfirm,
}: SetupPanelProps) {
  return (
    <div className={`setup-panel ${hidden ? "hidden" : ""}`} id="setup-panel">
      <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
        <legend style={{ display: "none" }}>AI Provider Selection</legend>
        <div className="provider-pick" role="group" aria-labelledby="provider-label">
          <ProviderCard
            id="card-pollinations"
            provider="pollinations"
            selected={provider === "pollinations"}
            logo="🌸"
            name="Pollinations.ai"
            description="Free daily Pollen credits with Flux image generation"
            badge="FREE POLLEN CREDITS"
            onSelect={onProviderChange}
          />
          <ProviderCard
            id="card-wavespeed"
            provider="wavespeed"
            selected={provider === "wavespeed"}
            logo="⚡"
            name="WaveSpeed AI"
            description="Fast Flux generation with high-quality output"
            badge="$1 FREE ON SIGNUP"
            onSelect={onProviderChange}
          />
        </div>
      </fieldset>

      {setupError && (
        <div className="error-msg visible" id="error-setup" role="alert" aria-live="polite">
          {setupError}
        </div>
      )}

      <button
        type="button"
        className="btn btn-primary"
        onClick={onConfirm}
        aria-label="Continue to design step"
      >
        Continue to Design
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
