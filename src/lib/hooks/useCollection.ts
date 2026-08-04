"use client";

import { useMemo } from "react";
import { useContentStore } from "@/lib/content-context";
import type { Content } from "@/lib/blob-content";

/**
 * Reads one section out of the shared content store (polled from
 * /api/content, backed by a single Vercel Blob JSON file). Same
 * {data, loading, error} shape as before so section/admin components
 * didn't need to change.
 */
export function useCollection<T>(
  name: keyof Content,
  orderByField?: keyof T,
  direction: "asc" | "desc" = "asc"
) {
  const { content, loading, error } = useContentStore();

  const data = useMemo(() => {
    const arr = ((content?.[name] as unknown as T[]) ?? []).slice();
    if (orderByField) {
      arr.sort((a, b) => {
        const av = a[orderByField];
        const bv = b[orderByField];
        if (av < bv) return direction === "asc" ? -1 : 1;
        if (av > bv) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return arr;
  }, [content, name, orderByField, direction]);

  return { data, loading, error };
}
