interface StepTabsProps {
  designUnlocked: boolean;
  onDesignTab?: () => void;
}

export function StepTabs({ designUnlocked, onDesignTab }: StepTabsProps) {
  return (
    <div className="step-tabs" role="tablist" aria-label="Setup steps">
      <div
        className={`step-tab ${designUnlocked ? "completed" : "active"}`}
        id="tab-step1"
        role="tab"
        aria-selected={!designUnlocked}
        aria-controls="setup-panel"
      >
        <div className="step-tab-num" aria-hidden="true">
          1
        </div>
        <div className="step-tab-body">
          <div className="step-tab-title">Provider Setup</div>
          <div className="step-tab-sub">Choose AI provider</div>
        </div>
      </div>
      <div
        className={`step-tab ${designUnlocked ? "active" : "locked"}`}
        id="tab-step2"
        role="tab"
        aria-selected={designUnlocked}
        aria-controls="design-panel"
        onClick={designUnlocked ? onDesignTab : undefined}
        onKeyDown={
          designUnlocked
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") onDesignTab?.();
              }
            : undefined
        }
        tabIndex={designUnlocked ? 0 : -1}
      >
        <div className="step-tab-num" aria-hidden="true">
          2
        </div>
        <div className="step-tab-body">
          <div className="step-tab-title">Design Details</div>
          <div className="step-tab-sub">Describe your packaging</div>
        </div>
      </div>
    </div>
  );
}
