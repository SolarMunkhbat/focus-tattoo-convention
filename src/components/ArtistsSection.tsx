"use client";

import { useMemo, useState, type MouseEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useCollection } from "@/lib/hooks/useCollection";
import { InstagramIcon } from "@/components/icons";
import type { Artist } from "@/lib/types";

function trackSpotlight(e: MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

export default function ArtistsSection() {
  const { data: artists, loading } = useCollection<Artist>("artists", "name", "asc");
  const [search, setSearch] = useState("");
  const [style, setStyle] = useState("Бүгд");

  const styles = useMemo(
    () => ["Бүгд", ...Array.from(new Set(artists.map((a) => a.style).filter(Boolean)))],
    [artists]
  );

  const filtered = artists.filter((a) => {
    const matchesSearch =
      !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.studio.toLowerCase().includes(search.toLowerCase()) ||
      a.country.toLowerCase().includes(search.toLowerCase());
    const matchesStyle = style === "Бүгд" || a.style === style;
    return matchesSearch && matchesStyle;
  });

  return (
    <section id="artists" className="py-24 sm:py-32">
      <div className="container-page">
        <div className="max-w-2xl mb-12">
          <span className="eyebrow">Line-up</span>
          <h2 className="font-display text-[clamp(1.9rem,4.5vw,3rem)] mt-3">УРАН БҮТЭЭЛЧИД</h2>
          <p className="mt-3 text-ivory/60 max-w-[46ch]">
            Монгол болон гадаадын tattoo артистуудын жагсаалт эндээс шинэчлэгдэнэ.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-12">
          <div className="relative flex-1 min-w-[220px] border-b border-white/15 focus-within:border-gold/70 transition-colors">
            <Search size={15} className="absolute left-0 top-1/2 -translate-y-1/2 text-ivory/35" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Артист, студи, улсаар хайх…"
              className="w-full bg-transparent pl-6 pr-2 py-2.5 text-sm text-ivory placeholder:text-ivory/35 outline-none"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto scroll-gold pb-1 -mb-1">
            {styles.map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`shrink-0 px-3.5 py-1.5 text-xs uppercase tracking-wide rounded-full border transition-colors ${
                  style === s
                    ? "bg-gold text-ink border-gold"
                    : "border-white/15 text-ivory/55 hover:border-gold/50 hover:text-ivory"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading && <p className="text-ivory/40 text-sm">Ачааллаж байна…</p>}

        {!loading && filtered.length === 0 && (
          <div className="soft-card p-10 text-center text-ivory/50">
            {artists.length === 0
              ? "Уран бүтээлчид тун удахгүй зарлагдана."
              : "Хайлтад тохирох артист олдсонгүй."}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((artist, i) => (
            <motion.article
              key={artist.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.06 }}
              onMouseMove={trackSpotlight}
              className="spotlight soft-card group relative aspect-[4/5] overflow-hidden"
            >
              {artist.photoUrl ? (
                <Image
                  src={artist.photoUrl}
                  alt={artist.name}
                  fill
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-ivory/20 text-xs uppercase tracking-wide">
                  Зураг байхгүй
                </div>
              )}

              {/* faint tint over the whole photo so any image sits comfortably in the dark theme */}
              <div className="absolute inset-0 bg-ink/10 pointer-events-none" />
              {/* strong scrim behind the text block — independent of photo brightness */}
              <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-ink from-10% via-ink/80 via-50% to-transparent pointer-events-none" />

              {artist.instagram && (
                <a
                  href={`https://instagram.com/${artist.instagram.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${artist.name} Instagram`}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-ink/75 flex items-center justify-center text-ivory/80 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all hover:text-gold-soft hover:bg-ink"
                >
                  <InstagramIcon size={15} />
                </a>
              )}

              <div className="absolute inset-x-0 bottom-0 p-5 [text-shadow:0_2px_10px_rgba(0,0,0,0.85)]">
                {artist.style && (
                  <span className="inline-block mb-2 text-[0.62rem] uppercase tracking-wide text-gold-soft border border-gold/40 rounded-full px-2.5 py-0.5 bg-ink/80">
                    {artist.style}
                  </span>
                )}
                <h3 className="font-display text-xl leading-none text-white">{artist.name}</h3>
                <p className="text-xs text-ivory/85 mt-1.5">
                  {[artist.studio, artist.country].filter(Boolean).join(" · ")}
                </p>
                {artist.bio && (
                  <p className="text-sm text-ivory/85 mt-2 line-clamp-2 max-h-0 group-hover:max-h-16 opacity-0 group-hover:opacity-100 transition-all duration-300 overflow-hidden">
                    {artist.bio}
                  </p>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
