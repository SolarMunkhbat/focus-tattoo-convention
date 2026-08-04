"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useCollection } from "@/lib/hooks/useCollection";
import type { FaqItem } from "@/lib/types";

export default function FaqSection() {
  const { data: faqs, loading } = useCollection<FaqItem>("faq", "order", "asc");
  const [openId, setOpenId] = useState<string | null>(null);

  if (!loading && faqs.length === 0) return null;

  return (
    <section id="faq" className="py-24 sm:py-32">
      <div className="container-page max-w-3xl">
        <div className="mb-10">
          <span className="eyebrow">FAQ</span>
          <h2 className="font-display text-[clamp(1.9rem,4.5vw,3rem)] mt-3">АСУУЛТ ХАРИУЛТ</h2>
        </div>

        <div className="border-t border-white/10">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className="border-b border-white/10">
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-semibold text-sm sm:text-base">{faq.question}</span>
                  <ChevronDown
                    size={18}
                    className={`text-gold-soft shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 text-sm text-ivory/60 max-w-[65ch]">{faq.answer}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
