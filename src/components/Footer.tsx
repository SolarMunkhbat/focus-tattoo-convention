import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-gold/25 py-10 mt-auto">
      <div className="container-page flex items-center gap-3">
        <Image src="/logo.png" alt="FOCUS Tattoo Convention" width={32} height={32} className="h-8 w-auto opacity-90" />
        <span className="text-xs text-ivory/45">
          © 2026 FOCUS Tattoo Convention.
        </span>
      </div>
    </footer>
  );
}
