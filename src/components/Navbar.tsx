"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#schedule", label: "Хөтөлбөр" },
  { href: "#battles", label: "Тэмцээн" },
  { href: "#gallery", label: "Gallery" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Холбоо барих" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-ink/95 border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="container-page flex items-center gap-6 py-3">
        <a href="#top" className="mr-auto flex items-center">
          <Image src="/logo.png" alt="FOCUS Tattoo Convention" width={140} height={44} className="h-9 w-auto" priority />
        </a>

        <nav className="hidden lg:flex items-center gap-7">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs tracking-[0.12em] uppercase text-ivory/65 hover:text-gold-soft transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#artists"
          className="hidden lg:inline-flex items-center rounded-full border border-gold/70 text-gold-soft px-4 py-2 text-xs uppercase tracking-[0.1em] font-semibold hover:bg-gold hover:text-ink transition-colors"
        >
          Артистууд
        </a>

        <button
          aria-label={open ? "Цэс хаах" : "Цэс нээх"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden text-ivory p-2 rounded-full border border-white/15"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-white/10 bg-ink">
          <div className="container-page flex flex-col py-2">
            <a
              href="#artists"
              onClick={() => setOpen(false)}
              className="py-3 text-sm uppercase tracking-wide text-gold-soft border-b border-white/5"
            >
              Артистууд
            </a>
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm uppercase tracking-wide text-ivory/75 border-b border-white/5 last:border-none"
              >
                {l.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
