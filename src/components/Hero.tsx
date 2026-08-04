"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, CalendarDays } from "lucide-react";
import Countdown from "./Countdown";
import MagneticButton from "./MagneticButton";

const ABOUT_TEXT =
  "Tattoo Convention нь шивээсний урлаг, соёлыг олон нийтэд зөв таниулж, шивээс сонирхдог хүн бүрийг нэг дор нэгтгэх зорилготой арга хэмжээ юм. Мэргэжлийн уран бүтээлчид, шинээр суралцагчид болон шивээс сонирхогч бүх хүнийг хүрэлцэн ирэхийг урьж байна.";

export default function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      {/* ambient gold glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 right-[-10%] w-[560px] h-[560px] rounded-full bg-gold/10 blur-[160px]"
        />
        <motion.div
          animate={{ x: [0, -24, 0], y: [0, 18, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-20%] left-[-10%] w-[420px] h-[420px] rounded-full bg-blood/10 blur-[140px]"
        />
      </div>

      <div className="container-page relative z-10 grid lg:grid-cols-[1.15fr_0.8fr] gap-12 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex items-center gap-4 mb-8"
          >
            <Image src="/logo.png" alt="" aria-hidden width={64} height={64} className="h-14 w-auto drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]" />
            <span className="font-mark text-gold-soft/90 text-base border border-gold-soft/40 px-3 py-1 -rotate-2">
              EST. 2026 · UB MONGOLIA
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="font-display leading-[0.94] text-[clamp(3rem,10vw,7.5rem)]"
          >
            FOCUS
            <br />
            TATTOO
            <br />
            <span className="text-gold-gradient">CONVENTION</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap gap-4 mt-8 text-sm text-ivory/80"
          >
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={16} className="text-gold-soft" /> 2026.09.19 – 09.20, 12:00 PM
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin size={16} className="text-gold-soft" /> Улаанбаатар, Буянт-Ухаа спорт цогцолбор
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-10"
          >
            <Countdown />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-wrap gap-4 mt-10"
          >
            <MagneticButton>
              <a
                href="#artists"
                className="inline-flex items-center px-7 py-3.5 bg-gold text-ink font-semibold text-sm uppercase tracking-[0.08em] hover:bg-gold-soft transition-colors"
              >
                Артистууд
              </a>
            </MagneticButton>
            <MagneticButton>
              <a
                href="#schedule"
                className="inline-flex items-center px-7 py-3.5 border border-ivory/30 text-ivory text-sm uppercase tracking-[0.08em] hover:border-gold hover:text-gold-soft transition-colors"
              >
                Хөтөлбөр
              </a>
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="glass glass-gold p-8 lg:p-9"
        >
          <p className="text-[0.98rem] leading-relaxed text-ivory/75">{ABOUT_TEXT}</p>
          <div className="mt-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-gold/25" />
            <Image src="/logo.png" alt="" aria-hidden width={28} height={28} className="h-6 w-auto opacity-70" />
          </div>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[0.7rem] tracking-[0.2em] uppercase text-ivory/40"
      >
        Scroll
      </motion.div>
    </section>
  );
}
