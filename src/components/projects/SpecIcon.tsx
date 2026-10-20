import type { ReactNode } from "react";

const icons: Record<string, ReactNode> = {
  "Structure and construction": (
    <>
      <path d="M5 25V9l11-5 11 5v16M5 9l11 5 11-5M16 14v15M5 17l11 5 11-5M5 25l11 4 11-4" />
      <path d="M10.5 6.5v13M21.5 6.5v13" />
    </>
  ),
  "Flooring and finishes": (
    <>
      <path d="m3 17 13-9 13 9-13 9Z" />
      <path d="m9.5 12.5 13 9M9.5 21.5l13-9M3 21l13 9 13-9" />
    </>
  ),
  "Doors and windows": (
    <>
      <path d="M4 28V5h13v23M2 28h17M8 28V9h5v19M11 18v2" />
      <path d="M21 7h8v14h-8ZM25 7v14M21 14h8" />
    </>
  ),
  Kitchen: (
    <>
      <path d="M3 14h26v13H3ZM11 14v13M21 14v13M15 19h2M24 19h2" />
      <path d="M3 11h26M7 11V7a3 3 0 0 1 6 0M5 14v3h6v-3M19 8h7M20 5h5" />
    </>
  ),
  Bathrooms: (
    <>
      <path d="M3 16h26M5 16v5a5 5 0 0 0 5 5h12a5 5 0 0 0 5-5v-5M8 26v3M24 26v3" />
      <path d="M7 16V7a4 4 0 0 1 8 0M12 8h6M13 11v1M17 11v1" />
    </>
  ),
  Electrical: (
    <>
      <path d="M11 4h10v10a5 5 0 0 1-10 0ZM13 1v3M19 1v3M16 19v5a4 4 0 0 0 8 0v-2" />
      <path d="m7 20-4 5h5l-4 5" />
    </>
  ),
  "Exterior and landscaping": (
    <>
      <path d="M5 29h23M17 29V13M17 20C8 20 5 15 6 8c8 0 11 5 11 12ZM17 15C17 7 21 3 28 3c0 7-4 12-11 12Z" />
      <path d="M17 20 10 13M17 15l7-7M9 29v-4M25 29v-5" />
    </>
  ),
};

export function SpecIcon({ category }: { category: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {icons[category] ?? icons["Structure and construction"]}
    </svg>
  );
}
