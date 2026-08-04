"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useCollection } from "@/lib/hooks/useCollection";
import { InstagramIcon } from "@/components/icons";
import type { Artist } from "@/lib/types";

export default function ArtistsSection() {
  const { data: artists, loading } = useCollection<Artist>("artists", "name", "asc");
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("Бүгд");
  const [style, setStyle] = useState("Бүгд");

  const countries = useMemo(
    () => ["Бүгд", ...Array.from(new Set(artists.map((a) => a.country).filter(Boolean)))],
    [artists]
  );
  const styles = useMemo(
    () => ["Бүгд", ...Array.from(new Set(artists.map((a) => a.style).filter(Boolean)))],
    [artists]
  );

  const filtered = artists.filter((a) => {
    const matchesSearch =
      !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.studio.toLowerCase().includes(search.toLowerCase());
    const matchesCountry = country === "Бүгд" || a.country === country;
    const matchesStyle = style === "Бүгд" || a.style === style;
    return matchesSearch && matchesCountry && matchesStyle;
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

        <div className="flex flex-wrap gap-3 mb-10">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Артист, студиогоор хайх…"
              className="w-full glass pl-9 pr-3 py-2.5 text-sm text-ivory placeholder:text-ivory/35 outline-none focus:border-gold/60"
            />
          </div>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="glass px-3 py-2.5 text-sm text-ivory outline-none focus:border-gold/60"
          >
            {countries.map((c) => (
              <option key={c} value={c} className="bg-ink">
                {c}
              </option>
            ))}
          </select>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="glass px-3 py-2.5 text-sm text-ivory outline-none focus:border-gold/60"
          >
            {styles.map((s) => (
              <option key={s} value={s} className="bg-ink">
                {s}
              </option>
            ))}
          </select>
        </div>

        {loading && <p className="text-ivory/40 text-sm">Ачааллаж байна…</p>}

        {!loading && filtered.length === 0 && (
          <div className="glass p-10 text-center text-ivory/50">
            {artists.length === 0
              ? "Уран бүтээлчид тун удахгүй зарлагдана."
              : "Хайлтад тохирох артист олдсонгүй."}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((artist, i) => (
            <motion.article
              key={artist.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.06 }}
              className="glass group overflow-hidden"
            >
              <div className="relative aspect-square bg-ink-raised overflow-hidden">
                {artist.photoUrl ? (
                  <Image
                    src={artist.photoUrl}
                    alt={artist.name}
                    fill
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-ivory/25 text-xs uppercase tracking-wide">
                    Зураг байхгүй
                  </div>
                )}
                <div className="absolute inset-0 ring-0 group-hover:ring-2 ring-gold/70 transition-all" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg">{artist.name}</h3>
                <p className="text-xs text-ivory/50 mt-1">
                  {[artist.studio, artist.country].filter(Boolean).join(" · ")}
                </p>
                {artist.style && (
                  <span className="inline-block mt-2 text-[0.65rem] uppercase tracking-wide text-gold-soft border border-gold/30 px-2 py-0.5">
                    {artist.style}
                  </span>
                )}
                {artist.bio && <p className="text-sm text-ivory/60 mt-3 line-clamp-3">{artist.bio}</p>}
                {artist.instagram && (
                  <a
                    href={`https://instagram.com/${artist.instagram.replace(/^@/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-4 text-sm text-ivory/70 hover:text-gold-soft transition-colors"
                  >
                    <InstagramIcon size={14} /> {artist.instagram}
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
