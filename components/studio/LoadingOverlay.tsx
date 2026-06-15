interface LoadingOverlayProps {
  loadingText: string;
  loadingStep: 1 | 2 | 3;
}

export function LoadingOverlay({ loadingText, loadingStep }: LoadingOverlayProps) {
  return (
    <div className="loading-overlay" role="status" aria-label="Generation in progress">
      <div className="loading-ring" aria-hidden="true" />
      <div>
        <div className="loading-text">{loadingText}</div>
        <div className="loading-sub">This takes 15–30 seconds</div>
      </div>
      <div className="step-dots" aria-hidden="true">
        <div className={`dot ${loadingStep > 1 ? "done" : loadingStep === 1 ? "active" : ""}`} />
        <div className={`dot ${loadingStep > 2 ? "done" : loadingStep === 2 ? "active" : ""}`} />
        <div className={`dot ${loadingStep === 3 ? "active" : ""}`} />
      </div>
    </div>
  );
}
