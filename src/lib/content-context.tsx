"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { Content } from "@/lib/blob-content";

const POLL_MS = 20000;

interface ContentState {
  content: Content | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const ContentContext = createContext<ContentState | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  const refresh = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const res = await fetch("/api/content", { cache: "no-store" });
      if (!res.ok) throw new Error("Контент ачаалахад алдаа гарлаа");
      setContent(await res.json());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Тодорхойгүй алдаа");
    } finally {
      setLoading(false);
      inFlight.current = false;
    }
  }, []);

  useEffect(() => {
    // Initial fetch on mount, then poll — refresh() sets state itself via
    // the async callback path, not synchronously in the effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    const id = setInterval(refresh, POLL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  return (
    <ContentContext.Provider value={{ content, loading, error, refresh }}>{children}</ContentContext.Provider>
  );
}

export function useContentStore() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContentStore must be used within ContentProvider");
  return ctx;
}
