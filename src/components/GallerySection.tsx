"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCollection } from "@/lib/hooks/useCollection";
import type { GalleryImage } from "@/lib/types";

export default function GallerySection() {
  const { data: images, loading } = useCollection<GalleryImage>("gallery", "createdAt", "desc");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, close, prev, next]);

  return (
    <section id="gallery" className="py-24 sm:py-32 bg-ink-raised/40">
      <div className="container-page">
        <div className="max-w-2xl mb-10">
          <span className="eyebrow">Flash sheet</span>
          <h2 className="font-display text-[clamp(1.9rem,4.5vw,3rem)] mt-3">GALLERY</h2>
        </div>

        {!loading && images.length === 0 && (
          <div className="soft-card p-10 text-center text-ivory/50">
            Зургууд тун удахгүй нэмэгдэнэ.
          </div>
        )}

        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 [column-fill:_balance]">
          {images.map((img, i) => (
            <motion.button
              key={img.id}
              onClick={() => setOpenIndex(i)}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % 12) * 0.04 }}
              className="relative block w-full mb-3 break-inside-avoid group overflow-hidden"
              aria-label={img.caption || "Flash зураг томруулах"}
            >
              <Image
                src={img.imageUrl}
                alt={img.caption || "FOCUS flash art"}
                width={480}
                height={480}
                sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute inset-0 ring-1 ring-inset ring-white/0 group-hover:ring-gold/60 transition-all" />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openIndex !== null && images[openIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/92 flex items-center justify-center p-4 sm:p-10"
            role="dialog"
            aria-modal="true"
            onClick={close}
          >
            <button
              onClick={close}
              aria-label="Хаах"
              className="absolute top-5 right-5 text-ivory/70 hover:text-gold-soft p-2"
            >
              <X size={28} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Өмнөх"
              className="absolute left-2 sm:left-6 text-ivory/60 hover:text-gold-soft p-2"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Дараах"
              className="absolute right-2 sm:right-6 text-ivory/60 hover:text-gold-soft p-2"
            >
              <ChevronRight size={32} />
            </button>

            <motion.div
              key={openIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative max-w-4xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[openIndex].imageUrl}
                alt={images[openIndex].caption || "FOCUS flash art"}
                width={1200}
                height={1200}
                className="w-full h-auto max-h-[85vh] object-contain"
              />
              {images[openIndex].caption && (
                <p className="text-center text-ivory/60 text-sm mt-3">{images[openIndex].caption}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
