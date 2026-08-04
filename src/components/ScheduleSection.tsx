"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useCollection } from "@/lib/hooks/useCollection";
import type { ScheduleItem } from "@/lib/types";

export default function ScheduleSection() {
  const { data, loading } = useCollection<ScheduleItem>("schedule", "day", "asc");
  const [day, setDay] = useState<1 | 2>(1);

  const items = useMemo(
    () =>
      data
        .filter((s) => s.day === day)
        .slice()
        .sort((a, b) => a.time.localeCompare(b.time)),
    [data, day]
  );

  return (
    <section id="schedule" className="py-24 sm:py-32 bg-ink-raised/40">
      <div className="container-page">
        <div className="max-w-2xl mb-10">
          <span className="eyebrow">Programme</span>
          <h2 className="font-display text-[clamp(1.9rem,4.5vw,3rem)] mt-3">ХӨТӨЛБӨР</h2>
        </div>

        <div className="flex gap-3 mb-8">
          {([1, 2] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDay(d)}
              aria-pressed={day === d}
              className={`font-display px-6 py-2.5 text-sm tracking-wide transition-colors border ${
                day === d
                  ? "bg-gold text-ink border-gold"
                  : "border-white/15 text-ivory/60 hover:border-gold/50"
              }`}
            >
              DAY {d}
            </button>
          ))}
        </div>

        {loading && <p className="text-ivory/40 text-sm">Ачааллаж байна…</p>}

        {!loading && items.length === 0 && (
          <div className="glass p-10 text-center text-ivory/50">
            Энэ өдрийн хөтөлбөр тун удахгүй нэмэгдэнэ.
          </div>
        )}

        <ol className="border-t border-white/10">
          {items.map((item, i) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="grid grid-cols-[5.5rem_1fr] sm:grid-cols-[6.5rem_1fr_auto] gap-x-4 gap-y-1 py-5 border-b border-white/10 items-baseline"
            >
              <time
                className="font-display text-gold-soft text-lg"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {item.time}
              </time>
              <div>
                <h3 className="font-semibold tracking-wide uppercase text-sm sm:text-base">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm text-ivory/55 mt-1 max-w-[60ch]">{item.description}</p>
                )}
              </div>
              {item.stage && (
                <span className="font-mark text-xs text-ivory/45 sm:text-right col-span-2 sm:col-span-1">
                  {item.stage}
                </span>
              )}
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
