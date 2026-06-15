export function Header() {
  return (
    <div className="header">
      <div className="logo-pill" role="region" aria-label="Branding">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        </svg>
        <span>Compack AI Studio</span>
      </div>
      <h1>
        Visualize your
        <br />
        <em>perfect packaging</em>
      </h1>
      <p className="subtitle">
        Describe your idea — our AI crafts a stunning packaging concept instantly.
      </p>
    </div>
  );
}
