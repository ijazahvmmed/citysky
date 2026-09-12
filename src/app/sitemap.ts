import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { projects } from "@/lib/data/projects";
import { journal } from "@/lib/data/journal";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: `${base}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/journal`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    ...journal.map((e) => ({
      url: `${base}/journal/${e.slug}`,
      lastModified: new Date(e.date),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
  ];
}
