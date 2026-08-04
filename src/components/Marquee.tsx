const ITEMS = [
  "FOCUS TATTOO CONVENTION",
  "2026.09.19 – 09.20",
  "УЛААНБААТАР",
  "STREET ART × TATTOO",
];

function TrackContent() {
  return (
    <>
      {ITEMS.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-6 px-6">
          <span className="font-display text-sm tracking-[0.08em]">{item}</span>
          <span className="text-gold" aria-hidden>
            ✦
          </span>
        </span>
      ))}
    </>
  );
}

export default function Marquee() {
  return (
    <div
      className="relative overflow-hidden border-y border-gold/20 bg-ink-raised/60 py-3"
      aria-hidden="true"
    >
      <div className="flex w-max marquee-track">
        <div className="flex shrink-0">
          <TrackContent />
        </div>
        <div className="flex shrink-0">
          <TrackContent />
        </div>
      </div>
    </div>
  );
}
