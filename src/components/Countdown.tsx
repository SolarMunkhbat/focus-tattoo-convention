"use client";

import { useEffect, useState } from "react";

const EVENT_START = process.env.NEXT_PUBLIC_EVENT_START ?? "2026-09-19T09:00:00+08:00";

function getRemaining() {
  const diff = new Date(EVENT_START).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, done: true };
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    mins: Math.floor((diff % 3_600_000) / 60_000),
    secs: Math.floor((diff % 60_000) / 1000),
    done: false,
  };
}

const UNITS: Array<{ key: "days" | "hours" | "mins" | "secs"; label: string }> = [
  { key: "days", label: "Өдөр" },
  { key: "hours", label: "Цаг" },
  { key: "mins", label: "Минут" },
  { key: "secs", label: "Секунд" },
];

export default function Countdown() {
  const [remaining, setRemaining] = useState<ReturnType<typeof getRemaining> | null>(null);

  useEffect(() => {
    // Client-only: computing this during render would use Date.now() at
    // SSR time and mismatch the client's first paint, so it's set here
    // instead of via a lazy initial state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRemaining(getRemaining());
    const id = setInterval(() => setRemaining(getRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex max-w-lg divide-x divide-gold/20 rounded-2xl border border-gold/20 overflow-hidden"
      role="timer"
      aria-live="off"
    >
      {UNITS.map((u) => (
        <div key={u.key} className="flex-1 text-center py-4 px-1">
          <b
            className="font-display block text-3xl sm:text-4xl text-gold-soft"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {remaining ? String(remaining[u.key]).padStart(2, "0") : "00"}
          </b>
          <span className="block text-[0.65rem] tracking-[0.12em] uppercase text-ivory/55 mt-1">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}
