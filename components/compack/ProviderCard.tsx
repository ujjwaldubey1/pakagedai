import type { Provider } from "@/lib/compack/types";

interface ProviderCardProps {
  id: string;
  provider: Provider;
  selected: boolean;
  logo: string;
  name: string;
  description: string;
  badge: string;
  onSelect: (provider: Provider) => void;
}

export function ProviderCard({
  id,
  provider,
  selected,
  logo,
  name,
  description,
  badge,
  onSelect,
}: ProviderCardProps) {
  return (
    <div
      id={id}
      className={`provider-card ${selected ? "selected" : ""}`}
      tabIndex={0}
      role="option"
      aria-selected={selected}
      aria-label={`${name} provider option`}
      onClick={() => onSelect(provider)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(provider);
        }
      }}
    >
      <div className="provider-logo" aria-hidden="true">
        {logo}
      </div>
      <div className="provider-name">{name}</div>
      <div className="provider-desc">{description}</div>
      <span className="provider-badge">{badge}</span>
    </div>
  );
}
