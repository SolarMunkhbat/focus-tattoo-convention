"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {sponsors.map((s, i) => (
            <motion.a
              key={s.id}
              href={s.website || "#"}
              target={s.website ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % 8) * 0.05 }}
              className="glass p-6 flex flex-col items-center text-center gap-3 hover:border-gold/40 transition-colors"
            >
              {s.logoUrl ? (
                <div className="relative h-14 w-full">
                  <Image src={s.logoUrl} alt={s.name} fill className="object-contain" />
                </div>
              ) : (
                <div className="h-14 flex items-center font-display text-ivory/40">{s.name}</div>
              )}
              <p className="text-sm font-semibold">{s.name}</p>
              {s.description && <p className="text-xs text-ivory/50 line-clamp-2">{s.description}</p>}
              {s.website && (
                <span className="inline-flex items-center gap-1 text-[0.7rem] text-gold-soft">
                  <ExternalLink size={12} /> Website
                </span>
              )}
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
