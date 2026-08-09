"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AUTOPLAY_MS = 4500;

export default function ArtistPosterSlideshow({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    if (paused || images.length < 2) return;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, next, images.length]);

  if (images.length === 0) return null;

  return (
    <section className="py-24 sm:py-32">
      <div className="container-page">
        <div className="max-w-2xl mb-12">
          <span className="eyebrow">Line-up</span>
          <h2 className="font-display text-[clamp(1.9rem,4.5vw,3rem)] mt-3">ОРОЛЦОГЧ АРТИСТУУД</h2>
        </div>

        <div
          className="relative mx-auto max-w-sm select-none"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-raised soft-card">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={images[index]}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={images[index]}
                  alt={`FOCUS Tattoo Convention артист ${index + 1}`}
                  fill
                  sizes="(max-width:640px) 100vw, 384px"
                  className="object-cover"
                  priority={index === 0}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={prev}
            aria-label="Өмнөх артист"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-ink/70 flex items-center justify-center text-ivory/80 hover:text-gold-soft hover:bg-ink transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            aria-label="Дараах артист"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-ink/70 flex items-center justify-center text-ivory/80 hover:text-gold-soft hover:bg-ink transition-colors"
          >
            <ChevronRight size={20} />
          </button>

          <div className="flex justify-center gap-2 mt-5">
            {images.map((src, i) => (
              <button
                key={src}
                onClick={() => setIndex(i)}
                aria-label={`Артист ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-gold" : "w-1.5 bg-ivory/25 hover:bg-ivory/45"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
