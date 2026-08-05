const BASE_ITEMS = [
  "FOCUS TATTOO CONVENTION",
  "2026.09.19 – 09.20",
  "УЛААНБААТАР",
  "BPRO TATTOO STUDIO",
  "PIERCING MONGOLIA",
];

// Repeated many times over so each half is always wider than any real
// viewport — otherwise the loop shows a blank gap once per cycle instead
// of flowing continuously.
const REPEATS = 3;
const HALF = Array.from({ length: REPEATS }, () => BASE_ITEMS).flat();

function TrackHalf() {
  return (
    <>
      {HALF.map((item, i) => (
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
          <TrackHalf />
        </div>
        <div className="flex shrink-0">
          <TrackHalf />
        </div>
      </div>
    </div>
  );
}
