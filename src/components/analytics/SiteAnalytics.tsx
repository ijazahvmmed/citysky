"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";

function withoutPersonalQueryData(event: BeforeSendEvent) {
  const url = new URL(event.url);
  // Form values and contact details must never become analytics properties.
  url.search = "";
  url.hash = "";
  return { ...event, url: url.toString() };
}

export function SiteAnalytics() {
  return <Analytics beforeSend={withoutPersonalQueryData} />;
}
