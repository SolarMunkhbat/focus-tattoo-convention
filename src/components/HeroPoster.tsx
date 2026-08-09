"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroPoster() {
  return (
    <section className="py-12 sm:py-16">
      <div className="container-page flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative w-full max-w-sm rounded-2xl overflow-hidden soft-card"
        >
          <Image
            src="/hero-poster.png"
            alt="FOCUS Tattoo Convention 2026 — Улаанбаатар, Буянт-Ухаа спорт цогцолбор"
            width={1080}
            height={1350}
            className="w-full h-auto"
          />
        </motion.div>
      </div>
    </section>
  );
}
