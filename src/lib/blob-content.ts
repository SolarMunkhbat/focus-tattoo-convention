import { list, put } from "@vercel/blob";

const CONTENT_PATH = "content.json";

/** Baked-in starting content so the site isn't empty before an admin has
 * touched anything — the real Day 1 / Day 2 competition categories. */
const DEFAULT_CONTENT = {
  artists: [] as unknown[],
  schedule: [] as unknown[],
  sponsors: [] as unknown[],
  gallery: [] as unknown[],
  faq: [] as unknown[],
  battles: [
    { id: "seed-1", day: 1, groupName: "Healed Tattoo Competition", itemNumber: "1", itemText: "Best Traditional Tattoo", order: 0, createdAt: 0 },
    { id: "seed-2", day: 1, groupName: "Healed Tattoo Competition", itemNumber: "2", itemText: "Best Color Tattoo", order: 1, createdAt: 0 },
    { id: "seed-3", day: 1, groupName: "Healed Tattoo Competition", itemNumber: "3", itemText: "Best Realistic Tattoo", order: 2, createdAt: 0 },
    { id: "seed-4", day: 1, groupName: "Tattoo Battles", itemNumber: "1", itemText: "Best Small Tattoo 10-12cm", order: 3, createdAt: 0 },
    { id: "seed-5", day: 1, groupName: "Tattoo Battles", itemNumber: "2", itemText: "Best Freehand Tattoo +20cm", order: 4, createdAt: 0 },
    { id: "seed-6", day: 1, groupName: "Tattoo Battles", itemNumber: "3", itemText: "Best Black & Grey Tattoo +20cm", order: 5, createdAt: 0 },
    { id: "seed-7", day: 2, groupName: "Healed Pieces — Healed Tattoo Competition", itemNumber: "1", itemText: "Best Calligraphy Tattoo", order: 6, createdAt: 0 },
    { id: "seed-8", day: 2, groupName: "Healed Pieces — Healed Tattoo Competition", itemNumber: "2", itemText: "Best Black & Grey Tattoo", order: 7, createdAt: 0 },
    { id: "seed-9", day: 2, groupName: "Healed Pieces — Healed Tattoo Competition", itemNumber: "3", itemText: "Best Portrait Tattoo", order: 8, createdAt: 0 },
    { id: "seed-10", day: 2, groupName: "Healed Pieces — Healed Tattoo Competition", itemNumber: "—", itemText: "Best Art", order: 9, createdAt: 0 },
    { id: "seed-11", day: 2, groupName: "Tattoo Battles", itemNumber: "", itemText: "Best Black & Dotwork Tattoo +20cm", order: 10, createdAt: 0 },
    { id: "seed-12", day: 2, groupName: "Tattoo Battles", itemNumber: "", itemText: "Best Color Tattoo +20cm", order: 11, createdAt: 0 },
  ],
};

export type Content = typeof DEFAULT_CONTENT;
export type SectionName = keyof Content;

export const SECTION_NAMES: SectionName[] = ["artists", "schedule", "sponsors", "gallery", "faq", "battles"];

export async function readContent(): Promise<Content> {
  try {
    const { blobs } = await list({ prefix: CONTENT_PATH, limit: 1 });
    const blob = blobs.find((b) => b.pathname === CONTENT_PATH);
    if (!blob) return structuredClone(DEFAULT_CONTENT);

    // Cache-bust in case an edge node cached an earlier response despite
    // cacheControlMaxAge: 0 on write.
    const res = await fetch(`${blob.url}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return structuredClone(DEFAULT_CONTENT);

    const data = await res.json();
    return { ...structuredClone(DEFAULT_CONTENT), ...data };
  } catch {
    // No BLOB_READ_WRITE_TOKEN configured yet, or a transient error —
    // fall back to defaults so the public site still renders something.
    return structuredClone(DEFAULT_CONTENT);
  }
}

export async function writeContent(content: Content): Promise<void> {
  await put(CONTENT_PATH, JSON.stringify(content), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    // content.json is overwritten on every admin edit — without this the
    // CDN caches it for a month by default, so reads right after a write
    // (including the admin's own UI refresh) can serve stale data.
    cacheControlMaxAge: 0,
  });
}
