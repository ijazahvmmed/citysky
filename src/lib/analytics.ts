/**
 * Thin analytics layer. Pushes to the GTM dataLayer and gtag when present,
 * logs to the console in development. Swap the transport here without
 * touching call sites.
 */

export type AnalyticsEvent =
  | { name: "tier_switch"; tier: string; project: string }
  | { name: "catalog_download"; project: string }
  | { name: "catalog_request"; project: string }
  | { name: "whatsapp_click"; page: string; section: string; project?: string }
  | { name: "phone_click"; page: string; section: string; project?: string }
  | { name: "project_view"; project: string }
  | { name: "scroll_depth"; project: string; depth: 25 | 50 | 75 | 100 }
  | { name: "enquiry_submit"; project: string; channel: "whatsapp" | "email" };

type DataLayerWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  gtag?: (...args: unknown[]) => void;
};

export function track(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  const w = window as DataLayerWindow;
  const { name, ...params } = event;

  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event: name, ...params });

  if (typeof w.gtag === "function") {
    w.gtag("event", name, params);
  }

  if (process.env.NODE_ENV !== "production") {
    console.debug(`[analytics] ${name}`, params);
  }
}

export function currentPage() {
  if (typeof window === "undefined") return "";
  return window.location.pathname;
}
