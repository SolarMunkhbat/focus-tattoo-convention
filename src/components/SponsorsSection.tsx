"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useCollection } from "@/lib/hooks/useCollection";
import type { Sponsor } from "@/lib/types";

export default function SponsorsSection() {
  const { data: sponsors, loading } = useCollection<Sponsor>("sponsors", "createdAt", "asc");

  if (!loading && sponsors.length === 0) return null;

  return (
    <section id="sponsors" className="py-24 sm:py-28">
      <div className="container-page">
        <div className="max-w-2xl mb-10">
          <span className="eyebrow">Supported by</span>
          <h2 className="font-display text-[clamp(1.9rem,4.5vw,3rem)] mt-3">SPONSOR</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-l border-white/10">
          {sponsors.map((s, i) => (
            <motion.a
              key={s.id}
              href={s.website || "#"}
              target={s.website ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % 8) * 0.04 }}
              className="group relative flex flex-col items-center justify-center gap-3 p-8 border-r border-b border-white/10 hover:bg-white/[0.03] transition-colors"
            >
              {s.logoUrl ? (
                <div className="relative h-12 w-full grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                  <Image src={s.logoUrl} alt={s.name} fill className="object-contain" />
                </div>
              ) : (
                <div className="h-12 flex items-center font-display text-ivory/40 group-hover:text-gold-soft transition-colors">
                  {s.name}
                </div>
              )}
              <p className="text-xs text-ivory/45 group-hover:text-ivory/70 transition-colors text-center">
                {s.name}
              </p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
