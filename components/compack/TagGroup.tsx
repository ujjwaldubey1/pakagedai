interface TagGroupProps {
  id: string;
  label: string;
  options: readonly string[];
  selected: string | null;
  onSelect: (value: string) => void;
}

export function TagGroup({ id, label, options, selected, onSelect }: TagGroupProps) {
  return (
    <fieldset className="tag-fieldset">
      <legend className="tag-legend">{label}</legend>
      <div className="tag-group" id={id} role="group" aria-label={`${label} options`}>
        {options.map((option) => (
          <div
            key={option}
            className={`tag ${selected === option ? "selected" : ""}`}
            role="option"
            tabIndex={0}
            aria-selected={selected === option}
            onClick={(e) => {
              e.preventDefault();
              onSelect(option);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(option);
              }
            }}
          >
            {option}
          </div>
        ))}
      </div>
    </fieldset>
  );
}
