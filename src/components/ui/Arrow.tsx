interface Props {
  className?: string;
  direction?: "right" | "down" | "up-right" | "left";
}

export function Arrow({
  className = "arrow-link__arrow",
  direction = "right",
}: Props) {
  const rotate =
    direction === "down"
      ? 90
      : direction === "up-right"
        ? -45
        : direction === "left"
          ? 180
          : 0;
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="square"
      aria-hidden="true"
      style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
    >
      <path d="M3 12h17M13 5l7 7-7 7" />
    </svg>
  );
}
