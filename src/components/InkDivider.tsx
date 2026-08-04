"use client";

import { motion } from "framer-motion";

/** A single continuous line, drawn in on scroll — a recurring "tattoo
 * needle" motif marking the seam between sections instead of a plain rule. */
export default function InkDivider() {
  return (
    <div className="container-page py-2" aria-hidden="true">
      <svg
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        className="w-full h-8 overflow-visible"
      >
        <motion.path
          d="M0,20 C100,5 180,35 280,20 S460,5 560,20 700,35 800,20 940,5 1040,20 1150,32 1200,18"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
