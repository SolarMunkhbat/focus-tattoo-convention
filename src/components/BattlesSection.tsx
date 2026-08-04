"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useCollection } from "@/lib/hooks/useCollection";
import type { BattleCategory } from "@/lib/types";

export default function BattlesSection() {
  const { data, loading } = useCollection<BattleCategory>("battles", "order", "asc");
  const [day, setDay] = useState<1 | 2>(1);

  const groups = useMemo(() => {
    const dayItems = data.filter((b) => b.day === day);
    const order: string[] = [];
    const byGroup = new Map<string, BattleCategory[]>();
    for (const item of dayItems) {
      if (!byGroup.has(item.groupName)) {
        byGroup.set(item.groupName, []);
        order.push(item.groupName);
      }
      byGroup.get(item.groupName)!.push(item);
    }
    return order.map((name) => ({ name, items: byGroup.get(name)! }));
  }, [data, day]);

  return (
    <section id="battles" className="py-24 sm:py-32">
      <div className="container-page">
        <div className="max-w-2xl mb-10">
          <span className="eyebrow">Competition</span>
          <h2 className="font-display text-[clamp(1.9rem,4.5vw,3rem)] mt-3">ТЭМЦЭЭНИЙ АНГИЛАЛ</h2>
          <p className="mt-3 text-ivory/60 max-w-[46ch]">
            Healed tattoo competition болон live tattoo battle-ийн ангилалууд өдөр тус бүрээр.
          </p>
        </div>

        <div className="flex gap-3 mb-10">
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

        {!loading && groups.length === 0 && (
          <div className="glass p-10 text-center text-ivory/50">
            Энэ өдрийн ангилал тун удахгүй нэмэгдэнэ.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
          {groups.map((group, gi) => (
            <motion.div
              key={group.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: gi * 0.08 }}
            >
              <h3 className="font-display text-lg sm:text-xl text-gold-soft pb-2 mb-4 border-b-2 border-gold/70">
                {group.name}
              </h3>
              <ol className="flex flex-col gap-0">
                {group.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-4 py-3 border-b border-white/10">
                    <span
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-display text-xs ${
                        item.itemNumber
                          ? "bg-gold text-ink"
                          : "border border-dashed border-white/30 text-ivory/45"
                      }`}
                    >
                      {item.itemNumber || "—"}
                    </span>
                    <span className="font-semibold uppercase tracking-wide text-sm">{item.itemText}</span>
                  </li>
                ))}
              </ol>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
